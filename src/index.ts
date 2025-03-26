import express, { Request, Response, Router } from "express";
import fooBar from 'body-parser'
import { User } from "./user";

const app = express();
const port = "3000";



app.get("/", (req: Request, res: Response, next) => {
  // res.send("Hello World!");
  // console.log("Response sent");
  res.header("Content-Type", "application/json");
  res.json({ a: 1 });
});

const apiRoutes = Router();
apiRoutes.use(fooBar.json());
apiRoutes.post("/do-login", async (req, resp) => {
  let credential: { username: string, password: string } = req.body;

  const user = User.findByUsername(credential.username);

  if (user && user.password == credential.password) {

    resp.json({ success: true, user: user.toJSON(), token: user.generateApiToken() });
    return
  }

  resp.json({ success: false, token: null });

});

apiRoutes.get("/my-token", function (req, resp) {
  resp.json({
    token: ""
  })
})

apiRoutes.get("/secure", function (req, resp) {
  const token = req.headers.authorization?.toString().replace('Bearer', '').trim() || '';
  const user = User.findByToken(token);
  if (user && user.validateToken(token)) {

    resp.json({
      success: true,
      data: "secure data"
    })
    return;
  }
  resp.json({
    success: false,
    data: null
  })
});

app.use(apiRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
