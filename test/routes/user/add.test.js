const request = require("supertest");
const app = require("../../../app/app");
const loginUser = require("../../utils/loginUser");
const server = request.agent(app);

describe("GET /user/add no auth", () => {
  var url = "/user/add";
  it("-> HTTP 401", () => request(app).get(url).expect(401));
  it("-> Content Type HTML", () =>
    request(app).get(url).expect("Content-type", /text/));
});

function loginAndGetAddUser(email, code) {
  var url = "/user/add";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP ${code}`, () => server.get(url).expect(code));
  it("-> Content Type HTML", () =>
    server.get(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
}

describe("GET /user/add standard user", () =>
  loginAndGetAddUser("email@taken.com", 403));

describe("GET /user/add as admin", () =>
  loginAndGetAddUser("admin@admin.admin", 200));
