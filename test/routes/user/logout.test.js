const request = require("supertest");
const app = require("../../../app/app");
const server = request.agent(app);

const loginUser = require("../../utils/loginUser");

describe("/user/logout logout successful", () => {
  var email = "logintest1@test.com";
  var password = "password";

  beforeAll(async () => {
    await request(app)
      .post("/user/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: password,
      });
  });

  beforeEach(async () => {
    await loginUser(server, email, password);
  });

  it("GET /user/logout -> HTTP 200", async () => {
    return server.get("/user/logout").expect(200);
  });

  it("GET /user/logout -> content HTML", async () => {
    return server.get("/user/logout").expect("Content-Type", /text\/html/);
  });

  afterAll(async () => {
    server.get("/user/logout");
  });
});

describe("/user/logout logut unsuccessful", () => {
  it("GET /user/logout -> HTTP 200", async () => {
    return server.get("/user/logout").expect(200);
  });

  it("GET /user/logout -> content HTML", async () => {
    return server.get("/user/logout").expect("Content-Type", /text\/html/);
  });
});
