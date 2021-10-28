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
    hash: "$2b$10$r9W0xVvS4JxeQ7eqeK4chezPHvuRbm7FiUNpv0eAldp92eWCTU3pm",
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
    hash: "$2b$10$8tvx2PWAZTFRsvueBxXWSu9IGZ5DdynsT6fHIihGpIa7gydRhCb0W",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
  {
    _id: 3,
    isAdmin: false,
    name: {
      first: "Leonard",
      last: "Carmel",
    },
    email: "leonard.carmel@gmail.com",
    //Password matches username
    hash: "$2b$10$YVWY5p6ahUcnXU943z.WmeCJ8OwSxPlBRjxkRBymsNGVgx.C3MlKS",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
  {
    _id: 4,
    isAdmin: false,
    name: {
      first: "Fletcher",
      last: "Magdalen",
    },
    email: "fletcher.magdalen@yahoo.com",
    //Password matches username
    hash: "$2b$10$6WtgRfJaov05GmkSiUE2TeYTC.DTY3Z9iSZTfvF25pDYxNmBBVm.W",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
  {
    _id: 5,
    isAdmin: false,
    name: {
      first: "Norbert",
      last: "Devin",
    },
    email: "norbert.devin@outlook.com",
    //Password matches username
    hash: "$2b$10$GajegQ7MbiwMz8kIkpafkO/UmCcCglx456TmX..nhhAjpRnBo2l/m",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
  {
    _id: 6,
    isAdmin: false,
    name: {
      first: "Spring",
      last: "Shephard",
    },
    email: "spring.shephard@mail.com",
    //Password matches username
    hash: "$2b$10$sSzaWA5IQ1fBrcKRGexeOuSZ8HgROWwOcI6i5Y1QA.1brmdKKQpgm",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
  {
    _id: 7,
    isAdmin: false,
    name: {
      first: "Hayden",
      last: "Julius",
    },
    email: "random@email.com",
    //Password matches username
    hash: "$2b$10$OxZoVSUmprr8OD5Svozjv.iK7yfnUZTYwd.2PpaADMJckJ9JiYjI.",
    dob: "27-10-21",
    postcode: "AB106SP",
    emergency: {
      phone: "0712341234",
      name: "Emergency name",
    },
  },
  {
    _id: 8,
    isAdmin: false,
    name: {
      first: "Alva",
      last: "Nathaniel",
    },
    email: "random2@email.com",
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
