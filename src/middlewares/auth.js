import passport from "passport";

export const authToken = (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send("No autorizado");

    req.user = user;
    next();
  })(req, res, next);
};
