import { Schema, model, Document } from "mongoose";

interface IRole extends Document {
  name: string;
  permissions: string[];
}

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
});

const Role = model<IRole>("Role", roleSchema);

export default Role;
