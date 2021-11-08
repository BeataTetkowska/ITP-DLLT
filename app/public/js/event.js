$(function () {
  var url = window.location.pathname;
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
    var { nextEvent: event, registered } = res;
    $("#location").text(event.location);
    $("#time").text(
      `${event.start.hours}:${
        event.start.minutes != 0 ? event.start.minutes : "00"
      } - ${event.end.hours}:${
        event.end.minutes != 0 ? event.end.minutes : "00"
      }`
    );
    $("#day").text(days[event.day]);

    $register = $("#register");
    if (registered) {
      $register
        .css({ color: "green", "border-color": "green" })
        .text("Registered");
    }

    //TODO disable register button unless event is less than 30 minutes in the future
    $register.removeClass("disabled");
    $register.on("click", () => registerEvent(event._id));
  });
});

//Sends data about the current event to the server to attempt to register
//the currently logged in user for the event
function registerEvent(eventId) {
  var url = `/session/${eventId}/register`;
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
