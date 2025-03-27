import { User, UserRepo } from "./user";
import { Request, Response } from "express";

export interface ApiRequest extends Request {
  userRepo?: typeof UserRepo
};

export async function handleDoLoginRequest (req: Request, resp: Response) {
  let apiRequest = req as ApiRequest;
  let credential: { username: string, password: string } = apiRequest.body;

  const user = await apiRequest.userRepo?.findByUsername(credential.username);

  if (user && user.validatePassword(credential.password)) {
    resp.json({ success: true, user: user.toJSON(), token: user.generateApiToken() });
    return
  }
  resp.json({ success: false, token: null });
}

export async function handleSecureRequest (_req: Request, resp: Response) {
  resp.json({
    success: true,
    data: "secure data"
  })
}

export async function handleSecure2Request (_req: Request, resp: Response) {
  resp.json({
    success: true,
    data: "secure data 2"
  })
}