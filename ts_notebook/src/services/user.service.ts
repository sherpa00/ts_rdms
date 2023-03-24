import * as dotenv from "dotenv";
import { compare, genSalt, hash } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";
import { db } from "../configs/db.configs";
import logger from "../configs/Logger";

dotenv.config();

export interface IUser {
  userId?: number;
  username: string;
  password: string;
  salt?: string;
}

// service for signing up new user
export const Register = async (user: IUser): Promise<void> => {
  try {
    const username: string = user.username;

    const salt: string = await genSalt(10);

    const hashedPassword: string = await hash(user.password, salt);

    // create a new user
    await db.query(
      "INSERT INTO users (username,password,salt) VALUES ($1,$2,$3) RETURNING *;",
      [username, hashedPassword, salt]
    );
  } catch (err) {
    logger.error(err);
  }
};

// login service to logging in
export const Login = async (user: IUser) => {
  try {
    const username: string = user.username;

    const foundUser = await db.query(
      "SELECT * FROM users WHERE users.username = $1;",
      [username]
    );

    // user not found
    if (foundUser.rowCount === 0) {
      return {
        success: false,
        message: "No User Found",
      };
    }

    // user found then compare passwords hash
    const isVerified: boolean = await compare(
      user.password,
      foundUser.rows[0].password
    );

    // user password match then sign jwt
    if (isVerified) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const SECRET: Secret = process.env.SECRET!;

      // sign new token with userId
      const token = sign({ sub: foundUser.rows[0].userid }, SECRET, {
        expiresIn: "1h",
      });

      return {
        success: true,
        token: token,
        data: foundUser.rows[0],
      };
    }

    return {
      success: false,
      message: "Invalid Password",
    };
  } catch (err) {
    logger.error(err);
  }
};

// service for user remove
export const DeleteUser = async (userid: number) => {
  try {
    // here delete user with db
    await db.query("DELETE FROM users WHERE users.userid = $1", [userid]);
  } catch (err) {
    logger.error(err);
  }
};

// service for modifying user's username
export const ChangeUsername = async (userid: number, newUsername: string) => {
  try {
    // change the username with userid iwth db
    await db.query("UPDATE users SET username = $1 WHERE userid = $2;", [
      newUsername,
      userid,
    ]);
  } catch (err) {
    logger.error(err);
  }
};

// service for modifying user's password
export const ChangePassword = async (userid: number, newPassword: string) => {
  try {
    // get user informations
    const userInfo = await db.query(
      "SELECT salt FROM users WHERE userid = $1;",
      [userid]
    );

    // first get the salt from db
    const oldSalt: string = userInfo.rows[0].salt;

    // now hash new password with the salt
    const newHashedPassword = await hash(newPassword, oldSalt);

    // change the password with new hashed password by userid iwth db
    await db.query("UPDATE users SET password = $1 WHERE userid = $2;", [
      newHashedPassword,
      userid,
    ]);
  } catch (err) {
    logger.error(err);
  }
};
