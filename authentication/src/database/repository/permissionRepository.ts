import mongoose from "mongoose";
import { Permission, IPermission } from "../models";

interface CreatePermissionParams {
  name: string;
}

interface UpdatePermissionParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IPermission>;
}

interface DeleteByNameParams {
  name: string;
}

class PermissionRepository {
  /**
   * Creates a new permission.
   * @param {CreatePermissionParams} params - Object containing the name of the permission.
   * @returns {Promise<IPermission>} - The created permission.
   */
  async createPermission({
    name,
  }: CreatePermissionParams): Promise<IPermission> {
    const permission = new Permission({
      name,
    });

    const result = await permission.save();
    return result;
  }

  /**
   * Finds a permission by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the permission.
   * @returns {Promise<IPermission | null>} - The found permission or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<IPermission | null> {
    return await Permission.findById(id).exec();
  }

  /**
   * Finds a permission by name.
   * @param {string} name - The name of the permission.
   * @returns {Promise<IPermission | null>} - The found permission or null if not found.
   */
  async findByName(name: string): Promise<IPermission | null> {
    return await Permission.findOne({ name }).exec();
  }

  /**
   * Updates a permission by ID.
   * @param {UpdatePermissionParams} params - Object containing id and updateFields.
   * @returns {Promise<IPermission | null>} - The updated permission or null if not found.
   */
  async updatePermission({
    id,
    updateFields,
  }: UpdatePermissionParams): Promise<IPermission | null> {
    return await Permission.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes a permission by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the permission.
   * @returns {Promise<IPermission | null>} - The deleted permission or null if not found.
   */
  async deletePermission(
    id: mongoose.Types.ObjectId
  ): Promise<IPermission | null> {
    return await Permission.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes a permission by name.
   * @param {DeleteByNameParams} params - Object containing the name of the permission.
   * @returns {Promise<IPermission | null>} - The deleted permission or null if not found.
   */
  async deleteByName({
    name,
  }: DeleteByNameParams): Promise<IPermission | null> {
    return await Permission.findOneAndDelete({ name }).exec();
  }

  /**
   * Finds all permissions.
   * @returns {Promise<IPermission[]>} - List of all permissions.
   */
  async findAll(): Promise<IPermission[]> {
    return await Permission.find().exec();
  }
}

export default PermissionRepository;
