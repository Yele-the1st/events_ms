import mongoose from "mongoose";
import { User, IUser } from "../models";

class UserRepository {
  // Create a new user
  async createUser(
    email: string,
    password: string,
    roles: string[] = ["user"],
    emailVerified: boolean = false,
    mfaEnabled: boolean = false,
    mfaSecret?: string
  ): Promise<IUser> {
    const user = new User({
      email,
      password,
      roles,
      emailVerified,
      mfaEnabled,
      mfaSecret,
    });

    const result = await user.save();
    return result;
  }

  // Find a user by ID
  async findById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  // Find a user by email
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  // Update user information
  async updateUser(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateFields, { new: true }).exec();
  }

  // Delete a user
  async deleteUser(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).exec();
  }

  // Verify user password
  async verifyPassword(
    userId: mongoose.Types.ObjectId,
    password: string
  ): Promise<boolean> {
    const user = await User.findById(userId).exec();
    if (!user) throw new Error("User not found");
    return await user.comparePassword(password);
  }
}

export default UserRepository;
