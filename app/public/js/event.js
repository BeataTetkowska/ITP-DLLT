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
  })
    .done(() => {
      //Notify user if registration was succesful
      $("#register")
        .css({ color: "green", "border-color": "green" })
        .text("Registered");
    })
    .fail((xhr) => {
      alert(xhr.responseText);
    });
}
