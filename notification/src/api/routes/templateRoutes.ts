import { Router } from "express";
import { TemplateController } from "../controllers/templateController";
import { upload } from "../../config/multer/multerConfig";

const router = Router();

const templateController = new TemplateController();

router.get("/templates", templateController.getAllTemplates);
router.get("/template/:name", templateController.getTemplate);
router.post(
  "/template/create",
  upload.single("body"),
  templateController.createTemplate
);
router.put("/template/:name", templateController.updateTemplate);
router.delete("/template/:name", templateController.deleteTemplate);

export default router;
