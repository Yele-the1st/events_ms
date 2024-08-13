import {
  UserSubscriptionModel,
  UserSubscription,
} from "../models/userSubscription";
import { BaseRepository } from "./baseRepo";

export class UserSubscriptionRepository extends BaseRepository<UserSubscription> {
  constructor() {
    super(UserSubscriptionModel);
  }

  // Add any specific methods for the UserSubscription repository here
}
