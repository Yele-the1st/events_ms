import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

interface IUser extends Document {
  email: string;
  password: string;
  emailVerified: boolean;
  roles: string[];
  mfaEnabled: boolean;
  mfaSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    emailVerified: { type: Boolean, default: false },
    roles: { type: [String], default: ["user"] },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.password) return next(); // Skip if there's no password
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id, roles: this.roles },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
};

const User: Model<IUser> = mongoose.model("User", userSchema);

export { User, IUser };
