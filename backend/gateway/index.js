import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import getCurrentUser from "./controllers/user.controller.js";
import proxyWithHeaders from "./utils/proxyWithHeaders.js";
dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxyWithHeaders(process.env.CHAT_SERVICE));
app.use("/api/agent", protect, proxyWithHeaders(process.env.AGENT_SERVICE));
app.use("/api/billing", protect, proxyWithHeaders(process.env.BILLING_SERVICE));
app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.json({
    message: "bratAI Gateway",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));
