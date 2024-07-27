import mongoose from "mongoose";
import { IPermission } from "../database/models";
import { PermissionRepository } from "../database/repository";

/**
 * Service for managing permissions.
 */
class PermissionService {
  private permissionRepository: PermissionRepository;

  /**
   * Initializes the PermissionService with a new repository instance.
   */
  constructor() {
    this.permissionRepository = new PermissionRepository();
  }

  /**
   * Creates a new permission.
   * @param {CreatePermissionParams} params - Object containing the name of the permission.
   * @returns {Promise<IPermission>} - The created permission.
   */
  async createPermission(params: CreatePermissionParams): Promise<IPermission> {
    const name = params.name;
    const permission = await this.permissionRepository.createPermission({
      name,
    });
    return permission;
  }

  /**
   * Finds a permission by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the permission to be found.
   * @returns {Promise<IPermission | null>} - The found permission or null if not found.
   */
  async findPermissionById(
    id: mongoose.Types.ObjectId
  ): Promise<IPermission | null> {
    return await this.permissionRepository.findById(id);
  }

  /**
   * Finds a permission by name.
   * @param {FindPermissionByNameParams} params - Object containing the name of the permission.
   * @returns {Promise<IPermission | null>} - The found permission or null if not found.
   */
  async findPermissionByName(
    params: FindPermissionByNameParams
  ): Promise<IPermission | null> {
    return await this.permissionRepository.findByName(params.name);
  }

  /**
   * Updates a permission by ID.
   * @param {UpdatePermissionParams} params - Object containing the ID and update fields.
   * @returns {Promise<IPermission | null>} - The updated permission or null if not found.
   */
  async updatePermission(
    params: UpdatePermissionParams
  ): Promise<IPermission | null> {
    return await this.permissionRepository.updatePermission({
      id: params.id,
      updateFields: params.updateFields,
    });
  }

  /**
   * Deletes a permission by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the permission to be deleted.
   * @returns {Promise<IPermission | null>} - The deleted permission or null if not found.
   */
  async deletePermission(
    id: mongoose.Types.ObjectId
  ): Promise<IPermission | null> {
    return await this.permissionRepository.deletePermission(id);
  }

  /**
   * Lists all permissions.
   * @returns {Promise<IPermission[]>} - An array of all permissions.
   */
  async listPermissions(): Promise<IPermission[]> {
    return await this.permissionRepository.findAll();
  }
}

/**
 * Parameters for creating a permission.
 */
interface CreatePermissionParams {
  name: string;
}

/**
 * Parameters for finding a permission by name.
 */
interface FindPermissionByNameParams {
  name: string;
}

/**
 * Parameters for updating a permission.
 */
interface UpdatePermissionParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IPermission>;
}

export default PermissionService;
