const request = require("supertest");
const app = require("../../app/app");

const toBeWithinRange = require("../matchers/toBeWithinRange");
expect.extend(toBeWithinRange);

//This is an example integration test for the /api/event api endpoint
//The test simulates a HTTP request to /api/event and then tests aspects
//of the response.
//Checks for the content-type to be json
//Checks for the HTTP code to be 200
//Checks for the body in the response to consist of an object with
//a specific set of fields
describe("/event", () => {
  it("GET /event -> event page html", async () => {
    return request(app)
      .get("/event")
      .expect("Content-type", /text\/html/)
      .expect(200);
  });

  it("GET /api/event -> current event json", async () => {
    return request(app)
      .get("/api/event")
      .expect("Content-Type", /json/)
      .expect(200)
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
