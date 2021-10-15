const request = require("supertest");
const app = require("../../app/app");

const toBeTrue = require("../matchers/toBeTrue");
const toBeFalse = require("../matchers/toBeFalse");
expect.extend(toBeTrue);
expect.extend(toBeFalse);

describe("/signup", () => {
  it("GET /signup -> signup page html", async () => {
    return request(app)
      .get("/signup")
      .expect("Content-type", /text\/html/)
      .expect(200);
  });

  var email = "test@example.com";

  it("POST /signup -> create user", async () => {
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
      .expect(201)
      .expect("Content-Type", /json/)
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

  it("POST /signup -> Attempt to create user with duplicate email", async () => {
    var email = "test@example.com";
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
      .expect(201)
      .expect("Content-Type", /json/)
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
