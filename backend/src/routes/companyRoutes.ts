import express, { Request, Response, NextFunction } from "express";
import Company from "../models/Company";

const router = express.Router();

// GET all companies
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
});

// POST create a new company
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, legalNumber, incorporationCountry, website } = req.body;
    const newCompany = new Company({
      name,
      legalNumber,
      incorporationCountry,
      website,
    });

    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    next(error);
  }
});

// GET company by ID
router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company)
        return res.status(404).json({ message: "Company not found" });

      res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update company by ID
router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedCompany)
        return res.status(404).json({ message: "Company not found" });

      res.status(200).json(updatedCompany);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE company by ID
router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const deletedCompany = await Company.findByIdAndDelete(req.params.id);
      if (!deletedCompany)
        return res.status(404).json({ message: "Company not found" });

      res.status(200).json({ message: "Company deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
