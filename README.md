# Online Exam Booking System

A full-stack web application built with **Node.js**, **Express**, and **MySQL** that allows users to register, log in, and book IELTS exam slots (Academic or General Training).

---

## 🚀 Features

*   **User Authentication**: Secure registration and login system using `bcryptjs` for password hashing.
*   **Session Management**: Maintains user state across the site using `express-session`.
*   **Test Booking**: Registered users can select test types (Academic/General), formats (Computer/Paper), cities, and dates.
*   **Dynamic Dashboard**: A "Test Detail" page that displays a user's specific booking history using SQL Joins.
*   **Responsive UI**: Styled with custom CSS and rendered using the **EJS** (Embedded JavaScript) templating engine.

---

## 📁 Project Structure

```text
├── Pictures/               # Logo and UI images (e.g., logo.png)
├── style/                  # Component-specific CSS
│   ├── contact.css
│   ├── detail.css
│   ├── home.css
│   ├── information.css
│   ├── location.css
│   ├── login.css
│   └── register.css
├── views/                  # EJS Templates
│   ├── contact_us.ejs
│   ├── detail.ejs
│   ├── home.ejs
│   ├── information.ejs
│   ├── location.ejs
│   ├── login.ejs
│   └── register.ejs
├── app.js                  # Main Server & Routes
├── package.json            # Project Metadata & Dependencies
└── README.md               # Documentation
```
## ⚙️ Setup and Installation
 **1. Prerequisites**
 * **Node.js** (v14+ recommended)
 * **MySQL Server**
 **2. Database Schema**
 Run the following SQL commands in your MySQL terminal to initialize the login database:SQLCREATE
```
DATABASE login;
USE login;

CREATE TABLE register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    test_type VARCHAR(100),
    test_format VARCHAR(100),
    test_city VARCHAR(100),
    exam_date VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES register(id)
);
```
**3. Installation**
```Bash
# Clone the repository and install dependencies
npm install express mysql2 ejs body-parser bcryptjs express-session
```
**4. Configuration**
   Update the db connection in app.js with your MySQL credentials:
   ```JavaScriptconst 
   db = 
   mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD", // Change this
    database: "login"
});
```
**5. Start Server**
```Bash
node app.js
```
The application will be available at http://127.0.0.1:80/.
## 🛤️ API Routes
| Method | Route | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Homepage with Test Booking form (requires login) |
| **GET** | `/information` | Information about IELTS exams |
| **GET** | `/location` | Available test center locations |
| **GET** | `/contact` | Contact support page |
| **GET** | `/login` | User login portal |
| **GET** | `/register` | New user registration page |
| **POST** | `/register` | Validates data and hashes password using Bcrypt |
| **POST** | `/login` | Authenticates user and starts session |
| **POST** | `/detail` | Submits a new exam booking to the database |
| **GET** | `/detail` | Fetches and displays all bookings for the logged-in user |
| **GET** | `/logout` | Destroys the current session and redirects to login |
# 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (mysql2)
* **View Engine:** EJS
* **Security:** Bcryptjs
