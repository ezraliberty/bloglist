require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

Blog.sync()

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();

  return res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.destroy({
      where: { id: req.params.id },
    });
    return res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const main = async () => {
//     try {
//         await sequelize.authenticate()
//         const blogs = await sequelize.query("SELECT * FROM blogs", {type: QueryTypes.SELECT})
//         // console.log(blogs)
//         blogs.map(blog => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`))
//         // console.log('Connection has been established successfully.')
//         sequelize.close()
//     } catch (error) {
//         console.error('Unable to connect to the database:', error)
//     }
// }

// main()
