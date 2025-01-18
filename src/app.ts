import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
// app.use(morgan("tiny"));
app.use(express.static("public"));

// route         //! if there is api it will need
// app.use("/api/v1", router);

// graphql route
// app.use("/api/v1/graphql", expressMiddleware(graphqlServer));

app.get("/", async (req: Request, res: Response, next) => {
  return res.send("<h1> Welcome to Chat app Server </h1>");
});

export default app;
