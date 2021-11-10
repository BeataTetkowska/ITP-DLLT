import validateForm from "./utils/validateForm.js";

$(function () {
  $("#submit").click((e) => handleSubmit(e));

  $("#delete").click(deleteUser);

  //Get JSON data about current user Parse into html data
  $.getJSON("", function (response) {
    var { email, name, postcode, dob, emergency } = response;

    $("#email").val(email);
    $("#firstName").val(name.first);
    $("#lastName").val(name.last);
    $("#dateOfBirth").val(dob);
    $("#postcode").val(postcode);
    $("#emergencyName").val(emergency.name);
    $("#phoneNumber").val(emergency.phone);
  });
});

function deleteUser() {
  $.ajax({
    type: "DELETE",
  })
    .done((res) => {
      alert(res);
      window.location.href = "/session";
    })
    .fail((xhr) => {
      alert(xhr.responseText);
    });
}

//Validates form input and sends form data to server to edit user
function handleSubmit(e) {
  e.preventDefault();

  var formData = validateSubmitForm();
  if (!formData) {
    return;
  }

  var url = "/user";
  $.ajax({
    type: "PATCH",
    url: url,
    data: formData,
  })
    .done(() => {
      alert("Update successful");
    })
    .fail((xhr) => {
      alert(xhr.responseText);
    });
}

//Prepares formfield validation metadata and validates form fields
function validateSubmitForm() {
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

  formData = {
    name: {
      first: formData.firstName,
      last: formData.lastName,
    },
    email: formData.email,
    dob: formData.dateOfBirth,
    postcode: formData.postcode,
    emergency: {
      phone: formData.phoneNumber,
      name: formData.emergencyName,
    },
  };

  return formData;
}
