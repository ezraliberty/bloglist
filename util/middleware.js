const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");

const { ActiveSession, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    try {
      req.decodedToken = jwt.verify(token, SECRET);

      const isActive = await ActiveSession.findOne({ where: { token } });

      if (!isActive) return res.status(401).json({ error: "expired" });

      const user = await User.findByPk(req.decodedToken.id);
      if (!user || user.disabled)
        return res.status(401).json({ error: "denied" });
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

module.exports = { tokenExtractor, blogFinder };
