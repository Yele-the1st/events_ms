import { Router } from "express";
import { TemplateController } from "../controllers/templateController";

const router = Router();

const templateController = new TemplateController();

router.get("/templates", templateController.getAllTemplates);
router.get("/templates/:name", templateController.getTemplate);
router.post("/template/create", templateController.createTemplate);
router.put("/templates/:name", templateController.updateTemplate);
router.delete("/templates/:name", templateController.deleteTemplate);

export default router;
