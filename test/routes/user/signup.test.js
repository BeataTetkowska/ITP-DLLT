const request = require("supertest");
const app = require("../../../app/app");

const toBeTrue = require("../../matchers/toBeTrue");
const toBeFalse = require("../../matchers/toBeFalse");
expect.extend(toBeTrue);
expect.extend(toBeFalse);

describe("/user/signup", () => {
  var email = "test@example.com";
  beforeAll(async () => {
    return await request(app)
      .post("/user/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: "password",
      });
  });
  it("GET /signup -> HTTP 200", async () => {
    return request(app).get("/user/signup").expect(200);
  });

  it("GET /signup -> Content Type HTML", async () => {
    return request(app)
      .get("/user/signup")
      .expect("Content-type", /text\/html/);
  });

  it("POST /signup -> Create user HTTP 201", async () => {
    return request(app)
      .post("/user/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: `${Math.round(Math.random() * 1000)}@test.com`,
        password: "password",
      })
      .expect(201);
  });

  it("POST /signup -> Create User - Content Type HTML", async () => {
    return request(app)
      .post("/user/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: `${Math.round(Math.random() * 1000)}@test.com`,
        password: "password",
      })
      .expect("Content-Type", /text\/html/);
  });

  it("POST /signup -> Duplicate email HTTP 409 Conflict", async () => {
    return request(app)
      .post("/user/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: "password",
      })
      .expect(409);
  });

  it("POST /signup -> Duplicate email content type HTML ", async () => {
    return request(app)
      .post("/user/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: "password",
      })
      .expect("Content-Type", /text\/html/);
  });
});
