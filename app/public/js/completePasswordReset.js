import validateForm from "./utils/validateForm.js";

var resetToken;
const resetTokenUrlParam = "resetToken";
var email;
const emailUrlParam = "email";

$(function () {
  $("#reset").click((e) => handleReset(e));

  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has(resetTokenUrlParam) && urlParams.has(emailUrlParam)) {
    resetToken = urlParams.get(resetTokenUrlParam);
    email = urlParams.get(emailUrlParam);
  } else {
    alert("Please follow link in email to reset password");
    $("#reset").addClass("disabled").off("click");
  }
});

//Validates form input and sends form data to server to reset password
function handleReset(e) {
  e.preventDefault();

  var formData = validateLoginForm();
  if (!formData) {
    return;
  }

  var url = "/user/password/reset";
  $.post({
    type: "PUT",
    url: url,
    data: formData,
    dataType: "json",
  })
    .done((res) => {
      //Redirect to login page if reset completed successfully
      if (res.success === true) {
        window.location.href = "/user/login";
      } else {
        alert("Failed to reset password, please initiate password reset again");
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
      selector: "#password",
      id: "password",
    },
    {
      selector: "#passwordConfirm",
      id: "passwordConfirm",
    },
  ];

  var formData = validateForm(fields);

  if (!formData.isValid) {
    return false;
  }

  if (formData.password !== formData.passwordConfirm) {
    $("#passwordConfirm").addClass("input--error");
    return false;
  }
  formData.token = resetToken;
  formData.email = email;

  return formData;
}
