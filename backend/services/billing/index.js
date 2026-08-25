import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import router from "./routes/billing.route.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.json({
    message: "bratAI Billing Service",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Billing service running on port ${PORT}`);
  connectDB();
});
