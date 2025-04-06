# Wedding Cloth Rental Service

A full-stack web application for managing wedding cloth rentals.

## Prerequisites

1. Node.js (v18 or later)
2. MongoDB (running locally on default port 27017)
3. Git

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wedding-cloth-rental
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/wedding-rental
   JWT_SECRET=your-secret-key-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Seed the database with initial users:
   ```bash
   node scripts/seed.js
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Login Credentials

### Admin User
- Email: admin@example.com
- Password: admin123

### Shopkeeper User
- Email: shopkeeper@example.com
- Password: shop123

## Features

- Role-based authentication (Admin/Shopkeeper)
- Product & inventory management
- Rental & sales management
- Customer management
- Billing and invoicing
- Reports and analytics

## Tech Stack

- Next.js
- MongoDB with Mongoose
- Tailwind CSS
- shadcn/ui components
- JWT authentication