const request = require("supertest");
const app = require("../../app/app");

describe("/event", () => {
  it("GET /event -> current event", async () => {
    return request(app)
      .get("/event")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            ts: expect.any(String),
            location: expect.any(String),
          })
        );
      });
  });
});
