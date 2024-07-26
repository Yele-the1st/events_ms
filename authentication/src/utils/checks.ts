// import { Request, Response } from "express";
// import redisClient from "../config/redis";
// import Admin from "../models/adminUser";
// import PasswordReset from "../models/PasswordReset";
// import SocialUser from "../models/socialUser";
// import User from "../models/User";
// import UserVerification from "../models/UserVerification";
// import logger from "../common/logger";
// import AmazonSESClient from "../utils/AmazonSES";

// // Define the expected environment variables
// const envs: string[] = [
//   "SECRET_KEY",
//   "PORT",
//   "MONGO_URI",
//   "AUTH_EMAIL",
//   "AUTH_PASS",
//   "PREFIX_URL",
//   "NODE_ENV",
//   "VERIFIED_EMAIL",
//   "VERIFIED_PASSWORD",
//   "ADMIN_EMAIL",
//   "ADMIN_PASSWORD",
//   "GOOGLE_CLIENT_ID",
//   "GOOGLE_CLIENT_SECRET",
//   "TWITTER_CONSUMER_KEY",
//   "TWITTER_CONSUMER_SECRET",
//   "TWITTER_CALLBACK_URL",
//   "FACEBOOK_APP_ID",
//   "FACEBOOK_APP_SECRET",
//   "FACEBOOK_CALLBACK_URL",
//   "REDIS_PORT",
//   "REDIS_HOST",
//   "REDIS_HOST_PASSWORD",
//   "PASSWORD_RESET_KEY",
//   "API_KEY",
//   "CLIENT_URL",
//   "AWS_ACCESS_KEY_ID_2",
//   "AWS_SECRET_ACCESS_KEY_2",
//   "S3_REGION",
// ];

// interface Quota {
//   Max24HourSend: number;
//   SentLast24Hours: number;
//   [key: string]: any; // For additional properties
// }

// // Define the response structure
// interface UtilitiesResponse {
//   red?: boolean;
//   green?: boolean;
//   em: {
//     function: boolean;
//     quota: Quota | {};
//     reason?: string;
//   };
//   var: {
//     function: boolean;
//     missing: string[];
//   };
// }

// const functions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const utilities: UtilitiesResponse = {
//       em: { function: false, quota: {} },
//       var: { function: true, missing: [] }
//     };

//     // Redis check
//     try {
//       await redisClient.set("smoke", "fibe", { EX: 1, NX: true });
//       utilities.red = true;
//     } catch (error) {
//       utilities.red = false;
//     }

//     // Database checks
//     try {
//       await Admin.findOne({ disabled: true });
//       await PasswordReset.findOne({ code: "smoke" });
//       await SocialUser.findOne({ provider: "smoke" });
//       await User.findOne({ firstName: "smoke" });
//       await UserVerification.findOne({ uniqueString: "smoke" });
//       utilities.green = true;
//     } catch (error) {
//       utilities.green = false;
//     }

//     // Email service quota check
//     try {
//       const quota: Quota = await AmazonSESClient.getQuota();
//       delete quota["$metadata"];
//       utilities.em.quota = quota;
//       const QuotaLeft = quota.Max24HourSend - quota.SentLast24Hours;
//       utilities.em.quota.QuotaLeft = QuotaLeft;
//       if (quota.Max24HourSend !== -1 && QuotaLeft <= 0) {
//         utilities.em.function = false;
//         utilities.em.reason = "24 Hour Quota Limit exceeded";
//       } else {
//         if (quota.Max24HourSend === -1) {
//           utilities.em.quota.QuotaLeft = "unlimited";
//         }
//         utilities.em.function = true;
//       }
//     } catch (error) {
//       utilities.em.function = false;
//       utilities.em.reason = (error as Error).message;
//     }

//     // Environment variable check
//     envs.forEach((env) => {
//       if (!process.env[env]) {
//         utilities.var.function = false;
//         utilities.var.missing.push(`${env.slice(0, 3)}...${env.slice(-3)}`);
//       }
//     });

//     // Respond with the status of various checks
//     res.status(200).json(utilities);
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       status: "FAILED",
//       error: "Internal Server Error",
//     });
//   }
// };

// export default functions;
