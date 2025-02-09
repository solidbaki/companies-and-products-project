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

    const companyDistribution = await Company.aggregate([
      { $group: { _id: "$incorporationCountry", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const productDistribution = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCompanies,
      totalProducts,
      latestCompanies,
      latestProducts,
      companyDistribution,
      productDistribution
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
