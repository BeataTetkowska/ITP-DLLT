const request = require("supertest");
const app = require("../../app/app");
const server = request.agent(app);
const { getNextEvent } = require("../../app/routes/event/controllers");

const toBeWithinRange = require("../matchers/toBeWithinRange");
expect.extend(toBeWithinRange);

const loginUser = require("../utils/loginUser");

async function loginAndRegisterUser(email, password) {
  var eventId = null;
  eventId = await getEventId();
  await loginUser(server, email, password);
  await server.put(`/session/${eventId}/register`);
  await server.get("/user/logout");
  return eventId;
}

async function getEventId() {
  var eventId;
  await server
    .get("/session")
    .set("Accept", "application/json")
    .then((data) => {
      eventId = data.body.event._id;
    });
  return eventId;
}

//This is an example integration test for the /api/event api endpoint
//The test simulates a HTTP request to /api/session and then tests aspects
//of the response.
//Checks for the content-type to be json
//Checks for the HTTP code to be 200
//Checks for the body in the response to consist of an object with
//a specific set of fields
describe("/session no auth", () => {
  it("GET /session html -> HTTP 200", async () => {
    return request(app).get("/session").expect(200);
  });

  it("GET /session html -> Content Type HTML", async () => {
    return request(app)
      .get("/session")
      .expect("Content-type", /text\/html/);
  });

  it("GET /session json -> HTTP 200", async () => {
    return request(app)
      .get("/session")
      .set("Accept", "application/json")
      .expect(200);
  });

  it("GET /session json -> Content Type JSON", async () => {
    return request(app)
      .get("/session")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
  });

  it("GET /session json -> event fields", async () => {
    return request(app)
      .get("/session")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.event).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            attendance: expect.any(Array),
            date: expect.any(Number),
            month: expect.any(Number),
            year: expect.any(Number),
            isoString: expect.any(String),
            epoch: expect.any(Number),
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

  it("GET /session json -> attendance array empty", async () => {
    return request(app)
      .get("/session")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.event.attendance.length).toBe(0);
      });
  });
});

describe("/session as standard user", () => {
  var adminEmail = "email@taken.com";
  var adminPassword = "email@taken.com";

  beforeAll(async () => {
    await server.post("/user/login").send({
      email: adminEmail,
      password: adminPassword,
    });
  });

  it("GET /session -> HTTP 200", async () => {
    return server.get("/session").expect(200);
  });

  it("GET /session -> Content Type HTML", async () => {
    return server.get("/session").expect("Content-type", /text\/html/);
  });

  it("GET /session json -> HTTP 200", async () => {
    return server.get("/session").set("Aceept", "application/json").expect(200);
  });

  it("GET /session json -> Content Type JSON", async () => {
    return server
      .get("/session")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
  });

  it("GET /session json -> event fields", async () => {
    return server
      .get("/session")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.event).toEqual(
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

  it("GET /session json -> attendance not null", async () => {
    return server
      .get("/session")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.event.attendance).toHaveLength(0);
      });
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session as admin", () => {
  var adminEmail = "admin@admin.admin";
  var adminPassword = "admin@admin.admin";

  beforeAll(async () => {
    await server.post("/user/login").send({
      email: adminEmail,
      password: adminPassword,
    });
  });

  it("GET /session -> HTTP 200", async () => {
    return server.get("/session").expect(200);
  });

  it("GET /session -> Content Type HTML", async () => {
    return server.get("/session").expect("Content-type", /text\/html/);
  });

  it("GET /session json -> HTTP 200", async () => {
    return server.get("/session").set("Aceept", "application/json").expect(200);
  });

  it("GET /session json -> Content Type JSON", async () => {
    return server
      .get("/session")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
  });

  it("GET /session json -> event fields", async () => {
    return server
      .get("/session")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.event).toEqual(
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

  it("GET /session json -> attendance not null", async () => {
    return server
      .get("/session")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.body.event.attendance).not.toEqual(null);
      });
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session/1/attendance no auth", () => {
  var eventId;
  beforeAll(async () => {
    eventId = getEventId();
  });

  it("GET /session/1/attendance -> HTTP 401", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .set("Accept", "application/json")
      .expect(401);
  });

  it("GET /session/1/attendance -> content json", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .set("Accept", "application/json")
      .expect("Content-type", /text\/html/);
  });
});

describe("/session/1/attendance standard user", () => {
  var email = "email@taken.com";
  var password = "email@taken.com";
  var eventId;

  beforeAll(async () => {
    eventId = await getEventId();
    await loginUser(server, email, password);
  });

  it("GET /session/1/attendance -> HTTP 403", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .set("Accept", "application/json")
      .expect(403);
  });

  it("GET /session/1/attendance -> content json", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .set("Accept", "application/json")
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session/:eventId/attendance no registered users", () => {
  var eventId = null;

  var email = "admin@admin.admin";
  var password = "admin@admin.admin";

  beforeAll(async () => {
    await loginUser(server, email, password);
    eventId = await getEventId();
  });

  it("GET /session/:eventId/attendance -> HTTP 200", async () => {
    return server.get(`/session/${eventId}/attendance`).expect(404);
  });

  it("GET /session/:eventId/attendance -> content json", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session/:eventId/attendance one user", () => {
  var eventId = null;

  var email = "admin@admin.admin";
  var password = "admin@admin.admin";

  beforeAll(async () => {
    eventId = await loginAndRegisterUser(email, password);
    await loginUser(server, email, password);
  });

  it("GET /session/:eventId/attendance -> length 1", async () => {
    return server.get(`/session/${eventId}/attendance`).then((res) => {
      expect(res.body).toHaveLength(1);
    });
  });

  it("GET /session/:eventId/attendance -> HTTP 200", async () => {
    return server.get(`/session/${eventId}/attendance`).expect(200);
  });

  it("GET /session/:eventId/attendance -> content JSON", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .expect("Content-type", /json/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session/:eventId/attendance 3 users", () => {
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

  it("GET /session/:eventId/attendance -> length 3", async () => {
    return server.get(`/session/${eventId}/attendance`).then((res) => {
      expect(res.body).toHaveLength(3);
    });
  });

  it("GET /session/:eventId/attendance -> HTTP 200", async () => {
    return server.get(`/session/${eventId}/attendance`).expect(200);
  });

  it("GET /session/:eventId/attendance -> content HTML", async () => {
    return server
      .get(`/session/${eventId}/attendance`)
      .expect("Content-type", /json/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session/:eventId/register with auth", () => {
  var eventId;

  var email = "email@taken.com";
  var password = "email@taken.com";
  beforeAll(async () => {
    await loginUser(server, email, password);
    eventId = await getEventId();
  });

  it("PUT /session/:eventId/register -> HTTP 200", async () => {
    return server.put(`/session/${eventId}/register`).expect(200);
  });

  it("PUT /session/:eventId/register -> content HTML", async () => {
    return server
      .put(`/session/${eventId}/register`)
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session/:eventId/register without auth", () => {
  var eventId = null;

  beforeAll(async () => {
    eventId = await getEventId();
  });

  it("PUT /session/:eventId/register -> HTTP 401", async () => {
    return server.put(`/session/${eventId}/register`).expect(401);
  });

  it("PUT /session/:eventId/register -> content HTML", async () => {
    return server
      .put(`/session/${eventId}/register`)
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => {
    await server.get("/user/logout");
  });
});

describe("/session Functions", () => {
  const removeTime = (date) =>
    new Date(date.getTime() - (date.getTime() % 86400000));

  var sundayMidnight;
  beforeEach(() => {
    sundayMidnight = removeTime(new Date());
    sundayMidnight.setDate(sundayMidnight.getDate() - sundayMidnight.getDay());
  });

  //GetNextEvent
  it("getNextEvent Sunday Night", () => {
    var result = getNextEvent(sundayMidnight);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEvent Monday Morning", () => {
    var mondayMorning = sundayMidnight;
    mondayMorning.setDate(mondayMorning.getDate() + 1);
    mondayMorning.setHours(9);

    var result = getNextEvent(mondayMorning);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEvent Tuesday Morning", () => {
    var tuesdayMorning = sundayMidnight;
    tuesdayMorning.setDate(tuesdayMorning.getDate() + 2);
    tuesdayMorning.setHours(9);

    var result = getNextEvent(tuesdayMorning);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(18);
    expect(result.end.hours).toBe(19);
  });

  it("getNextEvent Tuesday evening", () => {
    var tuesdayEvening = sundayMidnight;
    tuesdayEvening.setDate(tuesdayEvening.getDate() + 2);
    tuesdayEvening.setHours(19);

    var result = getNextEvent(tuesdayEvening);
    expect(result.day).toBe(2);
    expect(result.start.hours).toBe(19);
    expect(result.end.hours).toBe(21);
  });

  it("getNextEvent Tuesday night", () => {
    var tuesdayNight = sundayMidnight;
    tuesdayNight.setDate(tuesdayNight.getDate() + 2);
    tuesdayNight.setHours(23);

    var result = getNextEvent(tuesdayNight);
    expect(result.day).toBe(3);
    expect(result.start.hours).toBe(16);
    expect(result.end.hours).toBe(17);
  });
});
