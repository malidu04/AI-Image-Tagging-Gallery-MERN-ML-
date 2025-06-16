from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import torch
from torchvision import models, transforms
from PIL import Image
import io

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Load pretrained ResNet50 model once at startup
model = models.resnet50(pretrained=True)
model.eval()

# Load ImageNet class labels
# You can download this file from https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt
with open('imagenet_classes.txt') as f:
    idx_to_labels = [line.strip() for line in f.readlines()]

# Preprocessing pipeline matching ResNet50 input
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # ImageNet means
        std=[0.229, 0.224, 0.225]    # ImageNet stds
    )
])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/models', methods=['GET'])
def get_models():
    return jsonify([
        {"name": "resnet50", "description": "Image classification with ResNet50 pretrained on ImageNet"}
    ])

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    filename = secure_filename(file.filename)

    # Read image bytes and open with PIL
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    # Preprocess image for model
    input_tensor = preprocess(img)
    input_batch = input_tensor.unsqueeze(0)  # create batch dimension

    # Run inference
    with torch.no_grad():
        output = model(input_batch)
    
    # Calculate probabilities (softmax)
    probabilities = torch.nn.functional.softmax(output[0], dim=0)

    # Get top 5 predictions
    top5_prob, top5_catid = torch.topk(probabilities, 5)

    tags = []
    confidence = {}

    for i in range(top5_prob.size(0)):
        label = idx_to_labels[top5_catid[i]]
        prob = top5_prob[i].item()
        tags.append(label)
        confidence[label] = round(prob, 4)

    return jsonify({
        "filename": filename,
        "tags": tags,
        "confidence": confidence,
        "message": "Image analyzed successfully"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

