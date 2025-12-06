import { Router } from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { validate, validatePagination } from "../middleware/validate.middleware";
import { createPostSchema, updatePostSchema, postQuerySchema } from "../schemas/post.schema";

const router = Router();

/**
 * @route   GET /api/posts
 * @desc    获取文章列表（支持分页、过滤）
 * @access  Public（未发布的文章需要认证）
 */
router.get(
  "/",
  optionalAuthenticate,
  validatePagination,
  validate(postQuerySchema, "query"),
  getPosts
);

/**
 * @route   GET /api/posts/:slug
 * @desc    根据 slug 获取文章详情
 * @access  Public（未发布的文章需要认证）
 */
router.get("/:slug", optionalAuthenticate, getPostBySlug);

/**
 * @route   POST /api/posts
 * @desc    创建文章
 * @access  Private (Admin)
 */
router.post("/", authenticate, validate(createPostSchema), createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    更新文章
 * @access  Private (Admin)
 */
router.put("/:id", authenticate, validate(updatePostSchema), updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    删除文章
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, deletePost);

export default router;
