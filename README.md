# Bubble Soap Store

## Description

A web application for browsing and customizing handmade soaps.  
Users can explore products, add items to the cart, manage a wishlist, and complete the checkout process.  
The system also includes an Admin dashboard and a Customer Service panel for managing products, inventory, orders, reviews, promotions, tickets, and FAQs.

---

## Team Members

| Name                 | ID        | Contributions               |
|----------------------|----------|-----------------------------|
| Fatimah Alshehab     | 202278660 | Back End - Design           |
| Raneem Alshahrani    | 202277080 | Front End - Documentation   |
| Wajd Alghamdi        | 202262140 | Back End - Documentation    |
| Yasmeen Alshehri     | 202271660 | Front End - Design          |

---

## Features

* Browse products
* Add and remove items from cart
* Wishlist functionality
* Customize soap
* Apply discount code
* Checkout system
* Responsive design (mobile and desktop)

### Admin Features

* Manage products (add, edit, delete)
* Manage inventory
* Manage orders and update status
* Manage promotions and discount codes
* Manage customer reviews

### Customer Service Features

* View and manage support tickets
* Filter and search tickets
* Update ticket status and refund eligibility
* Add internal notes
* Manage FAQ templates (add, edit, delete)

---

## Technologies Used

* React (Vite)
* JavaScript
* HTML
* CSS
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* multer
* Recharts

---

## Backend

The backend is built with Node.js, Express.js, MongoDB, and Mongoose.  
It provides REST API routes for products, orders, cart, wishlist, authentication, admin management, customer service tickets, FAQs, reviews, promotions, and custom options.

### Backend Main Features

* Connects to MongoDB Atlas
* Provides API routes for frontend pages
* Handles product image uploads
* Supports user authentication
* Stores users, products, orders, promotions, reviews, tickets, carts, wishlists, and custom options
* Supports role-based users: Customer, Admin, and Customer Service

### Main Backend Routes

```txt
/api/products
/api/orders
/api/cart
/api/wishlist
/api/custom-options
/api/auth
/api/faqs
/api/tickets
/api/admin/dashboard
/api/admin/products
/api/admin/inventory
/api/admin/orders
/api/admin/promotions
/api/admin/reviews
````

---

## How to Run the Project

1. Install frontend dependencies:

```bash
npm install
npm install recharts
```

2. Start the frontend:

```bash
npm run dev
```

3. Open in browser:

```txt
http://localhost:5173/
```

---

4. Setup backend:

Open a new terminal and run:

```bash
cd backend
npm install
npm install express mongoose cors dotenv multer bcryptjs jsonwebtoken express-validator
```

---

5. Create `.env` file inside backend:

```env
MONGO_URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/bubbleDB?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=bubble_secret_key_123
```

---

6. Start backend server:

```bash
node server.js
```

---

7. Test backend:

```txt
http://localhost:5000/
```

---

8. If you get a permission error (execution policy issue), run:

```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## Project Structure

```txt
Bubble/
├── backend/
│   ├── models/
│   │   ├── Cart.js
│   │   ├── CustomOption.js
│   │   ├── Faq.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Promotion.js
│   │   ├── Review.js
│   │   ├── Ticket.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── adminInventory.js
│   │   ├── adminOrders.js
│   │   ├── adminProducts.js
│   │   ├── adminPromotions.js
│   │   ├── adminReviews.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── customOptions.js
│   │   ├── faq.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── tickets.js
│   │   └── wishlist.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   └── server.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## For Testing

| Role             | Username / Email                                                | Password    |
| ---------------- | --------------------------------------------------------------- | ----------- |
| Admin            | [admin@bubble.com](mailto:admin@bubble.com)                     | admin123    |
| User             | [user@bubble.com](mailto:user@bubble.com)                       | user123     |
| Customer Service | [customerservice@bubble.com](mailto:customerservice@bubble.com) | customer123 |

---

## Routing Overview

### Customer Pages

* /home
* /products
* /product-details/:id
* /cart
* /checkout
* /profile
* /order-history

### Admin Pages

* /admin-dashboard
* /admin/products
* /admin/inventory
* /admin/orders
* /admin/reviews
* /admin/promotions

### Customer Service Pages

* /customer-service/tickets
* /customer-service/faqs

---

## Notes

* The system includes three roles: Customer, Admin, and Customer Service
* Admin and Customer Service interfaces are separated from customer pages
* MongoDB Atlas is used as the database
* Backend environment variables are stored in `.env`
* Product images are uploaded through the backend
* Cart and wishlist data are connected through backend routes
* Repository uses `.gitignore` to exclude `node_modules` and sensitive files
* Figma design will be provided separately

