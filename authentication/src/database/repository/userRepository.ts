import mongoose from "mongoose";
import { User, IUser } from "../models";

interface CreateUserParams {
  email: string;
  password: string;
  roles?: string[];
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  mfaSecret?: string;
}
interface CreateUserByMagicLinkParams {
  email: string;
  roles?: string[];
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

interface UpdateUserParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IUser>;
}

interface VerifyPasswordParams {
  userId: mongoose.Types.ObjectId;
  password: string;
}

class UserRepository {
  /**
   * Creates a new user.
   * @param {CreateUserParams} params - Object containing details for the new user.
   * @returns {Promise<IUser>} - The created user.
   */
  async createUser({
    email,
    password,
    roles = ["user"],
    emailVerified = false,
    mfaEnabled = false,
    mfaSecret,
  }: CreateUserParams): Promise<IUser> {
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

  /**
   * Creates a new user.
   * @param {CreateUserByMagicLinkParams} params - Object containing details for the new user.
   * @returns {Promise<IUser>} - The created user.
   */
  async createUserByMagicLink({
    email,
    roles = ["user"],
    emailVerified = false,
    mfaEnabled = false,
    mfaSecret,
  }: CreateUserByMagicLinkParams): Promise<IUser> {
    const user = new User({
      email,
      roles,
      emailVerified,
      mfaEnabled,
      mfaSecret,
    });

    const result = await user.save();
    return result;
  }

  /**
   * Finds a user by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the user.
   * @returns {Promise<IUser | null>} - The found user or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  /**
   * Finds a user by email.
   * @param {string} email - The email of the user.
   * @returns {Promise<IUser | null>} - The found user or null if not found.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  /**
   * Updates user information.
   * @param {UpdateUserParams} params - Object containing ID and fields to update.
   * @returns {Promise<IUser | null>} - The updated user or null if not found.
   */
  async updateUser({
    id,
    updateFields,
  }: UpdateUserParams): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateFields, { new: true }).exec();
  }

  /**
   * Deletes a user.
   * @param {mongoose.Types.ObjectId} id - The ID of the user.
   * @returns {Promise<IUser | null>} - The deleted user or null if not found.
   */
  async deleteUser(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).exec();
  }

  /**
   * Verifies user password.
   * @param {VerifyPasswordParams} params - Object containing user ID and password.
   * @returns {Promise<boolean>} - True if password is correct, false otherwise.
   */
  async verifyPassword({
    userId,
    password,
  }: VerifyPasswordParams): Promise<boolean> {
    const user = await User.findById(userId).exec();
    if (!user) throw new Error("User not found");
    return await user.comparePassword(password);
  }
}

export default UserRepository;
