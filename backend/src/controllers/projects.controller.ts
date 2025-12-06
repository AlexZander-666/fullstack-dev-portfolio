import { Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { NotFoundError } from "../middleware/error.middleware";

/**
 * 获取项目列表
 */
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query: Record<string, unknown> = {};

    // 精选项目过滤
    if (req.query.featured === "true") {
      query.featured = true;
    }

    // 查询项目，按 featured 和 order 排序
    const projects = await Project.find(query).sort({ featured: -1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 根据 ID 获取项目详情
 */
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      throw NotFoundError("Project");
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建项目
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新项目
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      throw NotFoundError("Project");
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除项目
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      throw NotFoundError("Project");
    }

    res.json({
      success: true,
      data: { message: "Project deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
};
