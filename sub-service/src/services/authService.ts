import jwt from "jsonwebtoken";
import fs from "fs";

const publicKey = fs.readFileSync("/app/keys/public.key", "utf8");

export const verifyToken = (token: string) => {
  console.log("\nfvhdfv\n");
  console.log(publicKey);
  console.log("\n", token, "\n");
  console.log(jwt.verify(token, publicKey, { algorithms: ["RS256"] }));
  return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
};
