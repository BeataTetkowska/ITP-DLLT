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

  var url = "/signup";
  $.post({
    type: "POST",
    url: url,
    data: formData,
    dataType: "json",
  })
    .done((response) => {
      //Redirect to event page if user created
      if (response.result.success === true) {
        window.location.href = "/event";
      }
      //If email is taken, notify user
      else {
        alert("Email address is taken");
        $("#email").addClass("input--error");
      }
    })
    .fail(() => {
      //TODO handle server failure
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
      selector:"#dateofBirth",
      id: "#dateofBirth",
    },
    {
      selector: "#postcode",
      id: "#postcode",
    },
    {
      selector: "#emergencyname",
      id:  "#emergencyname",
    },
    {
      selector: "#phonenumber",
      id: "#phonenumber",
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
