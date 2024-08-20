import { Request, Response, NextFunction } from "express";
import { TemplateService } from "../../services/templateService";

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
      const { name, subject, body, createdBy, channel, createdByType } =
        req.body;
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
      res.status(204).send();
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
