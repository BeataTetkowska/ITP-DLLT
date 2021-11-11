const request = require("supertest");
const app = require("../../../app/app");
const loginUser = require("../../utils/loginUser");
const server = request.agent(app);

var users = require("../../../app/db/users");

describe("GET /user no auth", () => {
  var url = "/user";

  it(`-> HTTP 401`, () => request(app).get(url).expect(401));

  it("-> Content HTML", () =>
    request(app).get(url).expect("Content-type", /text/));
});

describe("GET /user HTML", () => {
  var url = "/user";
  var email = "email@taken.com";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 200`, () => server.get(url).expect(200));

  it("-> Content HTML", () => server.get(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

function signInAndGetUser(email, password) {
  var url = "/user";

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 200`, () =>
    server.get(url).set("Accept", "application/json").expect(200));

  it("-> Content HTML", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .expect("Content-type", /json/));

  it("-> Correct Email returned", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => expect(body.email).toBe(email)));

  afterAll(() => server.get("/user/logout"));
}
describe("GET /user/:userId no auth", () => {
  var url = "/user/asdfasdf";

  it(`-> HTTP 401`, () => request(app).get(url).expect(401));

  it("-> Content HTML", () =>
    request(app).get(url).expect("Content-type", /text/));
});

describe("GET /user/:userId not admin", () => {
  var url = "/user/asdfasdfq";
  var email = "email@taken.com";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 403`, () => server.get(url).expect(403));

  it("-> Content HTML", () => server.get(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("GET /user/:userId Bad User ID", () => {
  //ID is for email@taken.com and may need to be updated if changed
  var url = "/user/ffea1494-397";
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 404`, () => server.get(url).expect(404));

  it("-> Content HTML", () => server.get(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("GET /user/:userId HTML as admin", () => {
  //ID is for email@taken.com and may need to be updated if changed
  var url = "/user/ffea1494-397f-45ca-b17c-0106f1dc38dd";
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 200`, () => server.get(url).expect(200));

  it("-> Content HTML", () => server.get(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("GET /user/:userId JSON as admin", () => {
  //ID is for email@taken.com and may need to be updated if changed
  var url = "/user/ffea1494-397f-45ca-b17c-0106f1dc38dd";
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 200`, () =>
    server.get(url).set("Accept", "application/json").expect(200));

  it("-> Content JSON", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .expect("Content-type", /json/));

  var expectedFields = expect.objectContaining({
    dob: expect.any(String),
    email: expect.any(String),
    postcode: expect.any(String),
    emergency: {
      phone: expect.any(String),
      name: expect.any(String),
    },
    name: {
      first: expect.any(String),
      last: expect.any(String),
    },
  });

  it("-> Expect correct fields", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => expect(body).toEqual(expectedFields)));

  afterAll(() => server.get("/user/logout"));
});

describe("GET /user/:userId HTML as admin", () => {
  //ID is for email@taken.com and may need to be updated if changed
  var url = "/user/ffea1494-397f-45ca-b17c-0106f1dc38dd";
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 200`, () => server.get(url).expect(200));

  it("-> Content HTML", () => server.get(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("GET /user admin@admin.admin", () =>
  signInAndGetUser("admin@admin.admin", "admin@admin.admin"));

describe("GET /user email@taken.com", () =>
  signInAndGetUser("email@taken.com", "email@taken.com"));

describe("GET /user fletcher.magdalen@yahoo.com", () =>
  signInAndGetUser(
    "fletcher.magdalen@yahoo.com",
    "fletcher.magdalen@yahoo.com"
  ));

describe("PATCH /user no auth", () => {
  var url = "/user";

  it(`-> HTTP 401`, () => request(app).patch(url).send({}).expect(401));

  it("-> Content HTML", () =>
    request(app).patch(url).send({}).expect("Content-type", /text/));
});

describe("PATCH General tests", () => {
  var url = "/user";
  var email = "email@taken.com";
  var password = email;
  var update = { dob: "16-04-21" };

  beforeAll(() => loginUser(server, email, password));

  it(`-> HTTP 200`, () => server.patch(url).send(update).expect(200));

  it("-> Content JSON", () =>
    server.patch(url).send(update).expect("Content-type", /json/));

  afterAll(() => server.get("/user/logout"));
});

function signInAndUpdateTopLevelKeys(email, password, update) {
  var url = "/user";

  beforeAll(async () => {
    await loginUser(server, email, password);
    await server.patch(url).send(update);
  });

  it("-> Update successful", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => {
        Object.keys(update).forEach((key) => {
          expect(body[key]).toBe(update[key]);
        });
      }));

  afterAll(() => server.get("/user/logout"));
}

var email = "email@taken.com";
var pass = email;
describe("PATCH /user update dob", () =>
  signInAndUpdateTopLevelKeys(email, pass, { dob: "27-04-92" }));

email = "admin@admin.admin";
pass = email;
describe("PATCH /user update multiple", () =>
  signInAndUpdateTopLevelKeys(email, pass, {
    email: "woo@woo.com",
    dob: "16-04-21",
    postcode: "AB159LE",
  }));

email = "norbert.devin@outlook.com";
pass = email;
describe("PATCH /user update email", () =>
  signInAndUpdateTopLevelKeys(email, pass, { email: "new@email.com" }));

describe("PATCH /user update first name", () => {
  var url = "/user";
  var email = "fletcher.magdalen@yahoo.com";
  var password = email;
  var update = { name: { first: "Updated" } };
  var previousValue;

  beforeAll(async () => {
    await loginUser(server, email, password);
    await server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => (previousValue = body));
    await server.patch(url).send(update);
  });

  it("-> Update successful", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => expect(body.name.first).toBe(update.name.first)));

  it("-> Last name not changed", () => {
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => expect(body.name.last).toBe(previousValue.name.last));
  });

  afterAll(() => server.get("/user/logout"));
});

describe("PATCH /user update first and last name", () => {
  var url = "/user";
  var email = "fletcher.magdalen@yahoo.com";
  var password = email;
  var update = { name: { first: "Updated", last: "Updated2" } };
  var previousValue;
  var newValue;

  beforeAll(async () => {
    await loginUser(server, email, password);
    await server.get(url).then(({ body }) => (previousValue = body));
    await server
      .patch(url)
      .send(update)
      .then(({ body }) => (newValue = body));
  });

  it("-> Update first names uccessful", () =>
    expect(newValue.name.first).toBe(update.name.first));

  it("-> Update first names uccessful", () =>
    expect(newValue.name.last).toBe(update.name.last));

  afterAll(() => server.get("/user/logout"));
});

describe("PATCH /user update emergency phone", () => {
  var url = "/user";
  var email = "fletcher.magdalen@yahoo.com";
  var password = email;
  var update = { emergency: { phone: "Updated" } };
  var previousValue;

  beforeAll(async () => {
    await loginUser(server, email, password);
    await server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => (previousValue = body));
    await server.patch(url).send(update);
  });

  it("-> Update successful", () =>
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) =>
        expect(body.emergency.phone).toBe(update.emergency.phone)
      ));

  it("-> Emergency name not changed", () => {
    server
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) =>
        expect(body.emergency.name).toBe(previousValue.emergency.name)
      );
  });

  afterAll(() => server.get("/user/logout"));
});

describe("DELETE /user no auth", () => {
  var url = "/user";
  it("-> HTTP 401 Unauthorised", () => server.delete(url).expect(401));
});

function deleteUser(email) {
  var url = "/user";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it("-> User Exists", () => {
    expect(users.find((user) => user.email === email).email).toBe(email);
  });

  it("-> HTTP 200", () => server.delete(url).expect(200));

  it("-> User not logged in", () => server.delete(url).expect(401));

  it("-> User Deleted", () => {
    expect(users.find((user) => user.email === email)).toBe(undefined);
  });

  afterAll(() => server.get("/user/logout"));
}

describe("DELETE /user delete random@email.com", () =>
  deleteUser("random@email.com"));

describe("DELETE /user delete spring.shephard@mail.com", () =>
  deleteUser("spring.shephard@mail.com"));
