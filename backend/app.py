from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
from PIL import Image
import io
import base64
import cv2

app = Flask(__name__)
CORS(app)

def decode_base64_image(base64_string):
    """Decode base64 image string to numpy array"""
    try:
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
       
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return np.array(image)
    except Exception as e:
        raise ValueError(f"Failed to decode image: {str(e)}")

def compare_faces(image1_array, image2_array, tolerance=0.6):
    """Compare two face images and return similarity result"""
    try:
        face_encodings_1 = face_recognition.face_encodings(image1_array)
        face_encodings_2 = face_recognition.face_encodings(image2_array)
        
        if len(face_encodings_1) == 0:
            return {"error": "No face found in first image", "same_person": False}
        
        if len(face_encodings_2) == 0:
            return {"error": "No face found in second image", "same_person": False}
        
        face_encoding_1 = face_encodings_1[0]
        face_encoding_2 = face_encodings_2[0]
        
        matches = face_recognition.compare_faces([face_encoding_1], face_encoding_2, tolerance=tolerance)
        face_distance = face_recognition.face_distance([face_encoding_1], face_encoding_2)[0]
        
        confidence = max(0, (1 - face_distance) * 100)
        
        return {
            "same_person": matches[0],
            "confidence": round(confidence, 2),
            "distance": round(face_distance, 4),
            "faces_detected": {
                "image1": len(face_encodings_1),
                "image2": len(face_encodings_2)
            }
        }
        
    except Exception as e:
        return {"error": f"Face comparison failed: {str(e)}", "same_person": False}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "face-comparison"})

@app.route('/compare', methods=['POST'])
def compare_faces_endpoint():
    """Main endpoint for face comparison"""
    try:
        data = request.get_json()
        
        if not data or 'image1' not in data or 'image2' not in data:
            return jsonify({
                "error": "Missing required fields. Please provide 'image1' and 'image2' as base64 strings",
                "same_person": False
            }), 400
        
        tolerance = data.get('tolerance', 0.6)
        if not 0.3 <= tolerance <= 1.0:
            tolerance = 0.6
        
        try:
            image1 = decode_base64_image(data['image1'])
            image2 = decode_base64_image(data['image2'])
        except ValueError as e:
            return jsonify({
                "error": str(e),
                "same_person": False
            }), 400
        
        result = compare_faces(image1, image2, tolerance)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "same_person": False
        }), 500

@app.route('/compare-files', methods=['POST'])
def compare_face_files():
    """Alternative endpoint for file uploads"""
    try:
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({
                "error": "Please upload both image1 and image2 files",
                "same_person": False
            }), 400
        
        file1 = request.files['image1']
        file2 = request.files['image2']
        
        tolerance = float(request.form.get('tolerance', 0.6))
        if not 0.3 <= tolerance <= 1.0:
            tolerance = 0.6
        
        image1 = np.array(Image.open(file1.stream).convert('RGB'))
        image2 = np.array(Image.open(file2.stream).convert('RGB'))
        
        result = compare_faces(image1, image2, tolerance)
        import json
        def make_serializable(obj):
            if isinstance(obj, np.generic):
                return obj.item()
            if isinstance(obj, dict):
                return {k: make_serializable(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [make_serializable(i) for i in obj]
            return obj
        result = make_serializable(result)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"File processing error: {str(e)}",
            "same_person": False
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)