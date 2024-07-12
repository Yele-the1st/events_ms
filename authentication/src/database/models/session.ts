import { Schema, model, Document } from "mongoose";

interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const Session = model<ISession>("Session", sessionSchema);

export default Session;
