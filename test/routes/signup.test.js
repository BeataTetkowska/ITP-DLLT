const request = require("supertest");
const app = require("../../app/app");

const toBeTrue = require("../matchers/toBeTrue");
const toBeFalse = require("../matchers/toBeFalse");
expect.extend(toBeTrue);
expect.extend(toBeFalse);

describe("/signup", () => {
  it("GET /signup -> HTTP 200", async () => {
    return request(app).get("/signup").expect(200);
  });

  it("GET /signup -> Content Type HTML", async () => {
    return request(app)
      .get("/signup")
      .expect("Content-type", /text\/html/);
  });

  it("POST /signup -> Create user HTTP 201", async () => {
    return request(app)
      .post("/signup")
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

  it("POST /signup -> Create User - Content Type JSON", async () => {
    return request(app)
      .post("/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: `${Math.round(Math.random() * 1000)}@test.com`,
        password: "password",
      })
      .expect("Content-Type", /json/);
  });

  var email = "test@example.com";

  it("POST /signup -> create user response check", async () => {
    return request(app)
      .post("/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: "password",
      })
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            email: expect.stringMatching(email),
            result: expect.objectContaining({
              success: expect.toBeTrue(),
            }),
          })
        );
      });
  });

  it("POST /signup -> Duplicate email HTTP 201", async () => {
    return (
      request(app)
        .post("/signup")
        .send({
          name: {
            first: "test",
            last: "example",
          },
          email: email,
          password: "password",
        })
        //TODO should change to 409
        .expect(201)
    );
  });

  it("POST /signup -> Duplicate email content type JSON ", async () => {
    return request(app)
      .post("/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: "password",
      })
      .expect("Content-Type", /json/);
  });

  it("POST /signup -> Duplicate email Response check", async () => {
    return request(app)
      .post("/signup")
      .send({
        name: {
          first: "test",
          last: "example",
        },
        email: email,
        password: "password",
      })
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            email: expect.stringMatching(email),
            result: expect.objectContaining({
              success: expect.toBeFalse(),
            }),
          })
        );
      });
  });
});
