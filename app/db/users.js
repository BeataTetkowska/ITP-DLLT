//Example users table in database
module.exports = [
  {
    _id: 1,
    isAdmin: false,
    name: {
      first: "email",
      last: "taken",
    },
    email: "email@taken.com",
    hash: "$2b$10$.SVUqjvFqedVuqVjl4eeNORvlOkkaiWqM4WjlZxmPsJPq9zTImfOK",
  },
  {
    _id: 2,
    isAdmin: true,
    name: {
      first: "admin",
      last: "user",
    },
    email: "admin@admin.admin",
    //Password matches username
    hash: "$2b$10$4F.QKuB6GcbxySsJiV6HQ.64v0ecQLYOOnedmbVWOBQOtPgapOSdG",
  },
];
