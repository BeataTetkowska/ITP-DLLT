var eventId;
$(async function () {
  var sessionListUrl = "/session";
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
  $.getJSON(sessionListUrl, function (res) {
    var { nextEvent: event } = res;
    eventId = event._id;
    $("#location").text(event.location);
    $("#time").text(
      `${event.start.hours}:${
        event.start.minutes != 0 ? event.start.minutes : "00"
      } - ${event.end.hours}:${
        event.end.minutes != 0 ? event.end.minutes : "00"
      }`
    );
    $("#day").text(days[event.day]);
  });
});
