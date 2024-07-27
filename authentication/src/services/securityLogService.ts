import mongoose from "mongoose";
import { ISecurityLog } from "../database/models";
import { SecurityLogRepository } from "../database/repository";

/**
 * Service for managing security logs.
 */
class SecurityLogService {
  private securityLogRepository: SecurityLogRepository;

  /**
   * Initializes the SecurityLogService with a new repository instance.
   */
  constructor() {
    this.securityLogRepository = new SecurityLogRepository();
  }

  /**
   * Creates a new security log.
   * @param {CreateSecurityLogParams} params - Object containing userId, action, ipAddress, userAgent, and details for the security log.
   * @returns {Promise<ISecurityLog>} - The created security log.
   */
  async createSecurityLog(
    params: CreateSecurityLogParams
  ): Promise<ISecurityLog> {
    const securityLog = await this.securityLogRepository.createLog({
      userId: params.userId,
      action: params.action,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      details: params.details,
    });
    return securityLog;
  }

  /**
   * Finds a security log by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the security log to be found.
   * @returns {Promise<ISecurityLog | null>} - The found security log or null if not found.
   */
  async findSecurityLogById(
    id: mongoose.Types.ObjectId
  ): Promise<ISecurityLog | null> {
    return await this.securityLogRepository.findById(id);
  }

  /**
   * Finds security logs by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user whose security logs are to be found.
   * @returns {Promise<ISecurityLog[]>} - An array of security logs for the specified user.
   */
  async findSecurityLogsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<ISecurityLog[]> {
    return await this.securityLogRepository.findByUserId(userId);
  }

  /**
   * Finds security logs by action.
   * @param {FindSecurityLogsByActionParams} params - Object containing the action to filter logs by.
   * @returns {Promise<ISecurityLog[]>} - An array of security logs matching the specified action.
   */
  async findSecurityLogsByAction(
    params: FindSecurityLogsByActionParams
  ): Promise<ISecurityLog[]> {
    return await this.securityLogRepository.findByAction(params.action);
  }

  /**
   * Deletes a security log by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the security log to be deleted.
   * @returns {Promise<ISecurityLog | null>} - The deleted security log or null if not found.
   */
  async deleteSecurityLog(
    id: mongoose.Types.ObjectId
  ): Promise<ISecurityLog | null> {
    return await this.securityLogRepository.deleteLog(id);
  }

  /**
   * Deletes all security logs by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user whose security logs are to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - An object containing the count of deleted logs.
   */
  async deleteSecurityLogsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await this.securityLogRepository.deleteLogsByUserId({ userId });
  }
}

/**
 * Parameters for creating a security log.
 */
interface CreateSecurityLogParams {
  userId: mongoose.Types.ObjectId;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string;
}

/**
 * Parameters for finding security logs by action.
 */
interface FindSecurityLogsByActionParams {
  action: string;
}

export default SecurityLogService;
