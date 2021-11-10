$(function () {
  //Get JSON data about current user Parse into html data
  $.getJSON("", function (response) {
    var { email, name, postcode, dob, emergency } = response;

    $("#email").text(email);
    $("#firstName").text(name.first);
    $("#lastName").text(name.last);
    $("#dateOfBirth").text(dob);
    $("#postcode").text(postcode);
    $("#emergencyName").text(emergency.name);
    $("#phoneNumber").text(emergency.phone);
  }).fail((xhr) => {
    alert(xhr.responseText);
  });
});
