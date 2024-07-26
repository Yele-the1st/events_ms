import mongoose from "mongoose";
import { Role, IRole } from "../models";

class RoleRepository {
  // Create a new role
  async createRole(name: string, permissions: string[] = []): Promise<IRole> {
    const role = new Role({
      name,
      permissions,
    });

    const result = await role.save();
    return result;
  }

  // Find a role by ID
  async findById(id: mongoose.Types.ObjectId): Promise<IRole | null> {
    return await Role.findById(id).exec();
  }

  // Find a role by name
  async findByName(name: string): Promise<IRole | null> {
    return await Role.findOne({ name }).exec();
  }

  // Update a role by ID
  async updateRole(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<IRole>
  ): Promise<IRole | null> {
    return await Role.findByIdAndUpdate(id, updateFields, { new: true }).exec();
  }

  // Delete a role by ID
  async deleteRole(id: mongoose.Types.ObjectId): Promise<IRole | null> {
    return await Role.findByIdAndDelete(id).exec();
  }

  // Delete a role by name
  async deleteByName(name: string): Promise<IRole | null> {
    return await Role.findOneAndDelete({ name }).exec();
  }

  // Find all roles
  async findAll(): Promise<IRole[]> {
    return await Role.find().exec();
  }
}

export default RoleRepository;
