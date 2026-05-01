# Bubble Soap Store

## Description

A web application for browsing and customizing handmade soaps.
Users can explore products, add items to the cart, manage a wishlist, and complete the checkout process.
The system also includes an Admin dashboard and a Customer Service panel for managing products, orders, reviews, tickets, and FAQs.

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
* MongoDB

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

```
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
MONGO_URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/Bubble?retryWrites=true&w=majority
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

```
http://localhost:5000/
```

---

8. If you get a permission error (execution policy issue), run:

```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
---

## Project Structure

```
src/
├── components/ # Reusable components (Button, Card, Input, Navbar)
├── pages/ # Main pages (Home, Products, Cart, Checkout, etc.)
├── assets/ # Images
├── styles/ # CSS
├── App.jsx
└── main.jsx
```

---
## For Testing
### Admin 
* Username: admin
* Password: admin123

### User
* Username: User 
* Password: User123

### Customer Service 
* Username: customerservice 
* Password: customer123
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
## Team Members

* Wajd Alghamdi
* Yasmeen Alshehri
* Raneem Alshahrani
* Fatimah Alshehab

---

## Notes
* The system includes three roles: Customer, Admin, and Customer Service
* Admin and Customer Service interfaces are separated from customer pages
* Cart and wishlist data are stored using localStorage
* Login state is simulated for testing purposes
* Figma design will be provided separately
* Repository uses .gitignore to exclude node_modules and sensitive files


-----