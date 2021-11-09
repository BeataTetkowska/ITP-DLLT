import generateDateRange from "./utils/generateDateRange";

$(async function () {
  //Upddate eventList using select value and add onChange handler to update list
  updateEventList($("#eventFilter").val());
  $("#eventFilter").on("change", (e) => updateEventList($(e.target).val()));

  //TODO implement event creation page
  $("#fab").click(() => (window.location.href = "/event/create"));
});

// GET json for the event list using the given query
function updateEventList(timeDiff) {
  var sessionListUrl = "/session/list";
  var { start, end } = generateDateRange(timeDiff);

  $.getJSON(`${sessionListUrl}?start=${start}&end=${end}`, (events) => {
    var $eventsList = $("#eventsList");
    $eventsList.empty();
    events.forEach((event) => $eventsList.append(createEventElement(event)));
  });
}

// JQuery functions to generate an "event" element from event data
// TODO find a better way to format the date (long format) and the time
function createEventElement(event) {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var $event = $("<div></div>").addClass("event");
  $event.data("eventId", event._id);

  var $locationDiv = $("<div></div>");
  var $location = $("<h4></h4>").text(event.location);

  var formattedTime = `${event.start.hours}:${
    event.start.minutes != 0 ? event.start.minutes : "00"
  } - ${event.end.hours}:${event.end.minutes != 0 ? event.end.minutes : "00"}`;
  var $datetimeDiv = $("<div></div>").addClass("event__datetime");
  var $datePara = $("<p></p>").text(days[event.day]);
  var $timePara = $("<p></p>").text(formattedTime);

  $locationDiv.append($location);

  $datetimeDiv.append($datePara);
  $datetimeDiv.append($timePara);

  $event.append($locationDiv);
  $event.append($datetimeDiv);

  return $event;
}
