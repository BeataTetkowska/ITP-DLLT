const request = require("supertest");
const app = require("../../../app/app");

//This is an example integration test for the /api/event api endpoint
//The test simulates a HTTP request to /api/event and then tests aspects
//of the response.
//Checks for the content-type to be json
//Checks for the HTTP code to be 200
//Checks for the body in the response to consist of an object with
//a specific set of fields
describe("/user/login", () => {
  var email = "logintest1@test.com";
  var password = "password";
  var badEmail = "bad@email.com";
  var badPassword = "badPassword";

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

  it("GET /login -> HTTP 200", async () => {
    return request(app).get("/user/login").expect(200);
  });

  it("GET /login -> Content Type HTML", async () => {
    return request(app)
      .get("/user/login")
      .expect("Content-type", /text\/html/);
  });

  it("POST /login -> correct credentials HTTP 200", async () => {
    return request(app)
      .post("/user/login")
      .send({
        email: email,
        password: password,
      })
      .expect(200);
  });

  it("POST /login -> correct credentials content HTML", async () => {
    return request(app)
      .post("/user/login")
      .send({
        email: email,
        password: password,
      })
      .expect("Content-Type", /text\/html/);
  });

  it("POST /login -> incorrect credentials HTTP 401", async () => {
    return request(app)
      .post("/user/login")
      .send({
        email: badEmail,
        password: badPassword,
      })
      .expect(401);
  });

  it("POST /login -> incorrect credentials content HTML", async () => {
    return request(app)
      .post("/user/login")
      .send({
        email: badEmail,
        password: badPassword,
      })
      .expect("Content-Type", /text\/html/);
  });
});
