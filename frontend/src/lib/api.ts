import type { Project, Post, ApiResponse, PaginatedResponse, ContactRequest } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "An error occurred");
  }

  return data;
}

// Projects API
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  return fetchApi<ApiResponse<Project[]>>("/projects");
}

export async function getProjectById(id: string): Promise<ApiResponse<Project>> {
  return fetchApi<ApiResponse<Project>>(`/projects/${id}`);
}

// Posts API
export async function getPosts(params?: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}): Promise<PaginatedResponse<Post>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return fetchApi<PaginatedResponse<Post>>(`/posts${query ? `?${query}` : ""}`);
}

export async function getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
  return fetchApi<ApiResponse<Post>>(`/posts/${slug}`);
}

// Contact API
export async function submitContact(data: ContactRequest): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<ApiResponse<{ message: string }>>("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
