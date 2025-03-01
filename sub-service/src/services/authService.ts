import jwt from "jsonwebtoken";
import fs from "fs";

const publicKey = fs.readFileSync("/app/keys/public.key", "utf8");

export const verifyToken = (token: string) => {

  return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
};
