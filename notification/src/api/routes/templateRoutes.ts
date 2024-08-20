import { Router } from "express";
import { TemplateController } from "../controllers/templateController";
import { upload } from "../../config/multer/multerConfig";

const router = Router();

const templateController = new TemplateController();

router.post(
  "/template/create",
  upload.single("body"),
  templateController.createTemplate
);
router.get("/templates", templateController.getAllTemplates);
router.get("/template/:name", templateController.getTemplate);
router.delete("/template/:name", templateController.deleteTemplate);
router.put(
  "/template/:name",
  upload.single("body"), // Handle the file upload
  templateController.updateTemplate
);

export default router;
