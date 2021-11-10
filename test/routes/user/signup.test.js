const request = require("supertest");
const app = require("../../../app/app");
const server = request.agent(app);
const loginUser = require("../../utils/loginUser");

var users = require("../../../app/db/users");

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

  it("-> User has been created", () => {
    return expect(users.findIndex((user) => user.email === email) < 0).toBe(
      false
    );
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

describe("POST /signup manual signup by admin: no auth", () => {
  var url = "/user/signup";
  it("-> HTTP 403", () => request(app).post(url).expect(403));
  it("-> Content Type HTML", () =>
    request(app).post(url).expect("Content-type", /text/));
});

describe("POST /signup manual signup by admin: auth as standard user", () => {
  var url = "/user/signup";
  var email = "random@email.com";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it("-> HTTP 403", () => server.post(url).expect(403));
  it("-> Content Type HTML", () =>
    server.post(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("POST /signup manual signup by admin: Successfully signup user", () => {
  var url = "/user/signup";
  var email = "admin@admin.admin";
  var password = email;

  var newUser = {
    name: {
      first: "test",
      last: "example",
    },
    email: "woo@woo.com",
    password: "password",
  };

  beforeAll(() => loginUser(server, email, password));

  it("-> HTTP 201", () => server.post(url).send(newUser).expect(201));
  it("-> Content Type HTML", () =>
    server.post(url).send(newUser).expect("Content-type", /text/));

  it("-> User has been created", () => {
    return expect(
      users.findIndex((user) => user.email === newUser.email) < 0
    ).toBe(false);
  });

  afterAll(() => server.get("/user/logout"));
});
