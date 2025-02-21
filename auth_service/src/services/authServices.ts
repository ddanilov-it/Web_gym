import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, config.jwtPrivateKey, {
    algorithm: "RS256",
    expiresIn: "1h"
  });
};


export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtPublicKey, { algorithms: ["RS256"] });
};