var eventId;
$(function () {
  var url = "/api/event";
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  //Get JSON data about the currently on event
  //Parse data into html
  $.getJSON(url, function (data) {
    eventId = data._id;
    $("#location").text(data.location);
    $("#time").text(
      `${data.start.hours}:${
        data.start.minutes != 0 ? data.start.minutes : "00"
      } - ${data.end.hours}:${data.end.minutes != 0 ? data.end.minutes : "00"}`
    );
    $("#day").text(days[data.day]);
    //TODO disable register button unless event is less than 30 minutes in the future
  });

  $("#register").on("click", registerEvent);
});

//Sends data about the current event to the server to attempt to register
//the currently logged in user for the event
function registerEvent() {
  var url = "/api/event/register";
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({
      eventId,
    }),
    dataType: "json",
    contentType: "application/json",
  })
    .done((response) => {
      //Notify user if registration was succesful
      if (response.result.success === true) {
        $("#register")
          .css({ color: "green", "border-color": "green" })
          .text("Registered");
      }
      //If user is not signed in, notify user
      else {
        //TODO Navigate user to the sign in page, or request more information
        alert(response.result.message);
      }
    })
    .fail(() => {
      //TODO handle server failure
    });
}
