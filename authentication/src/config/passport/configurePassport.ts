import passport from "passport";
import configureLocalStrategy from "./localStrategy";
import configureGoogleStrategy from "./googleStrategy";
import { User } from "../../database/models";

type User = {
  _id?: number;
};

const configurePassport = () => {
  configureLocalStrategy();
  configureGoogleStrategy();

  passport.serializeUser((user: User, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default configurePassport;
