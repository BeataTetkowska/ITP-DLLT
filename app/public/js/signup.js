import validateForm from "./utils/validateForm.js";

$(function () {
  $("#signup").click((e) => handleSignup(e));
});

function handleSignup(e) {
  e.preventDefault();

  var formData = validateSignUpForm();

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

function validateSignUpForm() {
  var fields = [
    {
      selector: "#signUpName",
      id: "name",
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
  ];

  var formData = validateForm(fields);

  if (!formData.isValid) {
    return;
  }

  if (formData.confirmPassword != formData.password) {
    $("#confirmPassword").addClass("input--error");
    return;
  }

  return formData;
}
