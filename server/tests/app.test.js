import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("DevTrack API", () => {
  it("reports healthy", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("validates registration", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "Dev", email: "dev@example.com", password: "123" });
    expect(response.status).toBe(400);
  });

  it("protects projects endpoint", async () => {
    const response = await request(app).get("/api/projects");
    expect(response.status).toBe(401);
  });
});
