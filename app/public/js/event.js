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

  $.getJSON(url, function (data) {
    $("#location").text(data.location);
    $("#time").text(
      `${data.start.hours}:${
        data.start.minutes != 0 ? data.start.minutes : "00"
      } - ${data.end.hours}:${data.end.minutes != 0 ? data.end.minutes : "00"}`
    );
    $("#day").text(days[data.day]);
  });
});
