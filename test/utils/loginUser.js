module.exports = async (server, email, password) => {
  return await server.post("/user/login").send({ email, password });
};
