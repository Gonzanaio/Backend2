import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import bcrypt from "bcrypt";
import usuarios from "../models/userModel.js";

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

export const initializePassport = () => {
  // 🔐 LOGIN (LOCAL STRATEGY)
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await usuarios.findOne({ email });

          if (!user) return done(null, false, { message: "Usuario no existe" });

          const isValid = bcrypt.compareSync(password, user.password);

          if (!isValid)
            return done(null, false, { message: "Contraseña incorrecta" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // 🎟 JWT STRATEGY (CURRENT)
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => req?.cookies?.jwtCookie,
        ]),
        secretOrKey: "secretJWT",
      },
      async (jwt_payload, done) => {
        try {
          const user = await usuarios.findById(jwt_payload.id);

          if (!user) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};

export default passport;
