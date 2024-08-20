import { Request, Response, NextFunction } from "express";
import { TemplateService } from "../../services/templateService";
import path from "path";
import fs from "fs";
import logger from "../../config/winston/logger";

export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  // Fetch a template by name
  getTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;
      const template = await this.templateService.getTemplate(name);
      res.status(200).json(template);
    } catch (error) {
      next(error);
    }
  };

  // Create a new template
  createTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, subject, createdBy, channel, createdByType } = req.body;
      let body = "";

      if (req.file) {
        // Log the uploaded file details for debugging
        logger.info("Uploaded file:", req.file);
        // Construct the path to the uploaded file
        const filePath = path.join(
          __dirname,
          "../../../uploads",
          req.file.filename
        );

        // Check if the file exists before reading
        if (fs.existsSync(filePath)) {
          // Read HTML content from the uploaded file
          body = fs.readFileSync(filePath, "utf8");

          // Optionally, delete the file after processing
          fs.unlinkSync(filePath);
        } else {
          return res
            .status(404)
            .json({ success: false, message: "File not found." });
        }
      } else {
        // Fallback to body from request if no file is uploaded
        body = req.body.body;
      }

      const createdTemplate = await this.templateService.createTemplate({
        name,
        subject,
        body,
        createdByType,
        createdBy,
        channel,
      });

      res.status(201).json(createdTemplate);
    } catch (error) {
      next(error);
    }
  };

  // Update an existing template
  updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;
      const updateFields = req.body;
      const updatedTemplate = await this.templateService.updateTemplate(
        name,
        updateFields
      );
      res.status(200).json(updatedTemplate);
    } catch (error) {
      next(error);
    }
  };

  // Delete a template by name

  deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;
      await this.templateService.deleteTemplate(name);
      res.status(200).json({
        success: true,
        message: `Template '${name}' has been successfully deleted.`,
      });
    } catch (error) {
      next(error);
    }
  };

  // Fetch all templates
  getAllTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = await this.templateService.getAllTemplates();
      res.status(200).json(templates);
    } catch (error) {
      next(error);
    }
  };
}
