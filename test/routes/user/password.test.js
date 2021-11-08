const request = require("supertest");
const app = require("../../../app/app");
const bcrypt = require("bcrypt");
const { sendTextEmail } = require("../../../app/utils/sendEmail");
var users = require("../../../app/db/users");

jest.mock("../../../app/utils/sendEmail", () => {
  const sendEmail = jest.requireActual("../../../app/utils/sendEmail");
  return {
    __esModule: true,
    ...sendEmail,
    sendTextEmail: jest.fn(),
  };
});

var resetToken;
describe("GET /user/password", () => {
  var url = "/user/password";
  it("-> HTTP 200", () => request(app).get(url).expect(200));

  it("-> Content HTML", () =>
    request(app).get(url).expect("Content-Type", /text/));
});

describe("POST /user/password -- Matching Email", () => {
  var url = "/user/password";
  var email = "admin@admin.admin";
  var user = users.find((user) => user.email === email);
  var now = new Date();
  var in30 = new Date().setTime(new Date().getTime() + 31);

  it("-> No token hash in db", () =>
    expect(user.resetTokenHash).toBe(undefined));

  it("-> Updating tokenHash HTTP 200", () =>
    request(app).post(url).send({ email }).expect(200));

  it("-> Content Text", () =>
    request(app).post(url).send({ email }).expect("Content-Type", /text/));

  it("-> Token hash in db is string", () =>
    expect(typeof user.resetTokenHash).toBe("string"));

  it("-> Token hash is correct", async () => {
    let calls = sendTextEmail.mock.calls;
    resetToken = calls[calls.length - 1][1]
      .split("?")[1]
      .split("&")[0]
      .split("=")[1];
    expect(await bcrypt.compare(resetToken, user.resetTokenHash)).toBe(true);
  });

  it("-> Token not expired", () =>
    expect(user.resetTokenExpires > now).toBe(true));

  it("-> Token expires in <31 minutes", () =>
    expect(user.resetTokenExpires > in30).toBe(true));

  afterAll(() => jest.clearAllMocks());
});

describe("POST /user/password -- User not found", () => {
  var url = "/user/password";
  var email = "llllll@llllllll.com";
  it("-> HTTP 200", () => request(app).post(url).send({ email }).expect(200));

  it("-> Content Text", () =>
    request(app).post(url).send({ email }).expect("Content-Type", /text/));

  it("-> Email not sent", () => expect(sendTextEmail).not.toHaveBeenCalled());
});

describe(`GET /user/password/reset`, () => {
  var url = "/user/password/reset";
  it("-> HTTP 200", () => request(app).get(url).expect(200));

  it("-> Content HTML", () =>
    request(app).get(url).expect("Content-type", /text/));
});

describe("PUT /user/password/reset successful reset", () => {
  var url = "/user/password/reset";
  var email = "admin@admin.admin";
  var newPassword = "newPassword";
  var putRequest;

  beforeAll(async () => {
    await request(app).post("/user/password").send({ email });
    let calls = sendTextEmail.mock.calls;
    resetToken = calls[calls.length - 1][1]
      .split("?")[1]
      .split("&")[0]
      .split("=")[1];
    putRequest = { email, token: resetToken, password: newPassword };
  });

  it("-> HTTP 200", () => request(app).put(url).send(putRequest).expect(200));

  it("-> Content HTML", () =>
    request(app).put(url).send(putRequest).expect("Content-type", /text/));

  it("-> Login with new password HTTP 200", () =>
    request(app)
      .post("/user/login")
      .send({ email, password: newPassword })
      .expect(200));
});

describe("PUT /user/password/reset Email not matching", () => {
  var url = "/user/password/reset";
  var email = "lllllll@lllllllll.com";
  var token = "";
  var password = "";
  var putRequest = { email, token, password };

  it("-> HTTP 200", () => request(app).put(url).send(putRequest).expect(200));

  it("-> Content HTML", () =>
    request(app).put(url).send(putRequest).expect("Content-type", /text/));
});

describe("PUT /user/password/reset Reset not initiated", () => {
  var url = "/user/password/reset";
  var email = "email@taken.com";
  var token = "";
  var password = "";
  var putRequest = { email, token, password };

  it("-> HTTP 403", () => request(app).put(url).send(putRequest).expect(403));

  it("-> Reset not initiated", () =>
    request(app)
      .put(url)
      .send(putRequest)
      .then((res) => expect(res.text).toBe("Password reset not initiated")));

  it("-> Content HTML", () =>
    request(app).put(url).send(putRequest).expect("Content-type", /text/));
});

describe("PUT /user/password/reset Token Not Matching", () => {
  var url = "/user/password/reset";
  var email = "admin@admin.admin";
  var newPassword = "newPassword";
  resetToken = "wrongToken";
  var putRequest = { token: resetToken, email, password: newPassword };

  it("-> HTTP 403", () => request(app).put(url).send(putRequest).expect(403));

  it("-> Reset not initiated", () =>
    request(app)
      .put(url)
      .send(putRequest)
      .then((res) => expect(res.text).toBe("Reset token is incorrect")));

  it("-> Content HTML", () =>
    request(app).put(url).send(putRequest).expect("Content-type", /text/));
});
