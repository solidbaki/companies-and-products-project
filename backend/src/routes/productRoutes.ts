import express, { Request, Response, NextFunction } from "express";
import Product from "../models/Product";

const router = express.Router();

// @route   GET /api/products
router.get("/", async (req, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find().populate("company");
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, productAmount, amountUnit, company } = req.body;
    const newProduct = new Product({ name, category, productAmount, amountUnit, company });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
router.get("/:id", async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate("company");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
router.put("/:id", async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
router.delete("/:id", async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
