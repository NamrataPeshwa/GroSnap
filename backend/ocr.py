from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
from PIL import Image
import re
import numpy as np
#ocr_upload in frontend,customerside
# Set the tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r"D:\ocr\tesseract.exe" # Update path if needed

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Dummy store data (In a real-world app, this should come from a database)
stores = [
    {
        "name": "Store A",
        "inventory": ["apple", "banana", "carrot", "lettuce", "milk", "cheese", "bread", "Turmeric", "bay leaf", "Mustard seeds", "Sugar"]
    },
    {
        "name": "Store B",
        "inventory": ["orange", "milk", "bread", "butter", "carrot", "sugar", "salt"]
    },
    {
        "name": "Store C",
        "inventory": ["potato", "onion", "carrot", "lettuce", "bread", "milk"]
    }
]

def extract_handwritten_text(image_data):
    # Step 1: Convert the image data to OpenCV format
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Step 2: Preprocess the image (grayscale, blur, etc.)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 3)

    pil_image = Image.fromarray(gray)

    # Step 3: Perform OCR
    custom_config = r'--oem 1 --psm 6'  # Good default for blocks of handwritten text
    text = pytesseract.image_to_string(pil_image, config=custom_config, lang='eng')
    return text

def clean_ocr_output(text):
    """
    Cleans up the OCR output by handling newlines, normalizing spaces within lines, 
    and converting spaces to underscores to treat words as one continuous string.
    """
    # Normalize spaces within each line but preserve line structure.
    lines = text.splitlines()  # Split the text into lines (preserve structure)
    cleaned_lines = []

    for line in lines:
        # Remove unwanted characters, normalize whitespace within the line
        cleaned_line = re.sub(r'\s+', ' ', line).strip()  # Replace multiple spaces with one space
        
        # Convert spaces between words into underscores
        cleaned_line = cleaned_line.replace(" ", "_")
        
        cleaned_lines.append(cleaned_line)

    # Join the cleaned lines back together with a newline
    cleaned_text = '\n'.join(cleaned_lines)

    return cleaned_text

def search_nearby_stores(items):
    results = {
        "found": [],
        "not_found": [],
    }

    for store in stores:
        found_items = []
        not_found_items = []

        for item in items:
            # Clean and normalize item text, ensuring the comparison is case-insensitive
            normalized_item = clean_ocr_output(item).lower()

            matched = False
            for inventory_item in store["inventory"]:
                # Clean the store inventory item (make it lowercase and normalize spacing)
                normalized_inventory_item = clean_ocr_output(inventory_item).lower()
                
                # Match item with store inventory (allowing for variations like spacing issues)
                if normalized_item == normalized_inventory_item:
                    found_items.append(item.replace("_", " "))  # Convert back to human-readable form
                    matched = True
                    break  # Found, no need to search further for this item

            if not matched:
                not_found_items.append(item.replace("_", " "))  # Convert back to human-readable form

        results["found"].append({
            "store": store["name"],
            "found_items": found_items,
            "not_found_items": not_found_items
        })

    return results

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['file']
    
    # If no file is selected
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Extract text from image
        extracted_text = extract_handwritten_text(file.read())
        cleaned_text = clean_ocr_output(extracted_text)

        return jsonify({"message": "Text extracted successfully!", "text": cleaned_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save-edited-text', methods=['POST', 'OPTIONS'])
def save_edited_text():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400

    data = request.get_json(silent=True)
    if not data or 'correctedText' not in data:
        return jsonify({'error': 'No corrected text provided'}), 400

    corrected_text = data['correctedText']

    try:
        with open('corrected_text.txt', 'w', encoding='utf-8') as f:
            f.write(corrected_text)
        return jsonify({'message': 'Text saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to save: {str(e)}'}), 500

@app.route('/find-items', methods=['POST'])
def find_items():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    # Assuming that extracted items are words in the text
    text = data['text'].lower()  # Lowercase the text to make it case-insensitive
    items = text.split()  # Split the text into individual items

    results = search_nearby_stores(items)

    # Add a summary like "7 out of 10 items found"
    total_items = len(items)
    total_found = sum(len(result['found_items']) for result in results["found"])
    message = f"{total_found} out of {total_items} items found."

    return jsonify({
        'message': message,
        'store_results': results["found"]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
