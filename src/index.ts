import express, { Request, Response } from "express";
import bodyParser from 'body-parser'
import { UserRepo } from "./user";
import { ApiRequest, handleDoLoginRequest } from "./controllers";
import { registerApiRouter } from "./api";

const port = "3000";

const app = express();
app.use(bodyParser.json());
app.use((req: Request, resp: Response, next) => {
  (req as ApiRequest).userRepo = UserRepo;
  next()
});

app.get("/", (req: Request, res: Response, next) => {
  res.header("Content-Type", "text/html");
  res.send('<h1>Index Page</h1');
});

app.post("/do-login", handleDoLoginRequest);


registerApiRouter(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
