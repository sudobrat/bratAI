import express from "express";
import {
  deductCredit,
  login,
  logOut,
  updateUserPayment,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logOut);
router.put("/update-payment", updateUserPayment);
router.post("/deduct-credits", deductCredit);

export default router;
