import validateForm from "./utils/validateForm.js";

$(function () {
  $("#createSession").click((e) => createSession(e));
});

//Validates form input and sends form data to server to create user
function createSession(e) {
  e.preventDefault();

  var formData = validateCreateSessionForm();
  if (!formData) {
    return;
  }

  var url = "/session";
  if ($("#addToSchedule").is(":checked")) url = url + "?addToSchedule=true";

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
      $("#email").addClass("input--error");
    });
}

//Prepares formfield validation metadata and validates form fields
function validateCreateSessionForm() {
  var fields = [
    {
      selector: "#location",
      id: "location",
    },
    {
      selector: "#date",
      id: "date",
    },
    {
      selector: "#start",
      id: "start",
    },
    {
      selector: "#end",
      id: "end",
    },
  ];

  var formData = validateForm(fields);

  if (!formData.isValid) {
    return false;
  }

  var start = formData.start.split(":");
  formData.start = {
    hours: parseInt(start[0]),
    minutes: parseInt(start[1]),
  };

  var end = formData.end.split(":");
  formData.end = {
    hours: parseInt(end[0]),
    minutes: parseInt(end[1]),
  };

  var startTime = new Date(formData.date);
  startTime.setHours(formData.start.hours);
  startTime.setMinutes(formData.start.minutes);
  formData.epochStart = startTime.getTime();

  return formData;
}
