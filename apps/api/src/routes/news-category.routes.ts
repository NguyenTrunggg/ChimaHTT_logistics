import { Router } from "express";
import { NewsCategoryController } from "../controllers/news-category.controller";

const router = Router();

router.get('/', NewsCategoryController.findAll);

export default router; 