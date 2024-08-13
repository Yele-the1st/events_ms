import { AuditLogModel, AuditLog } from "../models/auditLog";
import { BaseRepository } from "./baseRepo";

export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor() {
    super(AuditLogModel);
  }

  // Add any specific methods for the AuditLog repository here
}
