const jwt = require('jsonwebtoken');

const router = require("express").Router();

const { Blog, User } = require("../models");
const { Op } = require('sequelize');
const { SECRET } = require("../util/config");
const { tokenExtractor, blogFinder } = require("../util/middleware");

router.get("/", async (req, res) => {
  const where = {}

  if (req.query.search) {
    const search = req.query.search;

    where[Op.or] = [
      {title: {[Op.substring]: search}},
      {author: {[Op.substring]: search}}
    ]
  }

  const blogs = await Blog.findAll({
    attributes: {exclude: ["userId"]},
    include:{
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  });

  return res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()});
  return res.json(blog);
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  if (req.decodedToken.id !== req.blog.userId) {
    return res.status(403).json({ error: "You are not authorized to delete this blog" });
  }

  await Blog.destroy({
    where: { id: req.params.id },
  });
  return res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  if (typeof req.body.likes !== "number") {
    throw new TypeError("Likes must be a number");
  }

  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
