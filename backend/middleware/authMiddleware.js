const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("🔥 AUTH MIDDLEWARE HIT");
  console.log("🔥 HEADERS:", req.headers);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ NO AUTH HEADER");
    return res.status(401).json({ message: "No auth header" });
  }

  console.log("🔥 AUTH HEADER:", authHeader);

  const token = authHeader.split(" ")[1];
  console.log("🔥 TOKEN:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔥 DECODED:", decoded);

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json({ message: "JWT failed" });
  }
};
