"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();

router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find().populate("company");
        return res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
}));

router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, productAmount, amountUnit, company } = req.body;
        const newProduct = new Product_1.default({ name, category, productAmount, amountUnit, company });
        yield newProduct.save();
        return res.status(201).json(newProduct);
    }
    catch (error) {
        next(error);
    }
}));

router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }
        const product = yield Product_1.default.findById(productId).populate("company");
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
}));

router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true }); //runValidators added
        if (!updatedProduct)
            return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(updatedProduct);
    }
    catch (error) {
        next(error);
    }
}));

router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }
        const deletedProduct = yield Product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct)
            return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted" });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
