import { Router, Request, Response } from "express";
import { ApiRequest, handleSecure2Request, handleSecureRequest } from "../controllers";
import { UserRepo } from "../user";

const apiRoutes = Router();

apiRoutes.use(async (req: Request, resp: Response, next) => {
  (req as ApiRequest).userRepo = UserRepo;
  const token = req.headers.authorization?.toString().replace('Bearer', '').trim() || '';

  if (!token) {
    resp.sendStatus(401);
    return
  }

  const user = await (req as ApiRequest).userRepo?.findByToken(token);
  if (user && user.validateToken(token)) {
    return next()
  }
  resp.sendStatus(401);
});

apiRoutes.get("/secure", handleSecureRequest);
apiRoutes.get("/secure2", handleSecure2Request);

export const registerRouter = (app: Router) => {
  app.use(apiRoutes);
}