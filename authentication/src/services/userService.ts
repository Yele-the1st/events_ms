import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../database/models";
import { UserRepository } from "../database/repository";
import EmailVerificationTokenService from "./emailVerificationService";
import PasswordResetService from "./passwordResetService";
import speakeasy from "speakeasy";

/**
 * Service for managing users.
 */
class UserService {
  private userRepository: UserRepository;
  private emailVerificationTokenService: EmailVerificationTokenService;
  private passwordResetService: PasswordResetService;

  /**
   * Initializes the UserService with new repository and service instances.
   */
  constructor() {
    this.userRepository = new UserRepository();
    this.emailVerificationTokenService = new EmailVerificationTokenService();
    this.passwordResetService = new PasswordResetService();
  }

  /**
   * Creates a new user.
   * @param {CreateUserParams} params - Object containing email and password for the new user.
   * @returns {Promise<IUser>} - The created user.
   */
  async createUser(params: CreateUserParams): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(params.password, 10);
    const user = await this.userRepository.createUser({
      email: params.email,
      password: hashedPassword,
      roles: ["user"],
      mfaEnabled: false,
      emailVerified: false,
    });

    await this.emailVerificationTokenService.createActivationToken(
      user._id as mongoose.Types.ObjectId
    );

    return user;
  }

  /**
   * Finds a user by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the user to be found.
   * @returns {Promise<IUser | null>} - The found user or null if not found.
   */
  async findUserById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  /**
   * Finds a user by email.
   * @param {string} email - The email of the user to be found.
   * @returns {Promise<IUser | null>} - The found user or null if not found.
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Updates a user by ID.
   * @param {UpdateUserParams} params - Object containing ID and updateFields for updating the user.
   * @returns {Promise<IUser | null>} - The updated user or null if not found.
   */
  async updateUser(params: UpdateUserParams): Promise<IUser | null> {
    if (params.updateFields.password) {
      params.updateFields.password = await bcrypt.hash(
        params.updateFields.password,
        10
      );
    }
    return await this.userRepository.updateUser({
      id: params.id,
      updateFields: params.updateFields,
    });
  }

  /**
   * Deletes a user by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the user to be deleted.
   * @returns {Promise<IUser | null>} - The deleted user or null if not found.
   */
  async deleteUser(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await this.userRepository.deleteUser(id);
  }

  /**
   * Authenticates a user and returns a JWT token if successful.
   * @param {AuthenticateUserParams} params - Object containing email and password for authentication.
   * @returns {Promise<string | null>} - JWT token if authentication is successful, null otherwise.
   */
  async authenticateUser(
    params: AuthenticateUserParams
  ): Promise<string | null> {
    const user = await this.findUserByEmail(params.email);
    if (!user) return null;

    const isMatch = await user.comparePassword(params.password);
    if (!isMatch) return null;

    return user.generateAuthToken();
  }

  /**
   * Verifies a JWT token and returns the corresponding user.
   * @param {string} token - The JWT token to be verified.
   * @returns {Promise<IUser | null>} - The user if the token is valid, null otherwise.
   */
  async verifyAuthToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      return await this.findUserById(decoded.id);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifies the user's email with the given token.
   * @param {string} token - The email verification token.
   * @returns {Promise<IUser | null>} - The user if the token is valid, null otherwise.
   */
  async verifyUserEmail(token: string): Promise<IUser | null> {
    const emailVerificationToken =
      await this.emailVerificationTokenService.findEmailVerificationTokenByToken(
        token
      );
    if (!emailVerificationToken) {
      throw new Error("Invalid or expired token");
    }

    const userId =
      emailVerificationToken.userId as unknown as mongoose.Types.ObjectId;
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.emailVerified = true;
    await user.save();
    await this.emailVerificationTokenService.deleteEmailVerificationToken(
      emailVerificationToken._id as mongoose.Types.ObjectId
    );

    return user;
  }

  /**
   * Requests a password reset for the user with the given email.
   * @param {string} email - The email of the user requesting the password reset.
   * @returns {Promise<void>} - No return value.
   */
  async forgotPasswordEmail(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    await this.passwordResetService.createPasswordReset(
      {
        userId: user._id as mongoose.Types.ObjectId,
        resetToken: resetToken,
        expiresAt: new Date(Date.now() + 3600000),
      } // 1 hour expiration
    );

    // Send resetToken to the user's email (implementation not shown here)
  }

  /**
   * Resets the user's password using a token.
   * @param {string} resetToken - The password reset token.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<void>} - No return value.
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const passwordReset =
      await this.passwordResetService.findPasswordResetByToken(resetToken);
    if (!passwordReset) {
      throw new Error("Invalid or expired reset token");
    }

    const user = await this.findUserById(
      passwordReset.userId as unknown as mongoose.Types.ObjectId
    );
    if (!user) {
      throw new Error("User not found");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await this.passwordResetService.deletePasswordReset(
      passwordReset._id as mongoose.Types.ObjectId
    );
  }

  /**
   * Updates the user's password.
   * @param {UpdatePasswordParams} params - Object containing userId, oldPassword, and newPassword.
   * @returns {Promise<void>} - No return value.
   */
  async updatePassword(params: UpdatePasswordParams): Promise<void> {
    const user = await this.findUserById(params.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await user.comparePassword(params.oldPassword);
    if (!isMatch) {
      throw new Error("Incorrect old password");
    }

    user.password = await bcrypt.hash(params.newPassword, 10);
    await user.save();
  }

  /**
   * Generates an authentication token for the given user.
   * @param {IUser} user - The user for whom to generate the token.
   * @returns {string} - The generated JWT token.
   */
  generateAuthToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
  }

  /**
   * Enables MFA for the user with the given ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user to enable MFA for.
   * @returns {Promise<{ secret: string; otpauth_url?: string } | null>} - Object containing the secret and otpauth URL if successful.
   */
  async enableMFA(
    userId: mongoose.Types.ObjectId
  ): Promise<{ secret: string; otpauth_url?: string } | null> {
    const secret = speakeasy.generateSecret({ name: `MyApp (${userId})` });
    const user = await this.updateUser({
      id: userId,
      updateFields: {
        mfaEnabled: true,
        mfaSecret: secret.base32,
      },
    });

    if (!user) return null;

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
    };
  }

  /**
   * Disables MFA for the user with the given ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user to disable MFA for.
   * @returns {Promise<IUser | null>} - The user with MFA disabled, or null if not found.
   */
  async disableMFA(userId: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await this.updateUser({
      id: userId,
      updateFields: { mfaEnabled: false, mfaSecret: "" },
    });
  }

  /**
   * Verifies an MFA token for the user with the given ID.
   * @param {VerifyMFATokenParams} params - Object containing userId and token for MFA verification.
   * @returns {Promise<boolean>} - True if the MFA token is valid, false otherwise.
   */
  async verifyMFAToken(params: VerifyMFATokenParams): Promise<boolean> {
    const user = await this.findUserById(params.userId);
    if (!user || !user.mfaEnabled || !user.mfaSecret) return false;

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: params.token,
    });

    return verified;
  }
}

/**
 * Parameters for creating a user.
 */
interface CreateUserParams {
  email: string;
  password: string;
}

/**
 * Parameters for updating a user.
 */
interface UpdateUserParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IUser>;
}

/**
 * Parameters for authenticating a user.
 */
interface AuthenticateUserParams {
  email: string;
  password: string;
}

/**
 * Parameters for authenticating a user.
 */
interface UpdatePasswordParams {
  userId: mongoose.Types.ObjectId;
  oldPassword: string;
  newPassword: string;
}

/**
 * Parameters for verifying an MFA token.
 */
interface VerifyMFATokenParams {
  userId: mongoose.Types.ObjectId;
  token: string;
}

export default UserService;
