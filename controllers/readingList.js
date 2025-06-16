const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  const blogId = req.body.blogId;

  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(blogId);
  const readingList = await ReadingList.create({
    userId: user.id,
    blogId: blog.id,
  });
  return res.json(readingList);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const item = await ReadingList.findByPk(req.params.id);

  if (!item || (item.userId !== user.id)) {
    return res.status(404).json({ error: "Post not found" });
  }

  item.isRead = req.body.isRead;
  await item.save();
  res.json(item);
});

module.exports = router;
