// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/", router);

app.use((err, req, res, next) => {
  console.log(err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "bratAI Agent Service",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Agent service running on port ${PORT}`);
  connectDB();
});
