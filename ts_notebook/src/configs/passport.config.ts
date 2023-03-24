import { Request } from "express";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, Secret } from "jsonwebtoken";
import * as dotenv from "dotenv";
import logger from "./Logger";
import { db } from "./db.configs";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET: Secret = process.env.SECRET!;

// init passport
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
      passReqToCallback: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (req: Request, jwt_payload: JwtPayload, done: any) => {
      try {
        const findUser = await db.query(
          "SELECT * FROM users WHERE userId = $1",
          [jwt_payload.sub]
        );

        // user not found
        if (findUser.rowCount <= 0) {
          done(null, false, { message: "User not found" });
          return;
        }

        //assign req.user to foudnUser;

        const userdata = {
          userid: findUser.rows[0].userid,
          username: findUser.rows[0].username,
        };
        req.user = findUser.rows[0].userdata;
        done(null, userdata, { message: "Logged In" });
      } catch (err) {
        logger.error(err);
      }
    }
  )
);

export default passport;
