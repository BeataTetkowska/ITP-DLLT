import validateForm from "./utils/validateForm.js";

$(function () {
  $("#signup").click((e) => handleSignup(e));
});

//Validates form input and sends form data to server to create user
function handleSignup(e) {
  e.preventDefault();

  var formData = validateSignUpForm();
  if (!formData) {
    return;
  }

  var url = "/user/signup";
  $.post({
    url: url,
    data: formData,
  })
    .done(() => {
      window.location.href = "/event";
    })
    .fail((xhr) => {
      alert(xhr.responseText);
      $("#email").addClass("input--error");
    });
}

//Prepares formfield validation metadata and validates form fields
function validateSignUpForm() {
  var fields = [
    {
      selector: "#firstName",
      id: "firstName",
    },
    {
      selector: "#lastName",
      id: "lastName",
    },
    {
      selector: "#email",
      id: "email",
      re: true,
      reString: /^\S+@\S+\.\S+$/,
    },
    {
      selector: "#password",
      id: "password",
    },
    {
      selector: "#confirmPassword",
      id: "confirmPassword",
    },
    {
      selector: "#dateOfBirth",
      id: "dateOfBirth",
    },
    {
      selector: "#postcode",
      id: "postcode",
    },
    {
      selector: "#emergencyName",
      id: "emergencyName",
    },
    {
      selector: "#phoneNumber",
      id: "phoneNumber",
    },
  ];

  var formData = validateForm(fields);

  if (!formData.isValid) {
    return false;
  }

  if (formData.confirmPassword != formData.password) {
    $("#confirmPassword").addClass("input--error");
    return false;
  }

  return formData;
}
