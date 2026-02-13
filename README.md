# MERN eCommerce Platform

A full-stack, responsive eCommerce application built using the **MERN** stack (MongoDB, Express, React, and Node.js). This platform features user authentication, product management, and a persistent shopping cart system.

---

## Architecture Overview

The application is split into two primary layers: a **RESTful API** backend and a **React-based** frontend SPA (Single Page Application).

### 1. Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt for password hashing

### 2. Frontend (Client)
* **Library:** React.js
* **Routing:** React Router DOM
* **State Management:** React Context API / Hooks
* **Styling:** CSS3 / Responsive Design

---

## Key Features

* **User Management:** Secure Sign-up and Login functionality with encrypted passwords.
* **Product Discovery:** Dynamic product listing fetched from MongoDB.
* **Shopping Cart:** Add, remove, and update quantities of items with persistent state.
* **Checkout Flow:** Structured process for moving from cart to order confirmation.
* **Responsive UI:** Optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MongoDB](https://www.mongodb.com/) account (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/jaimevargas315/eCommerce.git](https://github.com/jaimevargas315/eCommerce.git)
   cd eCommerce
