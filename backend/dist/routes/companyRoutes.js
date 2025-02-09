"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Company_1 = __importDefault(require("../models/Company"));
const router = express_1.default.Router();
router.get("/", (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const companies = yield Company_1.default.find();
      return res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  })
);

router.post("/", (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { name, legalNumber, incorporationCountry, website } = req.body;
      const newCompany = new Company_1.default({
        name,
        legalNumber,
        incorporationCountry,
        website,
      });
      yield newCompany.save();
      return res.status(201).json(newCompany);
    } catch (error) {
      next(error);
    }
  })
);

router.get("/:id", (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const company = yield Company_1.default.findById(req.params.id);
      if (!company)
        return res.status(404).json({ message: "Company not found" });
      return res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  })
);

router.put("/:id", (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const updatedCompany = yield Company_1.default.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedCompany)
        return res.status(404).json({ message: "Company not found" });
      return res.status(200).json(updatedCompany);
    } catch (error) {
      next(error);
    }
  })
);

router.delete("/:id", (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const deletedCompany = yield Company_1.default.findByIdAndDelete(
        req.params.id
      );
      if (!deletedCompany)
        return res.status(404).json({ message: "Company not found" });
      return res.status(200).json({ message: "Company deleted" });
    } catch (error) {
      next(error);
    }
  })
);
exports.default = router;
