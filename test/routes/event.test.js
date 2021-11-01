const request = require("supertest");
const app = require("../../app/app");
const server = request.agent(app);
const {
  getNextEvent,
  getNextEventToday,
} = require("../../app/routes/event/controllers");

const toBeWithinRange = require("../matchers/toBeWithinRange");
expect.extend(toBeWithinRange);

const loginUser = require("../utils/loginUser");

async function loginAndRegisterUser(email, password) {
  var eventId = null;
  await loginUser(server, email, password);
  await server
    .get("/event")
    .set("Accept", "application/json")
    .then((data) => {
      eventId = data.body._id;
    });
  await server.put(`/event/${eventId}/register`);
  await server.get("/user/logout");
  return eventId;
}

//This is an example integration test for the /api/event api endpoint
//The test simulates a HTTP request to /api/event and then tests aspects
//of the response.
//Checks for the content-type to be json
//Checks for the HTTP code to be 200
//Checks for the body in the response to consist of an object with
//a specific set of fields
describe("/event no auth", () => {
  it("GET /event html -> HTTP 200", async () => {
    return request(app).get("/event").expect(200);
  });

  it("GET /event html -> Content Type HTML", async () => {
    return request(app)
      .get("/event")
      .expect("Content-type", /text\/html/);
  });

  it("GET /event json -> HTTP 200", async () => {
    return request(app)
      .get("/event")
      .set("Accept", "application/json")
      .expect(200);
  });

  it("GET /event json -> Content Type JSON", async () => {
    return request(app)
      .get("/event")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
  });

  it("GET /event json -> event fields", async () => {
    return request(app)
      .get("/event")
      .set("Accept", "application/json")
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

  it("GET /event json -> attendance null", async () => {
    return request(app)
      .get("/event")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.attendance).toEqual(null);
      });
  });
});

describe("/event as standard user", () => {
  var adminEmail = "email@taken.com";
  var adminPassword = "email@taken.com";

  beforeAll(async () => {
    await server.post("/user/login").send({
      email: adminEmail,
      password: adminPassword,
    });
  });

  it("GET /event -> HTTP 200", async () => {
    return server.get("/event").expect(200);
  });

  it("GET /event -> Content Type HTML", async () => {
    return server.get("/event").expect("Content-type", /text\/html/);
  });

  it("GET /event json -> HTTP 200", async () => {
    return server.get("/event").set("Aceept", "application/json").expect(200);
  });

  it("GET /event json -> Content Type JSON", async () => {
    return server
      .get("/event")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
  });

  it("GET /event json -> event fields", async () => {
    return server
      .get("/event")
      .set("Accept", "application/json")
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

  it("GET /event json -> attendance not null", async () => {
    return server
      .get("/event")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.attendance).toEqual(null);
      });
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event as admin", () => {
  var adminEmail = "admin@admin.admin";
  var adminPassword = "admin@admin.admin";

  beforeAll(async () => {
    await server.post("/user/login").send({
      email: adminEmail,
      password: adminPassword,
    });
  });

  it("GET /event -> HTTP 200", async () => {
    return server.get("/event").expect(200);
  });

  it("GET /event -> Content Type HTML", async () => {
    return server.get("/event").expect("Content-type", /text\/html/);
  });

  it("GET /event json -> HTTP 200", async () => {
    return server.get("/event").set("Aceept", "application/json").expect(200);
  });

  it("GET /event json -> Content Type JSON", async () => {
    return server
      .get("/event")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
  });

  it("GET /event json -> event fields", async () => {
    return server
      .get("/event")
      .set("Accept", "application/json")
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
            attendance: expect.any(Array),
          })
        );
      });
  });

  it("GET /event json -> attendance not null", async () => {
    return server
      .get("/event")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.attendance).not.toEqual(null);
      });
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event/1/attendance no auth", () => {
  it("GET /event/1/attendance -> HTTP 401", async () => {
    return server
      .get(`/event/${1}/attendance`)
      .set("Accept", "application/json")
      .expect(401);
  });

  it("GET /event/1/attendance -> content json", async () => {
    return server
      .get(`/event/${1}/attendance`)
      .set("Accept", "application/json")
      .expect("Content-type", /json/);
  });
});

describe("/event/1/attendance standard user", () => {
  var email = "email@taken.com";
  var password = "email@taken.com";

  beforeAll(async () => {
    await loginUser(server, email, password);
  });

  it("GET /event/1/attendance -> HTTP 403", async () => {
    return server
      .get(`/event/${1}/attendance`)
      .set("Accept", "application/json")
      .expect(403);
  });

  it("GET /event/1/attendance -> content json", async () => {
    return server
      .get(`/event/${1}/attendance`)
      .set("Accept", "application/json")
      .expect("Content-type", /json/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event/:eventId/attendance no registered users", () => {
  var eventId = null;

  var email = "admin@admin.admin";
  var password = "admin@admin.admin";

  beforeAll(async () => {
    await loginUser(server, email, password);
    await server
      .get("/event")
      .set("Accept", "application/json")
      .then((res) => {
        eventId = res.body._id;
      });
  });

  it("GET /event/:eventId/attendance -> HTTP 200", async () => {
    return server.get(`/event/${eventId}/attendance`).expect(200);
  });

  it("GET /event/:eventId/attendance -> content json", async () => {
    return server
      .get(`/event/${eventId}/attendance`)
      .expect("Content-type", /json/);
  });

  it("GET /event/:eventId/attendance -> 0 returned users", async () => {
    return server
      .get(`/event/${eventId}/attendance`)
      .then((res) => expect(res.body.users.length).toBe(0));
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event/:eventId/attendance one user", () => {
  var eventId = null;

  var email = "admin@admin.admin";
  var password = "admin@admin.admin";

  beforeAll(async () => {
    eventId = await loginAndRegisterUser(email, password);
    await loginUser(server, email, password);
  });

  it("GET /event/:eventId/attendance -> length 1", async () => {
    return server
      .get(`/event/${eventId}/attendance`)
      .then((res) => expect(res.body.users.length).toBe(1));
  });

  it("GET /event/:eventId/attendance -> HTTP 200", async () => {
    return server.get(`/event/${eventId}/attendance`).expect(200);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event/:eventId/attendance 3 users", () => {
  var eventId = null;

  var adminEmail = "admin@admin.admin";
  var adminPassword = "admin@admin.admin";

  var userEmail = "email@taken.com";
  var userPassword = "email@taken.com";

  beforeAll(async () => {
    await loginAndRegisterUser(adminEmail, adminPassword);
    eventId = await loginAndRegisterUser(userEmail, userPassword);
    await loginUser(server, adminEmail, adminPassword);
  });

  it("GET /event/:eventId/attendance -> length 3", async () => {
    return server.get(`/event/${eventId}/attendance`).then((res) => {
      expect(res.body.users.length).toBe(3);
    });
  });

  it("GET /event/:eventId/attendance -> HTTP 200", async () => {
    return server.get(`/event/${eventId}/attendance`).expect(200);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event/:eventId/register with auth", () => {
  var eventId = null;

  var email = "email@taken.com";
  var password = "email@taken.com";
  beforeAll(async () => {
    await loginUser(server, email, password);
    await server
      .get("/event")
      .set("Accept", "application/json")
      .then((res) => {
        eventId = res.body._id;
      });
  });

  it("PUT /event/:eventId/register -> HTTP 200", async () => {
    return server.put(`/event/${eventId}/register`).expect(200);
  });

  it("PUT /event/:eventId/register -> register successful", async () => {
    return server
      .put(`/event/${eventId}/register`)
      .then((res) => expect(res.body.success).toBe(true));
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/event/:eventId/register without auth", () => {
  var eventId = null;

  beforeAll(async () => {
    await server
      .get("/event")
      .set("Accept", "application/json")
      .then((res) => {
        eventId = res.body._id;
      });
  });

  it("PUT /event/:eventId/register -> HTTP 200", async () => {
    return server.put(`/event/${eventId}/register`).expect(401);
  });

  it("PUT /event/:eventId/register register unsuccessful", async () => {
    return server
      .put(`/event/${eventId}/register`)
      .then((res) => expect(res.body.success).toBe(false));
  });

  afterAll(async () => {
    await server.get("/user/logout");
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
