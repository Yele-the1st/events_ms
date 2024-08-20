import { Request, Response, NextFunction } from "express";
import { TemplateService } from "../../services/templateService";
import logger from "../../config/winston/logger";
import { Template } from "../../database/models/template";

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
      const {
        name,
        subject,
        createdBy,
        channel,
        createdByType,
        body: bodyFromRequest,
      } = req.body;

      // Validate required fields
      if (!name || !subject || !channel || !createdByType) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      // Extract the HTML body from the uploaded file if available
      const body = req.file
        ? req.file.buffer.toString("utf-8")
        : bodyFromRequest;

      // Validate body content
      if (!body) {
        return res
          .status(400)
          .json({ success: false, message: "Body content is required" });
      }

      // Proceed with template creation
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
      logger.error("Error creating template:", error);
      next(error); // Pass error to the next middleware for handling
    }
  };

  // Update an existing template
  updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;
      const { subject, createdBy, channel, createdByType } = req.body;

      // Start with an empty update object
      const updateFields: Partial<Template> = {};

      // Conditionally add fields to the update object
      if (subject) updateFields.subject = subject;
      if (createdBy) updateFields.createdBy = createdBy;
      if (channel) updateFields.channel = channel;
      if (createdByType) updateFields.createdByType = createdByType;

      // Handle the body content
      if (req.file) {
        // If a file was uploaded, read its content
        updateFields.body = req.file.buffer.toString("utf-8");
      } else if (req.body.body) {
        // If the body content is provided in the request
        updateFields.body = req.body.body;
      }

      // Check if there are any fields to update
      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No fields to update." });
      }

      // Update the template
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
