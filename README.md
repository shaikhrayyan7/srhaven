# **Srhaven - Travel Diary App**

**Srhaven** is a user-friendly travel diary application designed to help users document and cherish their travel experiences. With **Srhaven**, users can securely capture photos, save locations, and track their journeys all in one place.

The app is built using:
- **Ionic Angular** for the frontend.
- **Node.js** and **Express** for the backend.
- **MongoDB** for secure data storage.

---

## **Table of Contents**
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Backend API Routes](#backend-api-routes)
6. [Environment Variables](#environment-variables)
7. [Usage](#usage)
8. [License](#license)

---

## **Features**
1. **User Management**
   - Signup, login, and profile management.
   - Secure password handling using **bcrypt**.

2. **Travel Memories**
   - Upload and save travel photos directly into the database.
   - Store additional information such as **location**, **GPS coordinates**, and **date**.

3. **Subscription**
   - A one-time subscription API to activate unlimited memories space.

4. **Secure Data Storage**
   - Photos and travel memories are stored in MongoDB using **Buffer data** for images.

5. **Responsive UI**
   - Built with **Ionic Angular** for a seamless experience across devices.

---

## **Technologies Used**
### **Frontend**
- Ionic Framework (Angular)
- TypeScript
- SCSS for styling

### **Backend**
- Node.js with Express.js
- MongoDB with Mongoose
- Multer for handling file uploads
- bcrypt for password hashing
- CORS and Body-Parser middleware

---

## **Project Structure**
The project is organized as follows:

### **Backend** (`server.js`)
- Routes for user management (`/api/signup`, `/api/login`, etc.).
- Memory upload and retrieval (`/api/upload`, `/api/memories`).
- Subscription API for payment handling.

### **Frontend** (`src/app`)
- `login/` : Login screen for users.
- `signup/` : User registration screen.
- `create-memory/` : Upload travel memories with images.
- `dashboard/` : Main dashboard showing user memories.
- `profile/` : Manage user profiles.
- `subscription/` : Activate subscriptions.

### **Main Files**
- `server.js` : Backend server logic.
- `ionic.config.json` : Configuration for Ionic framework.
- `app.module.ts` : Core Angular module.
- `app-routing.module.ts` : Routing configuration.

---

## **Installation**

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+)
- **MongoDB** (local or cloud)
- **Ionic CLI** and **Angular CLI**

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd srhaven
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```
   Backend runs on `http://0.0.0.0:5000`.

---

### **Frontend Setup**
1. Navigate to the project folder:
   ```bash
   cd srhaven
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Run the Ionic frontend:
   ```bash
   ionic serve
   ```
   Frontend runs on `http://localhost:8100`.

---

## **Backend API Routes**

### **User Management**
- **Signup**: `POST /api/signup`
  - Payload: `{ firstName, lastName, email, password }`
- **Login**: `POST /api/login`
  - Payload: `{ email, password }`
- **Fetch User**: `GET /api/users/:email`
- **Update User**: `PUT /api/users/:email`
- **Delete User**: `DELETE /api/users/:email`

### **Travel Memories**
- **Upload Memory**: `POST /api/upload`
  - Payload: `{ email, image, place, gpsCoordinates }` (using `multipart/form-data`)
- **Fetch Memories**: `GET /api/memories/:email`

### **Subscription**
- **Activate Subscription**: `POST /api/subscription`
  - Payload: `{ email, userIBAN, description }`

---

## **Environment Variables**
Set the following environment variables in a `.env` file (if applicable):
```env
MONGODB_URI=mongodb://0.0.0.0:27017/srhaven
PORT=5000
```

---

## **Usage**
1. **Sign Up**: Register as a new user.
2. **Login**: Access the dashboard and manage memories.
3. **Create Memories**: Upload travel photos and details.
4. **View Memories**: Fetch and display uploaded memories.
5. **Subscription**: Activate premium features.

---

Here’s how we can integrate your **Copyright & Trademark** statement into the README file under a **Legal** section:

---

## **Legal**

Copyright & Trademark © 2024 **Mohd Rayyan Shaikh** & **Ayesha Ahmed Dhool**. All rights reserved.  

This app and its contents are the exclusive property of **Mohd Rayyan Shaikh** & **Ayesha Ahmed Dhool**. Unauthorized reproduction, distribution, or use of any part of this application, including its code, design, and media, is strictly prohibited.  

All trademarks, service marks, and logos are the property of their respective owners.  

