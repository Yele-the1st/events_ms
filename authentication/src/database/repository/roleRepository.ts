import mongoose from "mongoose";
import { Role, IRole } from "../models";

interface CreateRoleParams {
  name: string;
  permissions?: string[];
}

interface UpdateRoleParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IRole>;
}

interface DeleteByNameParams {
  name: string;
}

class RoleRepository {
  /**
   * Creates a new role.
   * @param {CreateRoleParams} params - Object containing name and optional permissions for the role.
   * @returns {Promise<IRole>} - The created role.
   */
  async createRole({
    name,
    permissions = [],
  }: CreateRoleParams): Promise<IRole> {
    const role = new Role({
      name,
      permissions,
    });

    const result = await role.save();
    return result;
  }

  /**
   * Finds a role by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the role.
   * @returns {Promise<IRole | null>} - The found role or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<IRole | null> {
    return Role.findById(id).exec();
  }

  /**
   * Finds a role by name.
   * @param {string} name - The name of the role.
   * @returns {Promise<IRole | null>} - The found role or null if not found.
   */
  async findByName(name: string): Promise<IRole | null> {
    return Role.findOne({ name }).exec();
  }

  /**
   * Updates a role by ID.
   * @param {UpdateRoleParams} params - Object containing id and updateFields.
   * @returns {Promise<IRole | null>} - The updated role or null if not found.
   */
  async updateRole({
    id,
    updateFields,
  }: UpdateRoleParams): Promise<IRole | null> {
    return Role.findByIdAndUpdate(id, updateFields, { new: true }).exec();
  }

  /**
   * Deletes a role by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the role.
   * @returns {Promise<IRole | null>} - The deleted role or null if not found.
   */
  async deleteRole(id: mongoose.Types.ObjectId): Promise<IRole | null> {
    return Role.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes a role by name.
   * @param {DeleteByNameParams} params - Object containing the name of the role.
   * @returns {Promise<IRole | null>} - The deleted role or null if not found.
   */
  async deleteByName({ name }: DeleteByNameParams): Promise<IRole | null> {
    return Role.findOneAndDelete({ name }).exec();
  }

  /**
   * Finds all roles.
   * @returns {Promise<IRole[]>} - List of all roles.
   */
  async findAll(): Promise<IRole[]> {
    return Role.find().exec();
  }
}

export default RoleRepository;
