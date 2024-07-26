import mongoose, { Schema, Document, Model } from "mongoose";

interface ILoginAttempt extends Document {
  userId: Schema.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: Date;
}

const loginAttemptSchema: Schema<ILoginAttempt> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    success: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const LoginAttempt: Model<ILoginAttempt> = mongoose.model(
  "LoginAttempt",
  loginAttemptSchema
);

export { LoginAttempt, ILoginAttempt };
