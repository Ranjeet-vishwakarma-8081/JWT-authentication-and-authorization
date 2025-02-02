// index.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const users = []; // In-memory user storage (replace with DB in production)
const SECRET_KEY = "your_secret_key"; // Use env variable in production

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  console.log("User registered - ", users);
  res.status(201).json({ message: "User registered successfully!" });
});

// Login and Generate JWT
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  console.log("Username Fined - ", user);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Protected Route (Middleware for Authentication)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  //const token = req.headers.authorization?.split(' ')[1];
  const token = authHeader && authHeader.split(" ")[1]; //It will return the second element from the authHeader
  if (!token) return res.status(401).json({ message: "Unauthorized" });

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.status(403);
//     console.log("Welcome: ", user);
//     req.user = user;
//     next();
//   });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log(`Welcome, ${decoded.username}`);
      req.user = decoded;
      next();
    } catch {
      res.status(403).json({ message: "Invalid token" });
    }
}

// Accessing Protected Resource
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}. You have accessed a protected route!`,
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
