const router = require("express").Router();

const { ActiveSession } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  const token = req.get("authorization").substring(7);
  await ActiveSession.destroy({ where: { token } });
  res.status(204).end();
});

module.exports = router;
