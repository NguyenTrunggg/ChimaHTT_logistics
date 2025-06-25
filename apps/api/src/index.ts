import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import roleRoutes from "./routes/role.routes";
import userRoutes from "./routes/user.routes";
import systemConfigRoutes from "./routes/system-config.routes";
import serviceRoutes from "./routes/service.routes";
import newsRoutes from "./routes/news.routes";
import jobArticleRoutes from "./routes/job-article.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("CHI MA HTT API is running!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/system-configs", systemConfigRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/jobs", jobArticleRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
