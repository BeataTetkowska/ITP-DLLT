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

  var url = "/user/login";
  $.post({
    url: url,
    data: formData,
  })
    //Redirect to session page if user logged in
    .done(() => (window.location.href = "/session"))
    .fail((xhr) => {
      alert(xhr.responseText);
      $("#email").addClass("input--error");
      $("#password").val("");
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
