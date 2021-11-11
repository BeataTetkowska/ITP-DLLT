const request = require("supertest");
const app = require("../../app/app");
const server = request.agent(app);
const { getNextEvent } = require("../../app/routes/event/controllers");

const toBeWithinRange = require("../matchers/toBeWithinRange");
expect.extend(toBeWithinRange);

var eventSchedule = require("../../app/db/event");

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

async function countNumberOfEvents(start, end, numEvents) {
  start = start.getTime();
  end = end.getTime();
  var url = getSessionListUrl(start, end);

  return request(app)
    .get(url)
    .then((res) => expect(res.body.length).toEqual(numEvents));
}

const getSessionListUrl = (start, end) =>
  `/session/list?start=${start}&end=${end}`;

const removeTime = (date) =>
  new Date(date.getTime() - (date.getTime() % 86400000));

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

describe("DELETE /session/:sessionId/attendance/:userId no auth", () => {
  var eventId;
  var userId = "4d9d01cd-e1e5-4faa-9fda-84f8fcd34c47";
  beforeAll(async () => {
    eventId = getEventId();
  });

  it("-> HTTP 401", async () => {
    return request(app)
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect(401);
  });

  it("-> content HTML", async () => {
    return request(app)
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect("Content-type", /text\/html/);
  });
});

describe("DELETE /session/:sessionId/attendance/:userId: standard User", () => {
  var eventId;
  var userId = "4d9d01cd-e1e5-4faa-9fda-84f8fcd34c47";
  var email = "random@email.com";
  var password = email;

  beforeAll(async () => {
    eventId = await getEventId();
    await loginUser(server, email, password);
  });

  it("-> HTTP 403", async () => {
    return server
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect(403);
  });

  it("-> content HTML", async () => {
    return server
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => server.get("/user/logout"));
});

describe("DELETE /session/:sessionId/attendance/:userId as admin: event not found", () => {
  var eventId;
  var userId = "4d9d01cd-e1e5-4faa-9fda-84f8fcd34c47";
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(async () => {
    eventId = "Woooo";
    await loginUser(server, email, password);
  });

  it("-> HTTP 404", async () => {
    return server
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect(404);
  });

  it("-> content HTML", async () => {
    return server
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => server.get("/user/logout"));
});

describe("DELETE /session/:sessionId/attendance/:userId as admin: user not registered", () => {
  var eventId;
  var userId = "4d9d01cd-e1e5-4faa-9fda-84f8fcd34c47";
  var email = "admin@admin.admin";
  var password = email;

  beforeAll(async () => {
    eventId = await getEventId();
    await loginUser(server, email, password);
  });

  it("-> HTTP 401", async () => {
    return server
      .delete(`/session/${eventId}/attendance/${userId}`)
      .set("Accept", "application/json")
      .expect(404);
  });

  it("-> content HTML", async () => {
    return server
      .delete(`/session/${eventId}/attendance`)
      .set("Accept", "application/json")
      .expect("Content-type", /text\/html/);
  });

  afterAll(async () => server.get("/user/logout"));
});

describe("DELETE /session/:sessionId/attendance/:userId as admin: Successful deregister", () => {
  var eventId;
  var email = "admin@admin.admin";
  var password = email;

  var userIdToRegister = "e350c510-c102-40d3-b65e-e9325b2a01f9";
  var userToRegister = "random@email.com";
  var passwordToRegister = userToRegister;

  beforeAll(async () => {
    eventId = await loginAndRegisterUser(userToRegister, passwordToRegister);
    await loginUser(server, email, password);
  });

  it("-> User has registered", async () =>
    server
      .get(`/session/${eventId}/attendance`)
      .then(({ body }) => expect(body[0]._id).toEqual(userIdToRegister)));

  it("-> HTTP 200", async () =>
    server
      .delete(`/session/${eventId}/attendance/${userIdToRegister}`)
      .set("Accept", "application/json")
      .expect(200));

  it("-> Second attempt HTTP 404", async () =>
    server
      .delete(`/session/${eventId}/attendance/${userIdToRegister}`)
      .set("Accept", "application/json")
      .expect(404));

  it("-> User has deregistered", async () =>
    server.get(`/session/${eventId}/attendance`).expect(404));

  afterAll(async () => server.get("/user/logout"));
});

describe("/session/1/attendance no auth", () => {
  var eventId;
  beforeAll(async () => (eventId = await getEventId()));

  it("GET /session/1/attendance -> HTTP 401", async () =>
    server
      .get(`/session/${eventId}/attendance/`)
      .set("Accept", "application/json")
      .expect(401));

  it("GET /session/1/attendance -> content json", async () => {
    return server
      .get(`/session/${eventId}/attendance/`)
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

  it("GET /session/:eventId/attendance -> content JSON", async () =>
    server
      .get(`/session/${eventId}/attendance`)
      .expect("Content-type", /json/));

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

describe("GET /session/list: malformed query", () => {
  it("-> HTTP 400", () => {
    var start = "asdfasdf";
    var end = "asdfasdf";
    var url = getSessionListUrl(start, end);

    return request(app).get(url).expect(400);
  });

  it("-> HTTP 400", () => {
    var start = "";
    var end = "asdfasdf";
    var url = getSessionListUrl(start, end);

    return request(app).get(url).expect(400);
  });
});

describe("GET /session/list: events found", () => {
  var sundayMidnight;
  beforeEach(() => {
    sundayMidnight = removeTime(new Date());
    sundayMidnight.setDate(sundayMidnight.getDate() - sundayMidnight.getDay());
  });

  it("-> 2 Events on Tuesday", async () => {
    var tuesdayEvening = new Date(sundayMidnight);
    tuesdayEvening.setDate(tuesdayEvening.getDate() + 2);
    tuesdayEvening.setHours(21);

    return countNumberOfEvents(sundayMidnight, tuesdayEvening, 2);
  });

  it("-> 8 Events in a week", async () => {
    var sundayMidnightNextWeek = new Date(sundayMidnight);
    sundayMidnightNextWeek.setDate(sundayMidnightNextWeek.getDate() + 7);
    sundayMidnightNextWeek.setHours(21);

    return countNumberOfEvents(sundayMidnight, sundayMidnightNextWeek, 8);
  });

  it("-> 1 Event on Wednesday", async () => {
    var wednesdayMorning = new Date(sundayMidnight);
    wednesdayMorning.setDate(wednesdayMorning.getDate() + 3);
    wednesdayMorning.setHours(9);
    var wednesdayNight = new Date(wednesdayMorning);
    wednesdayNight.setHours(22);

    return countNumberOfEvents(wednesdayMorning, wednesdayNight, 1);
  });

  it("-> 2 Events on Thursday", async () => {
    var thursdayMorning = new Date(sundayMidnight);
    thursdayMorning.setDate(thursdayMorning.getDate() + 4);
    thursdayMorning.setHours(9);
    var thursdayNight = new Date(thursdayMorning);
    thursdayNight.setHours(22);

    return countNumberOfEvents(thursdayMorning, thursdayNight, 2);
  });

  it("-> 3 Events on Friday", async () => {
    var fridayMorning = new Date(sundayMidnight);
    fridayMorning.setDate(fridayMorning.getDate() + 5);
    fridayMorning.setHours(9);
    var fridayNight = new Date(fridayMorning);
    fridayNight.setHours(22);

    return countNumberOfEvents(fridayMorning, fridayNight, 3);
  });

  it("-> 5 Events on Thursday-Friday", async () => {
    var thursdayMorning = new Date(sundayMidnight);
    thursdayMorning.setDate(thursdayMorning.getDate() + 4);
    thursdayMorning.setHours(9);
    var fridayNight = new Date(thursdayMorning);
    fridayNight.setDate(fridayNight.getDate() + 1);
    fridayNight.setHours(22);

    return countNumberOfEvents(thursdayMorning, fridayNight, 5);
  });
});

describe("GET /session/list: no events found", () => {
  const expectNoEvents = (start, end) => {
    start = start.getTime();
    end = end.getTime();
    var url = getSessionListUrl(start, end);

    return request(app).get(url).expect(404);
  };

  var sundayMidnight;
  beforeEach(() => {
    sundayMidnight = removeTime(new Date());
    sundayMidnight.setDate(sundayMidnight.getDate() - sundayMidnight.getDay());
  });

  it("-> Saturday-Sunday", async () => {
    var saturdayMorning = new Date(sundayMidnight);
    saturdayMorning.setDate(saturdayMorning.getDate() + 6);
    saturdayMorning.setHours(9);
    var sundayNight = new Date(saturdayMorning);
    sundayNight.setDate(sundayNight.getDate() + 1);
    sundayNight.setHours(22);

    return expectNoEvents(saturdayMorning, sundayNight);
  });

  it("-> Tuesday morning", async () => {
    var tuesdayMorning = new Date(sundayMidnight);
    tuesdayMorning.setDate(tuesdayMorning.getDate() + 2);
    tuesdayMorning.setHours(9);

    tuesdayMidday = new Date(tuesdayMorning);
    tuesdayMidday.setHours(14);

    return expectNoEvents(tuesdayMorning, tuesdayMidday);
  });

  it("-> Matching start and end", async () => {
    return expectNoEvents(sundayMidnight, sundayMidnight);
  });
});

describe("GET /session/list: return object deatils", () => {
  var sundayMidnight;
  beforeEach(() => {
    sundayMidnight = removeTime(new Date());
    sundayMidnight.setDate(sundayMidnight.getDate() - sundayMidnight.getDay());
  });

  var eventTemplate = {
    _id: expect.any(String),
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
  };

  it("-> Response and event have the correct properties", async () => {
    var tuesdayEvening = new Date(sundayMidnight);
    tuesdayEvening.setDate(tuesdayEvening.getDate() + 2);
    tuesdayEvening.setHours(21);
    var start = sundayMidnight.getTime();
    var end = tuesdayEvening.getTime();
    var url = getSessionListUrl(start, end);

    return request(app)
      .get(url)
      .then((res) => {
        expect(res.body).toEqual(expect.arrayContaining([eventTemplate]));
      });
  });
});

describe("/session Functions", () => {
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

describe("POST /session: no auth", () => {
  var url = "/session";
  it("-> HTTP 401", () => request(app).post(url).expect(401));
  it("-> Content Type HTML", () =>
    request(app).post(url).expect("Content-type", /text/));
});

describe("POST /session: standard user", () => {
  var url = "/session";
  var email = "random@email.com";
  var password = email;

  beforeAll(() => loginUser(server, email, password));

  it("-> HTTP 403", () => server.post(url).expect(403));
  it("-> Content Type HTML", () =>
    server.post(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("POST /session: Malformed epoch", () => {
  var url = "/session";
  var email = "admin@admin.admin";
  var password = email;

  var sessionBody = {
    epochStart: "wooo",
    start: {
      hours: 1,
      minutes: 1,
    },
    end: {
      hours: 1,
      minutes: 1,
    },
    location: "test",
  };

  beforeAll(() => loginUser(server, email, password));

  it("-> HTTP 403", () => server.post(url).send(sessionBody).expect(400));
  it("-> Content Type HTML", () =>
    server.post(url).expect("Content-type", /text/));

  afterAll(() => server.get("/user/logout"));
});

describe("POST /session: Missing fields", () => {
  var url = "/session";
  var email = "admin@admin.admin";
  var password = email;

  var sessionBody = {
    epochStart: 7777777,
    start: {
      hours: 1,
      minutes: 1,
    },
    end: {
      hours: 1,
      minutes: 1,
    },
    location: "test",
  };

  var { epochStart, ...missingEpoch } = sessionBody;
  var { start, ...missingStart } = sessionBody;
  var { end, ...missingEnd } = sessionBody;
  var { location, ...missingLocation } = sessionBody;

  beforeAll(() => loginUser(server, email, password));

  it("-> Missing Epoch: 403", () =>
    server.post(url).send(missingEpoch).expect(400));
  it("-> Missing Start: 403", () =>
    server.post(url).send(missingStart).expect(400));
  it("-> Missing End: 403", () =>
    server.post(url).send(missingEnd).expect(400));
  it("-> Missing Location: 403", () =>
    server.post(url).send(missingLocation).expect(400));

  afterAll(() => server.get("/user/logout"));
});

describe("POST /session: Session created but not added to schedule", () => {
  var url = "/session";
  var email = "admin@admin.admin";
  var password = email;

  var sessionBody = {
    epochStart: 1636579019187,
    start: {
      hours: 1,
      minutes: 1,
    },
    end: {
      hours: 1,
      minutes: 1,
    },
    location: "jlklklklklklklklklklklklkl",
  };

  beforeAll(() => loginUser(server, email, password));

  it("-> HTTP 200", () => server.post(url).send(sessionBody).expect(200));

  it("-> Session not in event schedule", () =>
    expect(
      eventSchedule.findIndex(
        (event) => event.location === sessionBody.location
      ) > 0
    ).toBe(false));

  afterAll(() => server.get("/user/logout"));
});

describe("POST /session: Session created and added to schedule", () => {
  var url = "/session?addToSchedule=true";
  var email = "admin@admin.admin";
  var password = email;

  var sessionBody = {
    epochStart: 1636579019187,
    start: {
      hours: 1,
      minutes: 1,
    },
    end: {
      hours: 1,
      minutes: 1,
    },
    location: "fasdfasdfasdfasdfasfasdfasdf",
  };

  beforeAll(() => loginUser(server, email, password));

  it("-> HTTP 200", () => server.post(url).send(sessionBody).expect(200));

  it("-> Session is in event schedule", () =>
    expect(
      eventSchedule.findIndex(
        (event) => event.location === sessionBody.location
      ) > 0
    ).toBe(true));

  afterAll(() => server.get("/user/logout"));
});

//TODO check for session being added to uniqueSessions collection
