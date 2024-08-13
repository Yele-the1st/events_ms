import { AnalyticsModel, Analytics } from "../models/analytics";
import { BaseRepository } from "./baseRepo";

export class AnalyticsRepository extends BaseRepository<Analytics> {
  constructor() {
    super(AnalyticsModel);
  }

  // Add any specific methods for the Analytics repository here
}
