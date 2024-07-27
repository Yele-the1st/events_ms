import mongoose from "mongoose";
import { IRole } from "../database/models";
import { RoleRepository } from "../database/repository";

/**
 * Service for managing roles.
 */
class RoleService {
  private roleRepository: RoleRepository;

  /**
   * Initializes the RoleService with a new repository instance.
   */
  constructor() {
    this.roleRepository = new RoleRepository();
  }

  /**
   * Creates a new role.
   * @param {CreateRoleParams} params - Object containing the name and permissions of the role.
   * @returns {Promise<IRole>} - The created role.
   */
  async createRole(params: CreateRoleParams): Promise<IRole> {
    const role = this.roleRepository.createRole({
      name: params.name,
      permissions: params.permissions,
    });
    return role;
  }

  /**
   * Finds a role by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the role to be found.
   * @returns {Promise<IRole | null>} - The found role or null if not found.
   */
  async findRoleById(id: mongoose.Types.ObjectId): Promise<IRole | null> {
    return this.roleRepository.findById(id);
  }

  /**
   * Finds a role by name.
   * @param {FindRoleByNameParams} params - Object containing the name of the role.
   * @returns {Promise<IRole | null>} - The found role or null if not found.
   */
  async findRoleByName(params: FindRoleByNameParams): Promise<IRole | null> {
    return this.roleRepository.findByName(params.name);
  }

  /**
   * Updates a role by ID.
   * @param {UpdateRoleParams} params - Object containing the ID and update fields for the role.
   * @returns {Promise<IRole | null>} - The updated role or null if not found.
   */
  async updateRole(params: UpdateRoleParams): Promise<IRole | null> {
    return this.roleRepository.updateRole({
      id: params.id,
      updateFields: params.updateFields,
    });
  }

  /**
   * Deletes a role by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the role to be deleted.
   * @returns {Promise<IRole | null>} - The deleted role or null if not found.
   */
  async deleteRole(id: mongoose.Types.ObjectId): Promise<IRole | null> {
    return this.roleRepository.deleteRole(id);
  }

  /**
   * Lists all roles.
   * @returns {Promise<IRole[]>} - An array of all roles.
   */
  async listRoles(): Promise<IRole[]> {
    return this.roleRepository.findAll();
  }
}

/**
 * Parameters for creating a role.
 */
interface CreateRoleParams {
  name: string;
  permissions: string[];
}

/**
 * Parameters for finding a role by name.
 */
interface FindRoleByNameParams {
  name: string;
}

/**
 * Parameters for updating a role.
 */
interface UpdateRoleParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IRole>;
}

export default RoleService;
