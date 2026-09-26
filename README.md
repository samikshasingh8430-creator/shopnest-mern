# ShopNest

ShopNest is a full-stack ecommerce application built with React, Node.js, Express, MongoDB and payment, email, and image-upload integrations.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- Cloudinary account for product images
- Razorpay account for payments
- Gmail account with an App Password for email features

## Project Structure

```text
MERN/
├── backend/     # Express API, MongoDB models, authentication and payments
├── frontend/    # React user interface and admin pages
├── package.json # Root scripts for running both applications
└── README.md
```

## Installation

From the project root:

```powershell
npm install
npm --prefix backend install
npm --prefix frontend install
```

## Environment Variables

Create `backend/.env` with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Do not commit `.env` or expose these credentials publicly.

## Seed Demo Data

Run this command from the root directory:

```powershell
npm --prefix backend run seed
```

The seed script creates demo users and products.

Demo admin:

```text
Email: john@shopnest.test
Password: User@12345
```

Demo customer:

```text
Email: jane@shopnest.test
Password: Customer@12345
```

## Run the Application

Run backend and frontend together from the root directory:

```powershell
npm run dev
```

Run only the backend:

```powershell
npm run dev:server
```

Run only the frontend:

```powershell
npm run dev:client
```

The frontend runs on `http://localhost:3000` and the backend runs on `http://localhost:5000`.

## Production Build

Build the frontend from the root directory:

```powershell
npm run build
```

## Useful Direct Commands

```powershell
# Backend
npm --prefix backend start

# Frontend
npm --prefix frontend start

# Backend seed
npm --prefix backend run seed
```
