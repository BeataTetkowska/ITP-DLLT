const request = require("supertest");
const app = require("../../app/app");
const server = request.agent(app);
const { getNextEvent, getNextEventToday } = require("../../app/routes/event");

const toBeWithinRange = require("../matchers/toBeWithinRange");
expect.extend(toBeWithinRange);

//This is an example integration test for the /api/event api endpoint
//The test simulates a HTTP request to /api/event and then tests aspects
//of the response.
//Checks for the content-type to be json
//Checks for the HTTP code to be 200
//Checks for the body in the response to consist of an object with
//a specific set of fields
describe("/event API", () => {
  it("GET /event -> HTTP 200", async () => {
    return request(app).get("/event").expect(200);
  });

  it("GET /event -> Content Type HTML", async () => {
    return request(app)
      .get("/event")
      .expect("Content-type", /text\/html/);
  });

  it("GET /api/event -> HTTP 200", async () => {
    return request(app).get("/api/event").expect(200);
  });

  it("GET /api/event -> Content Type JSON", async () => {
    return request(app).get("/api/event").expect("Content-Type", /json/);
  });

  it("GET /api/event -> event fields", async () => {
    return request(app)
      .get("/api/event")
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            day: expect.toBeWithinRange(0, 6),
            start: expect.objectContaining({
              hours: expect.toBeWithinRange(0, 23),
              minutes: expect.toBeWithinRange(0, 59),
            }),
            end: expect.objectContaining({
              hours: expect.toBeWithinRange(0, 23),
              minutes: expect.toBeWithinRange(0, 59),
            }),
            location: expect.any(String),
          })
        );
      });
  });
});

describe("/admin/event as admin", () => {
  var adminEmail = "admin@admin.admin";
  var adminPassword = "admin@admin.admin";

  beforeAll(async () => {
    await server.post("/login").send({
      email: adminEmail,
      password: adminPassword,
    });
  });

  it("GET /admin/event -> HTTP 200", async () => {
    return server.get("/admin/event").expect(200);
  });

  it("GET /admin/event -> Content Type HTML", async () => {
    return server.get("/admin/event").expect("Content-type", /text\/html/);
  });

  afterAll(async () => {
    await server.get("/logout");
  });
});

describe("/admin/event as standard user", () => {
  var email = "email@taken.com";
  var password = "email@taken.com";

  beforeAll(async () => {
    await server.post("/login").send({
      email: email,
      password: password,
    });
  });

  it("GET /admin/event -> HTTP 401", async () => {
    return server.get("/admin/event").expect(401);
  });

  it("GET /admin/event -> Content Type HTML", async () => {
    return server.get("/admin/event").expect("Content-type", /text\/html/);
  });

  afterAll(async () => {
    await server.get("/logout");
  });
});

describe("/admin/event without auth", () => {
  it("GET /admin/event -> HTTP 401", async () => {
    return server.get("/admin/event").expect(401);
  });

  it("GET /admin/event -> Content Type HTML", async () => {
    return server.get("/admin/event").expect("Content-type", /text\/html/);
  });
});

async function loginAndRegisterUser(email, password) {
  var eventId = null;
  await loginUser(email, password);
  await server.get("/api/event").then((data) => {
    eventId = data.body._id;
  });
  await server.post("/api/event/register").send({ eventId });
  await server.get("/logout");
  return eventId;
}

async function loginUser(email, password) {
  await server.post("/login").send({
    email: email,
    password: password,
  });
}

describe("/api/admin/event/attendance no auth", () => {
  it("/api/admin/event/attendance HTTP 401", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId: 1 })
      .expect(401);
  });

  it("/api/admin/event/attendance content html", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId: 1 })
      .expect("Content-type", /text\/html/);
  });
});

describe("/api/admin/event/attendance no registered users", () => {
  var eventId = null;

  var email = "admin@admin.admin";
  var password = "admin@admin.admin";

  beforeAll(async () => {
    await server.post("/login").send({
      email: email,
      password: password,
    });
    await server.get("/api/event").then((data) => {
      eventId = data.body._id;
    });
  });

  it("/api/admin/event/attendance HTTP 200", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .expect(200);
  });

  it("/api/admin/event/attendance content html", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .expect("Content-type", /json/);
  });

  it("/api/admin/event/attendance content html", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .then((res) => expect(res.body.result.users.length).toBe(0));
  });

  afterAll(async () => {
    await server.get("/logout");
  });
});

describe("/api/admin/event/attendance one user", () => {
  var eventId = null;

  var email = "admin@admin.admin";
  var password = "admin@admin.admin";

  beforeAll(async () => {
    eventId = await loginAndRegisterUser(email, password);
    await loginUser(email, password);
  });

  it("/api/admin/event/attendance length is 1", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .then((res) => expect(res.body.result.users.length).toBe(1));
  });

  it("/api/admin/event/attendance HTTP 200", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .expect(200);
  });

  afterAll(async () => {
    await server.get("/logout");
  });
});

describe("/api/admin/event/attendance 3 users", () => {
  var eventId = null;

  var adminEmail = "admin@admin.admin";
  var adminPassword = "admin@admin.admin";

  var userEmail = "email@taken.com";
  var userPassword = "email@taken.com";

  beforeAll(async () => {
    await loginAndRegisterUser(adminEmail, adminPassword);
    eventId = await loginAndRegisterUser(userEmail, userPassword);
    await loginUser(adminEmail, adminPassword);
  });

  it("/api/admin/event/attendance length 3", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .then((res) => expect(res.body.result.users.length).toBe(3));
  });

  it("/api/admin/event/attendance HTTP 200", async () => {
    return server
      .post("/api/admin/event/attendance")
      .send({ eventId })
      .expect(200);
  });

  afterAll(async () => {
    await server.get("/logout");
  });
});

describe("/api/event/register with auth", () => {
  var eventId = null;

  var email = "email@taken.com";
  var password = "email@taken.com";
  beforeAll(async () => {
    await server.post("/login").send({
      email: email,
      password: password,
    });
    await server.get("/api/event").then((data) => {
      eventId = data.body._id;
    });
  });

  it("/api/event/register HTTP 200", async () => {
    return server.post("/api/event/register").send({ eventId }).expect(200);
  });

  it("/api/event/register register successful", async () => {
    return server
      .post("/api/event/register")
      .send({ eventId })
      .then((res) => expect(res.body.result.success).toBe(true));
  });

  afterAll(async () => {
    await server.get("/logout");
  });
});

describe("/api/event/register without auth", () => {
  var eventId = null;

  beforeAll(async () => {
    await server.get("/api/event").then((data) => {
      eventId = data.body._id;
    });
  });

  it("/api/event/register register unsuccessful", async () => {
    return server
      .post("/api/event/register")
      .send({ eventId })
      .then((res) => expect(res.body.result.success).toBe(false));
  });

  it("/api/event/register HTTP 401", async () => {
    return server.post("/api/event/register").send({ eventId }).expect(401);
  });
});

describe("/event Functions", () => {
  it("getNextEventToday Sunday Night", () => {
    var sundayMidnight = new Date(2021, 9, 24);
    expect(getNextEventToday(sundayMidnight)).toEqual(false);
  });

  it("getNextEventToday Monday Morning", () => {
    var mondayMorning = new Date(2021, 9, 25, 9);
    expect(getNextEventToday(mondayMorning)).toEqual(false);
  });

  it("getNextEventToday Tuesday Morning", () => {
    var tuesdayMorning = new Date(2021, 9, 26, 9);
    var result = getNextEventToday(tuesdayMorning);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEventToday Tuesday evening", () => {
    var tuesdayEvening = new Date(2021, 9, 26, 19);
    var result = getNextEventToday(tuesdayEvening);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(19);
    expect(result.end.hours).toBe(21);
  });

  it("getNextEventToday Tuesday night", () => {
    var tuesdayNight = new Date(2021, 9, 26, 23);
    expect(getNextEventToday(tuesdayNight)).toEqual(false);
  });

  //GetNextEvent
  it("getNextEvent Sunday Night", () => {
    var sundayMidnight = new Date(2021, 9, 24);
    var result = getNextEvent(sundayMidnight);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEvent Monday Morning", () => {
    var mondayMorning = new Date(2021, 9, 25, 9);
    var result = getNextEvent(mondayMorning);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEvent Tuesday Morning", () => {
    var tuesdayMorning = new Date(2021, 9, 26, 9);
    var result = getNextEvent(tuesdayMorning);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEvent Tuesday evening", () => {
    var tuesdayEvening = new Date(2021, 9, 26, 19);
    var result = getNextEvent(tuesdayEvening);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(19);
    expect(result.end.hours).toBe(21);
  });

  it("getNextEvent Tuesday night", () => {
    var tuesdayNight = new Date(2021, 9, 26, 23);
    var result = getNextEvent(tuesdayNight);
    expect(result.day).toBe(3);
    expect(result.start.hours).toBe(16);
    expect(result.end.hours).toBe(17);
  });
});
