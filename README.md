# <h1 align="center">🛒 GroSnap – Digitize Your Local Kirana Stores</h1>

<h4 align="center">📸 Snap. 📍 Match. 📲 Order. — All from your local Kirana store.</h4>

<p align="center">
  A smart grocery ordering platform blending <b>AI</b>, <b>geolocation</b>, and <b>WhatsApp</b> to simplify your local shopping.
</p>

## 🚀 Project Overview

**GroSnap** is a smart grocery ordering platform that connects consumers with local Kirana stores through a seamless digital experience. Upload a photo of your handwritten or printed grocery list, and GroSnap uses **OCR** to extract items, finds the nearest Kirana stores matching your list, and sends the order via **WhatsApp** for easy confirmation.

This solution leverages modern web technologies to empower local vendors while making grocery shopping **fast**, **contactless**, and **convenient**.

---

## 🧰 Tech Stack

| Layer          | Technology                |
| -------------- | -------------------------|
| **Frontend**   | React + Vite             |
| **Styling**    | Tailwind CSS             |
| **Backend**    | Python + Flask           |
| **OCR Engine** | Tesseract OCR (pytesseract) |
| **Messaging API** | WhatsApp Cloud API     |
| **Database**   | Firebase Firestore       |
| **Location**   | Browser Geolocation API  |

---

## 📸 Key Features

- **Snap-to-Order:** Extract items from handwritten/printed grocery lists using OCR.
- **Nearest Store Matching:** Locate Kirana stores nearby with the highest match of your grocery list.
- **WhatsApp Ordering:** Send your order directly to the store via WhatsApp for quick confirmation.
- **Pay on Delivery:** Flexible payment options with UPI or cash on delivery.
- **Real-time Availability:** See which items are available at the selected store.

---

## ⚙️ Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/grosnap.git
    cd grosnap
    ```

2. **Install Backend Dependencies**

    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3. **Install Frontend Dependencies**

    ```bash
    cd ../frontend
    npm install
    ```

4. **Run Backend Server**

    ```bash
    cd ../backend
    python app.py
    ```

5. **Run Frontend Server**

    ```bash
    cd ../frontend
    npm run dev
    ```

6. **Open your browser at**

    ```
    http://localhost:3000
    ```

---

## 🔗 Useful Links

- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Coding!** 🚀
