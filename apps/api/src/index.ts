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
import uploadRoutes from "./routes/upload.routes";
import containerRoutes from "./routes/container.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "http:", "https:", "blob:"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('public/uploads'));

app.get("/", (req: Request, res: Response) => {
  res.send("CHI MA HTT API is running!");
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/system-configs", systemConfigRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/jobs", jobArticleRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/containers", containerRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
