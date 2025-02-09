import express, { Request, Response, NextFunction } from "express";
import { protect } from "../middleware/authMiddleware";
import Company from "../models/Company";

const router = express.Router();

// @route   GET /api/companies
router.get("/", protect, async (req: Request, res: Response) => {
  try {
    let {
      page = "1",
      limit = "10",
      sort = "createdAt",
      order = "desc",
      name,
      country,
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    let query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (country)
      query.incorporationCountry = { $regex: country, $options: "i" };

    const companies = await Company.find(query)
      .sort({ [sort as string]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(pageSize);

    const totalCompanies = await Company.countDocuments(query);

    res.json({
      totalCompanies,
      totalPages: Math.ceil(totalCompanies / pageSize),
      currentPage: pageNumber,
      companies,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new company
router.post(
  "/",
  protect,
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

router.get(
  "/:id",
  protect,
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

router.put(
  "/:id",
  protect,
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

router.delete(
  "/:id",
  protect,
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
