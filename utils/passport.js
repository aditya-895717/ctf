import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
   cb(null,profile)
    }));

passport.serializeUser((user, cb) => {
  done(null, user);
})

passport.deserializeUser((user, cb) => {
  done(null, user);
})
// Export passport or other modules if needed
export default passport;
