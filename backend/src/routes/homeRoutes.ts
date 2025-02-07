import express, { Request, Response } from "express";
import Company from "../models/Company";
import Product from "../models/Product";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const totalCompanies = await Company.countDocuments();
    const totalProducts = await Product.countDocuments();

    const latestCompanies = await Company.find().sort({ createdAt: -1 }).limit(3);
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(3);

    res.json({
      totalCompanies,
      totalProducts,
      latestCompanies,
      latestProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
