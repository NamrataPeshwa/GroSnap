import React, { useState } from "react";

const OCRUpload = () => {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [storeResults, setStoreResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!file) {
      setResponseMessage(<span className="error-message">Please select a file</span>);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.text) {
        setResponseMessage(<h3 className="success-message">Text Extracted Successfully!</h3>);
        setOcrText(data.text);
      } else if (data.error) {
        setResponseMessage(<span className="error-message">{data.error}</span>);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResponseMessage(
        <span className="error-message">
          Error: {error.message || "Failed to upload file"}
        </span>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!ocrText.trim()) {
      alert("Please extract text first");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/find-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrText }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const resData = await res.json();
      setStoreResults(resData.store_results || []);

      if (resData.message) {
        setResponseMessage(<span className="success-message">{resData.message}</span>);
      }
    } catch (error) {
      console.error("Find items error:", error);
      setResponseMessage(
        <span className="error-message">
          Error: {error.message || "Failed to find items"}
        </span>
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ocr-container">
      <div className="ocr-header">
        <h1 className="app-title">GroSnap</h1>
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search for..." 
            className="search-input"
          />
          <button className="search-button">Nearby Stores</button>
        </div>
      </div>

      <div className="ocr-upload-section">
        <h2 className="section-title">My Lists</h2>
        
        <div className="upload-card">
          <div className="upload-header">
            <h3>Upload Handwritten Grocery List</h3>
            {file && <div className="file-preview">{file.name}</div>}
          </div>
          
          <form onSubmit={handleUpload} encType="multipart/form-data">
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="file" className="upload-label">
              <div className="upload-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span>{file ? "Change Image" : "Upload Image for OCR"}</span>
            </label>
            
            <button type="submit" disabled={isLoading} className="upload-button">
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Process Image"
              )}
            </button>
          </form>

          {responseMessage && (
            <div className="response-message">
              {responseMessage}
            </div>
          )}
        </div>

        {ocrText && (
          <div className="extracted-text-section">
            <div className="extracted-text-header">
              <h3>Extracted Text</h3>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="find-items-button"
              >
                {isLoading ? (
                  <span className="spinner small"></span>
                ) : (
                  "Find Items in Stores"
                )}
              </button>
            </div>
            <textarea
              className="extracted-textarea"
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              placeholder="Edit your extracted text here..."
            />
          </div>
        )}
      </div>

      {storeResults.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">Store Search Results</h2>
          <div className="store-results-grid">
            {storeResults.map((store, idx) => (
              <div key={idx} className="store-card">
                <h3 className="store-name">{store.store}</h3>
                {store.found_items.length > 0 && (
                  <div className="found-items">
                    <div className="status-label found">Found</div>
                    <ul>
                      {store.found_items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {store.not_found_items.length > 0 && (
                  <div className="not-found-items">
                    <div className="status-label not-found">Not Found</div>
                    <ul>
                      {store.not_found_items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Add this CSS to your stylesheet
const styles = `
.ocr-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.ocr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  color: #4CAF50;
  margin: 0;
}

.search-section {
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  width: 200px;
  font-size: 14px;
}

.search-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.search-button:hover {
  background-color: #3e8e41;
}

.ocr-upload-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #444;
}

.upload-card {
  border: 2px dashed #e0e0e0;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  margin-bottom: 25px;
  transition: all 0.3s;
}

.upload-card:hover {
  border-color: #4CAF50;
}

.upload-header {
  margin-bottom: 20px;
}

.upload-header h3 {
  margin: 0;
  color: #555;
}

.file-preview {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

input[type="file"] {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.upload-label:hover {
  color: #4CAF50;
}

.upload-icon {
  width: 60px;
  height: 60px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.upload-icon svg {
  width: 30px;
  height: 30px;
  fill: #666;
}

.upload-button {
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  width: 180px;
}

.upload-button:hover {
  background-color: #3e8e41;
  transform: translateY(-2px);
}

.upload-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.spinner.small {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.response-message {
  margin-top: 20px;
  min-height: 30px;
}

.success-message {
  color: #4CAF50 !important;
  font-weight: 500;
}

.error-message {
  color: #f44336 !important;
  font-weight: 500;
}

.extracted-text-section {
  margin-top: 30px;
}

.extracted-text-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.extracted-textarea {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: all 0.3s;
}

.extracted-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.find-items-button {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.find-items-button:hover {
  background-color: #0b7dda;
}

.find-items-button:disabled {
  background-color: #64b5f6;
  cursor: not-allowed;
}

.results-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.store-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.store-card {
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.store-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.store-name {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.found-items, .not-found-items {
  margin-bottom: 15px;
}

.status-label {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.status-label.found {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-label.not-found {
  background-color: #ffebee;
  color: #c62828;
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
  font-size: 14px;
}
`;

// Add styles to the head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);
//hope this works
export default OCRUpload;