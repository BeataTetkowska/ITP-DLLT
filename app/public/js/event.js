$(function () {
  var url = window.location.pathnam;
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
  $.getJSON(url, function (res) {
    $("#location").text(res.location);
    $("#time").text(
      `${res.start.hours}:${
        res.start.minutes != 0 ? res.start.minutes : "00"
      } - ${res.end.hours}:${res.end.minutes != 0 ? res.end.minutes : "00"}`
    );
    $("#day").text(days[res.day]);
    //TODO disable register button unless event is less than 30 minutes in the future
    $register = $("#register");
    $register.removeClass("disabled");
    $register.on("click", () => registerEvent(res._id));
  });
});

//Sends data about the current event to the server to attempt to register
//the currently logged in user for the event
function registerEvent(eventId) {
  var url = `/event/${eventId}/register`;
  $.ajax({
    type: "PUT",
    url: url,
    contentType: "application/json",
  })
    .done((res) => {
      //Notify user if registration was succesful
      if (res.success === true) {
        $("#register")
          .css({ color: "green", "border-color": "green" })
          .text("Registered");
      }
      //If user is not signed in, notify user
      else {
        //TODO Navigate user to the sign in page, or request more information
        alert(res.message);
      }
    })
    .fail((res) => {
      alert(res.responseJSON.message);
    });
}
