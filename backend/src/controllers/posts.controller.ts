import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { NotFoundError, ValidationError } from "../middleware/error.middleware";

/**
 * 获取文章列表（支持分页、过滤）
 */
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const query: Record<string, unknown> = {};
    
    // 只有管理员可以看到未发布的文章
    if (!req.user || req.user.role !== "admin") {
      query.published = true;
    } else if (req.query.published) {
      query.published = req.query.published === "true";
    }

    // 标签过滤
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // 搜索
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // 查询总数
    const total = await Post.countDocuments(query);

    // 查询文章
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content"); // 列表不返回完整内容

    res.json({
      success: true,
      data: {
        items: posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 根据 slug 获取文章详情
 */
export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const query: Record<string, unknown> = { slug };
    
    // 非管理员只能看已发布的文章
    if (!req.user || req.user.role !== "admin") {
      query.published = true;
    }

    const post = await Post.findOne(query);

    if (!post) {
      throw NotFoundError("Post");
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建文章
 */
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, excerpt, coverImage, tags, published } = req.body;

    // 生成 slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "");

    // 检查 slug 是否已存在
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      throw ValidationError("A post with this title already exists");
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      coverImage,
      tags: tags || [],
      published: published || false,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新文章
 */
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 如果更新了标题，重新生成 slug
    if (updates.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const post = await Post.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      throw NotFoundError("Post");
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除文章
 */
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      throw NotFoundError("Post");
    }

    res.json({
      success: true,
      data: { message: "Post deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
};
