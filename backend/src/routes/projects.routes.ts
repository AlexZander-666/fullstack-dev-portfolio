import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProjectSchema, updateProjectSchema } from "../schemas/project.schema";

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    获取项目列表
 * @access  Public
 */
router.get("/", getProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    根据 ID 获取项目详情
 * @access  Public
 */
router.get("/:id", getProjectById);

/**
 * @route   POST /api/projects
 * @desc    创建项目
 * @access  Private (Admin)
 */
router.post("/", authenticate, validate(createProjectSchema), createProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    更新项目
 * @access  Private (Admin)
 */
router.put("/:id", authenticate, validate(updateProjectSchema), updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    删除项目
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, deleteProject);

export default router;
