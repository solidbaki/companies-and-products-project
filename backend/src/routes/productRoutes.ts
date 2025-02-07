import express, { Request, Response, NextFunction } from "express";
import { protect } from "../middleware/authMiddleware";
import Product from "../models/Product";

const router = express.Router();

// @route   GET /api/products
router.get("/", protect, async (req: Request, res: Response) => {
  try {
    let {
      page = "1",
      limit = "10",
      sort = "createdAt",
      order = "desc",
      name,
      category,
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    let query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };

    const products = await Product.find(query)
      .populate("company")
      .sort({ [sort as string]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(pageSize);

    const totalProducts = await Product.countDocuments(query);

    res.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: pageNumber,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/products
router.post(
  "/",
  protect,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, category, productAmount, amountUnit, company } = req.body;
      const newProduct = new Product({
        name,
        category,
        productAmount,
        amountUnit,
        company,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/products/:id
router.get(
  "/:id",
  protect,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById(req.params.id).populate("company");
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/products/:id
router.put(
  "/:id",
  protect,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

// @route   DELETE /api/products/:id
router.delete(
  "/:id",
  protect,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct)
        return res.status(404).json({ message: "Product not found" });

      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
