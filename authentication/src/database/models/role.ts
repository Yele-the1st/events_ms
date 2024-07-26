import { Schema, model, Document } from "mongoose";

interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

const Role = model<IRole>("Role", roleSchema);

export { Role, IRole };
