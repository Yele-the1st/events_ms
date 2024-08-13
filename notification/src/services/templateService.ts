import mongoose from "mongoose";
import { Template } from "../database/models/template";
import TemplateRepository from "../database/repository/templateRepo";

export class TemplateService {
  private templateRepository: TemplateRepository;

  constructor() {
    this.templateRepository = new TemplateRepository();
  }

  /**
   * Fetches a template by name.
   * @param {string} name - The name of the template.
   * @returns {Promise<Template>} - The found template.
   */
  async getTemplate(name: string): Promise<Template> {
    const template = await this.templateRepository.findByName(name);
    if (!template) {
      throw new Error(`Template ${name} not found`);
    }
    return template;
  }

  /**
   * Creates a new template.
   * @param {string} name - The name of the template.
   * @param {string} subject - The subject of the template.
   * @param {string} body - The body of the template.
   * @param {mongoose.Types.ObjectId} createdBy - The ID of the user who created the template.
   * @param {'email' | 'sms'} channel - The channel for the template.
   * @returns {Promise<Template>} - The created template.
   */
  async createTemplate(
    name: string,
    subject: string,
    body: string,
    createdBy: mongoose.Types.ObjectId,
    channel: "email" | "sms"
  ): Promise<Template> {
    const existingTemplate = await this.templateRepository.findByName(name);
    if (existingTemplate) {
      throw new Error(`Template ${name} already exists`);
    }
    return await this.templateRepository.createTemplate({
      name,
      subject,
      body,
      createdBy,
      channel,
    });
  }

  /**
   * Updates an existing template.
   * @param {string} name - The name of the template.
   * @param {Partial<Omit<Template, 'createdAt' | 'updatedAt'>>} updateFields - The fields to update.
   * @returns {Promise<Template>} - The updated template.
   */
  async updateTemplate(
    name: string,
    updateFields: Partial<Omit<Template, "createdAt" | "updatedAt">>
  ): Promise<Template> {
    const template = await this.templateRepository.updateTemplate({
      name,
      updateFields,
    });
    if (!template) {
      throw new Error(`Template ${name} not found`);
    }
    return template;
  }

  /**
   * Deletes a template by name.
   * @param {string} name - The name of the template.
   * @returns {Promise<void>}
   */
  async deleteTemplate(name: string): Promise<void> {
    const deleted = await this.templateRepository.deleteTemplate(name);
    if (!deleted) {
      throw new Error(`Template ${name} not found`);
    }
  }

  /**
   * Fetches all templates.
   * @returns {Promise<Template[]>} - The list of all templates.
   */
  async getAllTemplates(): Promise<Template[]> {
    return await this.templateRepository.getAllTemplates();
  }

  /**
   * Replaces placeholders in a template body.
   * @param {Template} template - The template to use.
   * @param {Record<string, string>} data - The data to replace placeholders with.
   * @returns {string} - The body with replaced placeholders.
   */
  replacePlaceholders(
    template: Template,
    data: Record<string, string>
  ): string {
    return template.body.replace(
      /{{(.*?)}}/g,
      (_, key) => data[key.trim()] || ""
    );
  }
}
