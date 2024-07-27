import mongoose, { Schema, Document, Model } from "mongoose";

interface IEmailVerificationToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const emailVerificationTokenSchema: Schema<IEmailVerificationToken> =
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      token: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
  );

const EmailVerificationToken: Model<IEmailVerificationToken> = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);

export { EmailVerificationToken, IEmailVerificationToken };
