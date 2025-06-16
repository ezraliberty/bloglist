const router = require("express").Router();

const { Op } = require("sequelize");
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get("/:id", async (req, res) => {
  let read = {
    [Op.in]: [true, false]
  }

  if (req.query.read === 'true') {
    read = {
      [Op.in]: [true]
    }
  } else if (req.query.read === 'false') {
    read = {
      [Op.in]: [false]
    }
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: ['id', 'author', 'url', 'likes', 'title', 'year'],
        through: {
          attributes: ['id', 'is_read'],
          where: {
            is_read: read
          }
        }
      }
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });

  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
