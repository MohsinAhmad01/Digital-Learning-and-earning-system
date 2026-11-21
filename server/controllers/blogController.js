import { Blog } from "../models/BlogModel.js";

const makeSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      category,
      tags,
      authorName,
      authorRole,
      sections,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!title || !shortDescription || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category and cover image are required",
      });
    }

    const fullUrl = `${req.protocol}://${req.get("host")}`;

    const blog = await Blog.create({
      title,
      slug: makeSlug(title),
      shortDescription,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      coverImage: `${fullUrl}/uploads/${req.file.filename}`,
      author: {
        name: authorName || "DevTech Team",
        role: authorRole || "Author",
      },
      sections: sections ? JSON.parse(sections) : [],
      metaTitle,
      metaDescription,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.title) {
      updateData.slug = makeSlug(updateData.title);
    }

    if (updateData.tags) {
      updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
    }

    if (updateData.sections) {
      updateData.sections = JSON.parse(updateData.sections);
    }

    if (req.file) {
      const fullUrl = `${req.protocol}://${req.get("host")}`;
      updateData.coverImage = `${fullUrl}/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};