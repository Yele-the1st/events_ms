import {
  UserPreferencesModel,
  UserPreferences,
} from "../models/userPreferences";
import { BaseRepository } from "./baseRepo";

export class UserPreferencesRepository extends BaseRepository<UserPreferences> {
  constructor() {
    super(UserPreferencesModel);
  }

  // Add any specific methods for the UserPreferences repository here
}
