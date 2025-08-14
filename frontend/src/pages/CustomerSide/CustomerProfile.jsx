import React, { useState } from "react";

const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    membership: "Premium",
    joinDate: "January 15, 2022",
    preferences: {
      dietary: ["Vegetarian", "Gluten-Free"],
      stores: ["Whole Foods", "Trader Joe's"],
    },
  });

  const [tempData, setTempData] = useState({ ...userData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({
      ...tempData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <svg viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              <svg viewBox="0 0 24 24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
              </svg>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-pic">
          <div className="avatar">
            <span>AJ</span>
          </div>
          {isEditing && (
            <button className="change-photo-btn">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z" />
              </svg>
              Change Photo
            </button>
          )}
        </div>

        {/* Personal Info Section */}
        <div className="profile-section">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Personal Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={tempData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.name}</p>
              )}
            </div>
            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={tempData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.email}</p>
              )}
            </div>
            <div className="info-item">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={tempData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>
            <div className="info-item">
              <label>Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={tempData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="profile-section">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Account Details
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Membership</label>
              <p className="membership-badge">{userData.membership}</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{userData.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="profile-section">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
            Shopping Preferences
          </h2>
          <div className="preferences-grid">
            <div className="preference-item">
              <h3>Dietary Preferences</h3>
              <div className="tags">
                {userData.preferences.dietary.map((item, index) => (
                  <span key={index} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="preference-item">
              <h3>Favorite Stores</h3>
              <div className="tags">
                {userData.preferences.stores.map((store, index) => (
                  <span key={index} className="tag">
                    {store}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .profile-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .profile-header h1 {
          font-size: 28px;
          margin: 0;
          color: #2c3e50;
        }

        button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 14px;
        }

        button svg {
          width: 18px;
          height: 18px;
        }

        .edit-btn {
          background-color: #3498db;
          color: white;
        }

        .edit-btn:hover {
          background-color: #2980b9;
        }

        .edit-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn {
          background-color: #2ecc71;
          color: white;
        }

        .save-btn:hover {
          background-color: #27ae60;
        }

        .cancel-btn {
          background-color: #f5f5f5;
          color: #666;
        }

        .cancel-btn:hover {
          background-color: #e0e0e0;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .profile-pic {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 25px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #3498db;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .change-photo-btn {
          background: none;
          color: #3498db;
          font-size: 13px;
          padding: 5px 10px;
        }

        .change-photo-btn:hover {
          background-color: rgba(52, 152, 219, 0.1);
        }

        .profile-section {
          margin-bottom: 30px;
        }

        .profile-section h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          color: #2c3e50;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .profile-section h2 svg {
          fill: #7f8c8d;
          width: 20px;
          height: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-item {
          margin-bottom: 15px;
        }

        .info-item label {
          display: block;
          font-size: 13px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }

        .info-item p {
          margin: 0;
          font-size: 15px;
          padding: 8px 0;
        }

        .info-item input,
        .info-item textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          font-family: inherit;
        }

        .info-item textarea {
          min-height: 80px;
          resize: vertical;
        }

        .membership-badge {
          display: inline-block;
          padding: 4px 8px;
          background-color: #f39c12;
          color: white;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .preference-item h3 {
          font-size: 15px;
          margin: 0 0 10px 0;
          color: #34495e;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background-color: #ecf0f1;
          color: #34495e;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .preferences-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerProfile;