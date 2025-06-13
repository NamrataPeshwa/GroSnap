from app import create_app
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import os

app = create_app()
CORS(app)

# Route to render the OCR Upload HTML page
@app.route('/upload-page')
def upload_page():
    return render_template('upload.html')  # Make sure 'upload.html' extends base.html

# Route to handle image upload and OCR
@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        image_path = os.path.join('static/uploads', file.filename)
        file.save(image_path)

        try:
            img = Image.open(image_path)
            extracted_text = pytesseract.image_to_string(img)
            return jsonify({'text': extracted_text})
        except Exception as e:
            return jsonify({'error': str(e)})

    return jsonify({'error': 'File upload failed'})

# Route to find items from text (optional logic stub)
@app.route('/find-items', methods=['POST'])
def find_items():
    data = request.get_json()
    input_text = data.get('text', '')

    # Dummy response - Replace with real matching logic
    response = {
        'message': 'Matching complete.',
        'store_results': [
            {
                'store': 'Fresh Mart',
                'found_items': ['milk', 'bread'],
                'not_found_items': ['cereal']
            },
            {
                'store': 'Local Grocery',
                'found_items': ['bread'],
                'not_found_items': ['milk', 'cereal']
            }
        ]
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
