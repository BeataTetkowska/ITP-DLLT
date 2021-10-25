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
    //Password matches email
    hash: "$2b$10$.SVUqjvFqedVuqVjl4eeNORvlOkkaiWqM4WjlZxmPsJPq9zTImfOK",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
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
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
];
