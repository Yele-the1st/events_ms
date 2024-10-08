/* eslint-disable no-console */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import crypto from "crypto";
import { User } from "../../database/models";
import { getConfig } from "../config";
import logger from "../winston/logger";

const env = process.env.NODE_ENV || "development";
const config = getConfig[env as keyof typeof getConfig];

const googleClientID: string = config.GOOGLE_CLIENT_ID as string;
const googleClientSecret: string = config.GOOGLE_CLIENT_SECRET as string;

const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL:
          "http://127.0.0.1:3000/api/v1/authenticate/oauth2/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done
      ) => {
        try {
          let user = await User.findOne({ email: profile.emails?.[0].value });
          if (!user) {
            const tempPassword = crypto.randomBytes(20).toString("hex");
            user = await User.create({
              google_id: profile.id,
              username: `${profile.name?.givenName}_${profile.name?.familyName}`,
              lastname: profile.name?.familyName,
              firstname: profile.name?.givenName,
              email: profile.emails?.[0].value,
              password: tempPassword,
              passwordConfirm: tempPassword,
              name: profile.displayName,
              verified: true,
              photo: profile.photos?.[0].value,
            });

            if (user) {
              try {
                const constants = {
                  verification_link: `${config.LIVE_BASE_URL}/api/v1/users/verify-email?token=${user.email}`,
                  password: tempPassword,
                };
                // Send welcome email

                console.log(constants);
              } catch (err) {
                console.error(err);
                logger.error(err);
              }
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default configureGoogleStrategy;
