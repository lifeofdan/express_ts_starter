import express, { Request, Response, Router } from "express";
import bodyParser from "body-parser";

const app = express();
const port = "3000";

app.use(bodyParser.json());

type User = {
  id: number;
  username: string;
  password: string;
};

const usersTable: User[] = [];

app.post("/register", registerUser);

function registerUser(req: Request, res: Response) {
  const payload: { username: string; password: string } = req.body;
  usersTable.push({
    id: usersTable.length + 1,
    username: payload.username,
    password: payload.password,
  });

  res.status(200).json({
    message: "User registered successfully",
    user: usersTable[usersTable.length - 1],
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
