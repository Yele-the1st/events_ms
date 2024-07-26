import mongoose from "mongoose";
import { Permission, IPermission } from "../models";

class PermissionRepository {
  // Create a new permission
  async createPermission(name: string): Promise<IPermission> {
    const permission = new Permission({
      name,
    });

    const result = await permission.save();
    return result;
  }

  // Find a permission by ID
  async findById(id: mongoose.Types.ObjectId): Promise<IPermission | null> {
    return await Permission.findById(id).exec();
  }

  // Find a permission by name
  async findByName(name: string): Promise<IPermission | null> {
    return await Permission.findOne({ name }).exec();
  }

  // Update a permission by ID
  async updatePermission(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<IPermission>
  ): Promise<IPermission | null> {
    return await Permission.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  // Delete a permission by ID
  async deletePermission(
    id: mongoose.Types.ObjectId
  ): Promise<IPermission | null> {
    return await Permission.findByIdAndDelete(id).exec();
  }

  // Delete a permission by name
  async deleteByName(name: string): Promise<IPermission | null> {
    return await Permission.findOneAndDelete({ name }).exec();
  }

  // Find all permissions
  async findAll(): Promise<IPermission[]> {
    return await Permission.find().exec();
  }
}

export default PermissionRepository;
