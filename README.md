# 📂 File Share App (MERN Stack)

A full-stack file sharing application similar to Google Drive. It allows users to upload files, view them, and securely share them with specific users via email or link.

---

## 🚀 Features

### Core Requirements
- **User Authentication:** Secure Login & Registration (JWT + BCrypt).
- **File Upload:** Bulk upload support (Images, PDFs, CSVs) stored in **Cloudinary**.
- **Dashboard:** View list of uploaded files with metadata (type, size, date).
- **Secure Sharing:** 
  - Share files with specific users via email.
  - **Strict Access Control:** Only the owner and explicitly added users can access files.
  - Public access via link is **blocked** for unauthorized users.
- **"Shared with Me" Section:** View files others have shared with you.
- **File Previews:** View Images and PDFs directly in the browser; download others.

### Bonus Features Implemented
- **⏳ Link Expiry:** Owners can set an expiration time (1 hour, 24 hours, etc.) for a shared user. After the time passes, access is automatically revoked (Status 410 Gone).

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Hook Form, React Hot Toast, Axios.
- **Backend:** Node.js, Express.js (ES Modules).
- **Database:** MongoDB (Mongoose).
- **Storage:** Cloudinary (for file binaries).
- **Security:** JWT (JSON Web Tokens), BCrypt, CORS.

---

## ⚙️ Prerequisites

Before running the app, ensure you have:
1.  **Node.js** (v16+) installed.
2.  A **MongoDB** connection string (Local or Atlas).
3.  A **Cloudinary** account (Cloud Name, API Key, Secret).

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/avdhoot-hadke/Share_File.git
```

### 2. Backend
   #### 1. navigate
    cd backend
   #### 2. Install dependencies
    npm install
   #### 3. Create a .env file in the backend root and add your credentials:
    
        PORT=8000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_key

        # Cloudinary Credentials
        CLOUDINARY_URL=your_cloudinary_url

        CLIENT_URL=Frontend_URL
   #### 4. Start the server:
        npm run dev

### 3. Frontend
   #### 1. navigate
    cd frontend
   #### 2. Install dependencies
    npm install
   #### 3. Create a .env file in the backend root and add your credentials:    
        VITE_API_URL=Backend_URL/api

   #### 4. Start the server:
        npm run dev
    
