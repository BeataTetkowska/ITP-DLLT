const request = require("supertest");
const app = require("../../app/app");

describe("/signup", () => {
  it("GET /signup -> signup page html", async () => {
    return request(app)
      .get("/signup")
      .expect("Content-type", /text\/html/)
      .expect(200);
  });

  it("POST /signup -> send user data and create user", async () => {
    var email = "test@example.com";
    return request(app)
      .post("/signup")
      .send({
        email: email,
        pass: "password",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            name: expect.objectContaining({
              first: expect.any(String),
              last: expect.any(String),
            }),
            email: expect(email),
            result: expect.objectContaining({
              success: expect(true),
              message: expect.any(String),
            }),
          })
        );
      });
  });
});
