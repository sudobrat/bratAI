import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(400).json({
        message: "Unauthorized. Please login first",
      });
    }

    const session = await redis.get(`session-${sessionId}`);
    if (!session) {
      return res.status(400).json({
        message: "No active session found. Please login first",
      });
    }

    req.user = JSON.parse(session);
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default protect;
