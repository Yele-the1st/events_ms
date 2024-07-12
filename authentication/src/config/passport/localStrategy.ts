import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../../database/models";

const configureLocalStrategy = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username })
            .select("+password")
            .select("+active");
          if (!user)
            return done(null, false, {
              message: "Incorrect email or password.",
            });

          const isMatch = await user.matchPassword(password);
          if (!isMatch)
            return done(null, false, {
              message: "Incorrect email or password.",
            });

          const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.roles,
            verified: user.isVerified,
          };
          return done(null, userInfo);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default configureLocalStrategy;
