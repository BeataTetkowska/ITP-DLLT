const request = require("supertest");
const app = require("../../app/app");

//This is an example integration test for the /event api endpoint
//The test simulates a HTTP request to /event and then tests aspects
//of the response.
//Checks for the content-type to be json
//Checks for the HTTP code to be 200
//Checks for the body in the response to consist of an object with
//a specific set of fields
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
