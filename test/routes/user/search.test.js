const request = require("supertest");
const app = require("../../../app/app");
const server = request.agent(app);

describe("GET /user/search?query no auth", () => {
  var query = "";
  var url = `/user/search?query=${query}`;

  it("HTTP 401", () => request(app).get(url).expect(401));

  it("Content HTML", () =>
    request(app).get(url).expect("Content-type", /text/));
});

describe("GET /user/search?query not admin", () => {
  var query = "";
  var url = `/user/search?query=${query}`;
  var email = "email@taken.com";
  var password = "email@taken.com";

  beforeAll(
    async () => await server.post("/user/login").send({ email, password })
  );

  it("HTTP 403", () => server.get(url).expect(403));

  it("Content HTML", () => server.get(url).expect("Content-type", /text/));
  afterAll(async () => await server.get("/user/logout"));
});

function testSearchQuery(query, expectedIds, expectedListLength) {
  var url = `/user/search?query=${query}`;
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(
    async () => await server.post("/user/login").send({ email, password })
  );

  it("HTTP 200", () => server.get(url).expect(200));

  it("Content JSON", () => server.get(url).expect("Content-type", /json/));

  it(`Users list length ${expectedListLength}`, () =>
    server
      .get(url)
      .then((res) => expect(res.body.length).toBe(expectedListLength)));

  it("Correct User IDs returned", () =>
    server
      .get(url)
      .then((res) =>
        res.body.forEach((user, i) => expect(user._id).toBe(expectedIds[i]))
      ));

  afterAll(async () => await server.get("/user/logout"));
}

var ids = [
  "52b156df-a256-49bd-ad70-925ea2fa2067",
  "ffea1494-397f-45ca-b17c-0106f1dc38dd",
  "090cc4b2-022b-406e-8010-653542d5492c",
  "17a41050-2f2e-4de5-aaab-a6930d1096ca",
  "c301345a-4ab1-42b4-b4d3-086ff71559f6",
];
describe('GET /user/search/?query=""', () => testSearchQuery("", ids, 5));

describe("GET /user/search/?query=a", () => testSearchQuery("a", ids, 5));

describe("GET /user/search/?query=admin", () =>
  testSearchQuery("admin", ["090cc4b2-022b-406e-8010-653542d5492c"], 1));

describe("GET /user/search/?query=aDmIn", () =>
  testSearchQuery("aDmIn", ["090cc4b2-022b-406e-8010-653542d5492c"], 1));

describe("GET /user/search/?query=min user", () =>
  testSearchQuery("min user", ["090cc4b2-022b-406e-8010-653542d5492c"], 1));

describe("GET /user/search/?query=wooo", () => testSearchQuery("wooo", [], 0));

//Testing search by email
describe("GET /user/search/?query=random", () =>
  testSearchQuery("random", [], 0));
