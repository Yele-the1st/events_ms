import { Schema, model, Document } from "mongoose";

interface IPasswordReset extends Document {
  userId: Schema.Types.ObjectId;
  resetToken: string;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  resetToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordReset = model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);

export default PasswordReset;
