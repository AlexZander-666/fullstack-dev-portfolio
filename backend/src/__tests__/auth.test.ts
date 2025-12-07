import request from "supertest";
import { User } from "../models/User";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

// Require after setting env to avoid server startup in tests
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../index").default;

describe("Auth Endpoints", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should reject invalid credentials", async () => {
    jest.spyOn(User, "findOne").mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    } as never);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "wrongpass123!" });

    expect(res.status).toBe(401);
  });

  it("should require email and password", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(400);
  });

  it("should set httpOnly cookie on successful login", async () => {
    const mockUser = {
      _id: "507f191e810c19729de860ea",
      email: "test@test.com",
      name: "Tester",
      role: "admin",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(User, "findOne").mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    } as never);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "Validpass123!" });

    const cookies = res.headers["set-cookie"];

    expect(res.status).toBe(200);
    const hasTokenCookie = Array.isArray(cookies)
      ? cookies.some((c) => c.startsWith("token="))
      : typeof cookies === "string"
        ? cookies.startsWith("token=")
        : false;
    expect(hasTokenCookie).toBe(true);
  });
});
