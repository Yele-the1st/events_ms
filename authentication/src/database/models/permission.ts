import { Schema, model, Document } from "mongoose";

interface IPermission extends Document {
  name: string;
}

const permissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true },
});

const Permission = model<IPermission>("Permission", permissionSchema);

export default Permission;
