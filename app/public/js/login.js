import validateForm from "./utils/validateForm.js";

$(function () {
  $("#login").click((e) => handleSignup(e));
});

//Validates form input and sends form data to server to create user
function handleSignup(e) {
  e.preventDefault();

  var formData = validateLoginForm();
  if (!formData) {
    return;
  }

  var url = "/login";
  $.post({
    type: "POST",
    url: url,
    data: formData,
    dataType: "json",
  })
    .done((response) => {
      //Redirect to event page if user logged in
      if (response.result.success === true) {
        if (response.result.isAdmin) {
          window.location.href = "/admin/event";
        } else {
          window.location.href = "/event";
        }
      } else {
        alert("Credentials are invalid");
        $("#email").addClass("input--error");
        $("#password").val("");
      }
    })
    .fail(() => {
      //TODO handle server failure
    });
}

//Prepares formfield validation metadata and validates form fields
function validateLoginForm() {
  var fields = [
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
  ];

  var formData = validateForm(fields);

  if (!formData.isValid) {
    return false;
  }

  return formData;
}
