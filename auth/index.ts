require("dotenv").config();
import express, { Request, Response } from "express";
import { routes } from "./src/rotes";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

mongoose
  .connect("mongodb://localhost/node_auth")
  .then(() => {
    console.log("connected to the database");
  })
  .catch();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

routes(app);

app.listen(7000, () => console.log("port listening on 7000"));
