// import { Template } from '../models/Template';

// export class TemplateService {
//   async createTemplate(data: any): Promise<Template> {
//     const template = new Template(data);
//     return template.save();
//   }

//   async updateTemplate(id: string, data: any): Promise<Template | null> {
//     return Template.findByIdAndUpdate(id, data, { new: true });
//   }

//   async deleteTemplate(id: string): Promise<void> {
//     await Template.findByIdAndDelete(id);
//   }

//   async listTemplates(query: any): Promise<Template[]> {
//     return Template.find(query);
//   }
// }
