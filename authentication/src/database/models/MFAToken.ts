import { Schema, model, Document } from "mongoose";

interface IMFAToken extends Document {
  userId: Schema.Types.ObjectId;
  secret: string;
  createdAt: Date;
}

const mfaTokenSchema: Schema<IMFAToken> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    secret: { type: String, required: true },
  },
  { timestamps: true }
);

const MFAToken = model<IMFAToken>("MFAToken", mfaTokenSchema);

export { MFAToken, IMFAToken };
