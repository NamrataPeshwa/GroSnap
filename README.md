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
| Frontend      | HTML5, CSS, JS                      |
| Backend       | Flaskapi (Python)                   |
| OCR Engine    | Tesseract OCR + pytesseract         |
| Image Handling| Pillow                              |
| WhatsApp API  | WhatsApp Cloud API / wa.me link     |

---

## 🛠 How It Works

1. **Upload** a grocery list photo.
2. **OCR** extracts item names from the image.
3. User location is fetched via the browser.
4. Backend matches items against nearby registered Kirana stores.
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
# 🚀 GroSnap – The Future of Kirana Shopping

**Revolutionizing local grocery shopping with AI-powered convenience while preserving the human touch of neighborhood stores**

## 🌟 Why GroSnap?

| Traditional Shopping | GroSnap Advantage |
|----------------------|-------------------|
| Manual list writing | 📸 Snap-to-Order OCR |
| Calling/visiting stores | 📱 Digital convenience |
| Uncertain availability | ✅ Real-time item matching |
| Cash-only transactions | 💳 Flexible payment options |
| No order tracking | 🚚 Delivery updates |

## 🔍 Enhanced Features

### 📸 Smart Snap-to-Order
- **Multi-language OCR**: Supports English, Hindi, and regional languages
- **Handwriting adaptation**: Learns from corrections to improve accuracy
- **Image enhancement**: Auto-cropping and contrast adjustment for better OCR

### 🏪 Intelligent Store Matching

graph TD
    A[User Upload] --> B(OCR Processing)
    B --> C[Item Extraction]
    C --> D{Location Services}
    D --> E[Store Inventory API]
    E --> F[Match Scoring]
    F --> G[Top 3 Recommendations]

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
