import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import companyRoutes from "./routes/companyRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/companies", companyRoutes);
app.use("/api/products", productRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
