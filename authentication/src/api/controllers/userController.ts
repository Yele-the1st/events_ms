import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { UserService } from "../../services";

/**
 * Controller for handling user-related HTTP requests.
 */
class UserController {
  private userService: UserService;

  /**
   * Initializes the UserController with a new UserService instance.
   */
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Handles the creation of a new user.
   * @param req - Express Request object containing email and password in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const user = await this.userService.createUser({ email, password });
      console.log(name);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles fetching a user by their ID.
   * @param req - Express Request object with user ID in the URL params.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles updating a user by their ID.
   * @param req - Express Request object with user ID in the URL params and update fields in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const updateFields = req.body;
      const user = await this.userService.updateUser({
        id: userId,
        updateFields,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles deleting a user by their ID.
   * @param req - Express Request object with user ID in the URL params.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const user = await this.userService.deleteUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles user authentication.
   * @param req - Express Request object containing email and password in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.authenticateUser({
        email,
        password,
      });
      if (!token) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles verifying a JWT token and fetching the corresponding user.
   * @param req - Express Request object containing the token in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const user = await this.userService.verifyAuthToken(token);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles verifying a user's email using a verification token.
   * @param req - Express Request object containing the verification token in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  verifyUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const user = await this.userService.verifyUserEmail(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles requesting a password reset email.
   * @param req - Express Request object containing the email in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  forgotPasswordEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      await this.userService.forgotPasswordEmail(email);
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles resetting a user's password using a reset token.
   * @param req - Express Request object containing the reset token and new password in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resetToken, newPassword } = req.body;
      await this.userService.resetPassword(resetToken, newPassword);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles updating a user's password.
   * @param req - Express Request object containing userId, oldPassword, and newPassword in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      await this.userService.updatePassword({
        userId: new Types.ObjectId(userId),
        oldPassword,
        newPassword,
      });
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles enabling multi-factor authentication (MFA) for a user.
   * @param req - Express Request object containing user ID in the URL params.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  enableMFA = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const mfaData = await this.userService.enableMFA(userId);
      if (!mfaData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(mfaData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles disabling multi-factor authentication (MFA) for a user.
   * @param req - Express Request object containing user ID in the URL params.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  disableMFA = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const user = await this.userService.disableMFA(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles verifying a user's MFA token.
   * @param req - Express Request object containing userId and token in the body.
   * @param res - Express Response object.
   * @param next - Express NextFunction for passing control to the next middleware.
   */
  verifyMFAToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, token } = req.body;
      const isValid = await this.userService.verifyMFAToken({
        userId: new Types.ObjectId(userId),
        token,
      });
      res.status(200).json({ isValid });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
