import mongoose from "mongoose";
import { TemplateModel, Template } from "../models/template";

interface CreateTemplateParams {
  name: string;
  subject: string;
  body: string;
  createdBy: mongoose.Types.ObjectId;
  channel: "email" | "sms";
}

interface UpdateTemplateParams {
  name: string;
  updateFields: Partial<Omit<Template, "createdAt" | "updatedAt">>;
}

class TemplateRepository {
  /**
   * Creates a new template.
   * @param {CreateTemplateParams} params - Object containing template details.
   * @returns {Promise<Template>} - The created template.
   */
  async createTemplate(params: CreateTemplateParams): Promise<Template> {
    const template = new TemplateModel(params);
    return await template.save();
  }

  /**
   * Finds a template by name.
   * @param {string} name - The name of the template.
   * @returns {Promise<Template | null>} - The found template or null if not found.
   */
  async findByName(name: string): Promise<Template | null> {
    return await TemplateModel.findOne({ name }).exec();
  }

  /**
   * Updates a template by name.
   * @param {UpdateTemplateParams} params - Object containing name and update fields.
   * @returns {Promise<Template | null>} - The updated template or null if not found.
   */
  async updateTemplate(params: UpdateTemplateParams): Promise<Template | null> {
    const { name, updateFields } = params;
    return await TemplateModel.findOneAndUpdate({ name }, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes a template by name.
   * @param {string} name - The name of the template.
   * @returns {Promise<boolean>} - True if the template was deleted, false otherwise.
   */
  async deleteTemplate(name: string): Promise<boolean> {
    const result = await TemplateModel.deleteOne({ name }).exec();
    return result.deletedCount > 0;
  }

  /**
   * Gets all templates.
   * @returns {Promise<Template[]>} - The list of all templates.
   */
  async getAllTemplates(): Promise<Template[]> {
    return await TemplateModel.find().exec();
  }
}

export default TemplateRepository;
