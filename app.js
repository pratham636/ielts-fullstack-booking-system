const express = require("express");
const http = require('http');
const path = require("path");
const fs = require("fs");
const app = express();
const port = 80;
const hostname = '127.0.0.1';
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"pRatham@010203",
    database:"login",
    
});
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});
// db.execute(`
//    CREATE TABLE register(
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   username VARCHAR(50) NOT NULL,
//   email VARCHAR(100) NOT NULL UNIQUE,
//   password VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
// );
// `)
// db.execute(`
// CREATE TABLE bookings (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id INT,
//   test_type VARCHAR(100),
//   test_format VARCHAR(100),
//   test_city VARCHAR(100),
//   exam_date VARCHAR(100),
//   FOREIGN KEY (user_id) REFERENCES register(id)
// );
// `)



const session = require("express-session");

app.use(session({
  secret: "mySecretKey1ko21", 
  resave: false,
  saveUninitialized: false
}));





app.use(express.static(path.join(__dirname, "style")));
app.use(express.static(path.join(__dirname)));

//  Routes
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user || null });
  // res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/information", (req, res) => {
  // res.sendFile(path.join(__dirname, "information.html"));
    res.render("information", { user: req.session.user || null });

});

app.get("/location", (req, res) => {
  // res.sendFile(path.join(__dirname, "location.html"));
    res.render("location", { user: req.session.user || null });

});

app.get("/contact", (req, res) => {
  // res.sendFile(path.join(__dirname, "contact_us.html"));
    res.render("contact_us", { user: req.session.user || null });
});

app.get("/login", (req, res) => {
  // res.sendFile(path.join(__dirname, "login.html"));
    res.render("login", { user: req.session.user || null });
 
});
 
app.get("/register", (req, res) => {
  // res.sendFile(path.join(__dirname, "register.html"));
    res.render("register", { user: req.session.user || null });

}); 

app.get('/detail', (req, res) => {
  const user = req.session.user;
if (!user) {
    return res.render('detail', {
      user: null,
      bookings: []
    });
  }
  const sql = `
    SELECT r.username, r.email, b.*
    FROM register r
    JOIN bookings b ON r.id = b.user_id
    WHERE r.id = ?
    ORDER BY b.id DESC
  `;

  db.query(sql, [user.id], (err, rows) => {
    if (err) throw err;

    res.render('detail', {
      user: user,        
      bookings: rows
    });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect("/login");
  });
});


// post display
app.post('/detail', (req, res) => {
  const { user_id, type, format, city, date } = req.body;

  // Save booking in MySQL
  const sql = `INSERT INTO bookings (user_id, test_type, test_format, test_city, exam_date)
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [user_id, type, format, city, date], (err, result) => {
    if (err) throw err;

    // Get user + booking data by join
    const joinSql = `
      SELECT r.username, r.email, b.*
      FROM register r
      JOIN bookings b ON r.id = b.user_id
      WHERE r.id = ?
      ORDER BY b.id DESC
    `;

    db.query(joinSql, [user_id], (err, rows) => {
      if (err) throw err;
      res.render('detail', { user: req.session.user,
        bookings:rows
       });
    });
  });
});

//post log in and registeration
app.post("/login", (req, res) => { 
  
const { username, password } = req.body;
  const sql = "SELECT * FROM register WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
     if (err) {
      console.error(err);
      return res.send("Database error");
    }
    if (results.length === 0) return res.send("User not found!");

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = { id: user.id, username: user.username };
      res.redirect("/"); 
    } else {
      res.send("Wrong password");
    }
  });
});

app.post("/register", (req, res) => {
  
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.send("All fields are required");
  }
  const salt = bcrypt.genSaltSync(10)
  const hash1 = bcrypt.hashSync(password,salt)
  const sql = "INSERT INTO register (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hash1], (err, result) => {
   if (err) {
      console.error("MySQL Error:", err.sqlMessage);
      return res.send("Error while registering user"+ err.sqlMessage);
    }
    console.log("User registered with ID:", result.insertId);
    res.redirect("/login"); // go to login after register
  });
});
// app.post("/register", (req, res) => {
//   console.log(" Register form submitted:", req.body);
  
// });

// 404 Fallback 
app.use((req, res) => { 
  res.status(404).send("<h1>404 Not Found</h1>");
});



 
app.listen(port,hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});   