# 🛒 GroSnap – Digitize Your Local Kirana Stores

GroSnap is a web-based platform that empowers users to digitally order groceries from their nearby Kirana stores using smart features like **Snap-to-Order (OCR)** and **WhatsApp list sharing**. It bridges the gap between **digital convenience** and **local trust**.

---

## 📸 Key Features

- **Snap-to-Order**: Upload an image of a handwritten or typed grocery list. The app uses **OCR** to extract items and build a digital cart.
- **Nearest Store Matching**: Based on the user's location, GroSnap finds the **nearest Kirana store** with the **highest item match**.
- **WhatsApp API Integration**: Automatically sends the finalized grocery list to the Kirana store via WhatsApp, enabling human confirmation.
- **Pay on Delivery**: No pre-payment required — customers pay via UPI or cash when the groceries arrive.
- **Item Availability Feedback**: Displays which items from your list are available at the selected store (e.g., "7 out of 10 items available").

---

## 🧠 Tech Stack

| Component     | Technology                          |
|--------------|--------------------------------------|
| Frontend      | React.js / HTML5 (planned)          |
| Backend       | FastAPI (Python)                    |
| OCR Engine    | Tesseract OCR + pytesseract         |
| Image Handling| Pillow                              |
| WhatsApp API  | WhatsApp Cloud API / wa.me link     |
| Location      | Browser Geolocation + Haversine     |

---

## 🛠 How It Works

1. **Upload** a grocery list photo.
2. **OCR** extracts item names from the image.
3. User location is fetched via the browser.
4. Backend matches items against nearby store inventories.
5. Best-fit store is shown (e.g., “Ravi Kirana has 7 of 10 items”).
6. On checkout:
   - A summary is generated.
   - A WhatsApp message is prefilled and sent to the store.
   - User is shown the store phone number and advised to pay on delivery.

---

## 🚀 Getting Started (Local Setup)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/grosnap.git
   cd grosnap
