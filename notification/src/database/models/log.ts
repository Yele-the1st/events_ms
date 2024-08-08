import mongoose, { Document, Schema } from "mongoose";

interface ILog extends Document {
  action: string;
  user: mongoose.Types.ObjectId;
  details: string;
  createdAt: Date;
}

const LogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

const Log = mongoose.model<ILog>("Log", LogSchema);

export default Log;
