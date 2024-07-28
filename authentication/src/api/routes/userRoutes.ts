import { Router } from "express";
import { UserController } from "../controllers";
import { validateData } from "../middlewares/validationMiddleware";
import { CreateUserDto } from "../../dtos/userDTO";

// Initialize the router
const router: Router = Router();

// Initialize the UserController
const userController = new UserController();

// Define the routes and map them to controller methods

// Create a new user
router.post("/users", validateData(CreateUserDto), userController.createUser);

// Get a user by ID
router.get("/users/:id", userController.getUserById);

// Update a user by ID
router.put("/users/:id", userController.updateUser);

// Delete a user by ID
router.delete("/users/:id", userController.deleteUser);

// Authenticate a user
router.post("/users/authenticate", userController.authenticateUser);

// Verify an authentication token
router.post("/users/verify-token", userController.verifyAuthToken);

// Verify a user's email
router.post("/users/verify-email", userController.verifyUserEmail);

// Request a password reset email
router.post("/users/forgot-password", userController.forgotPasswordEmail);

// Reset a user's password
router.post("/users/reset-password", userController.resetPassword);

// Update a user's password
router.put("/users/update-password", userController.updatePassword);

// Enable multi-factor authentication (MFA)
router.post("/users/:id/enable-mfa", userController.enableMFA);

// Disable multi-factor authentication (MFA)
router.post("/users/:id/disable-mfa", userController.disableMFA);

// Verify a user's MFA token
router.post("/users/verify-mfa", userController.verifyMFAToken);

// Export the router
export default router;
