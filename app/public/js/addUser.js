import validateForm from "./utils/validateForm.js";

$(function () {
  $("#addUser").click((e) => handleCreateUser(e));
});

//Validates form input and sends form data to server to create user
function handleCreateUser(e) {
  e.preventDefault();

  var formData = validateCreateUserForm();
  if (!formData) {
    return;
  }

  var url = "/user/signup";
  $.post({
    url: url,
    data: JSON.stringify(formData),
    contentType: "application/json",
  })
    .done(() => {
      window.location.href = "/";
    })
    .fail((xhr) => {
      alert(xhr.responseText);
    });
}

//Prepares formfield validation metadata and validates form fields
function validateCreateUserForm() {
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

  formData.gdprAccepted = $("#gdpr").is(":checked");
  formData.marketingAccepted = $("#marketing").is(":checked");

  return formData;
}
