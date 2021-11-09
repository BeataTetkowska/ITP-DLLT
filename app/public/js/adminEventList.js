import generateDateRange from "./utils/generateDateRange.js";

$(function () {
  //Upddate eventList using select value and add onChange handler to update list
  updateEventList($("#eventFilter").val());
  $("#eventFilter").on("change", (e) => updateEventList($(e.target).val()));

  //TODO implement event creation page
  $("#fab").click(() => (window.location.href = "/event/add"));
});

// GET json for the event list using the given query
function updateEventList(timeDiff) {
  var sessionListUrl = "/session/list";
  var { start, end } = generateDateRange(timeDiff);

  $.getJSON(`${sessionListUrl}?start=${start}&end=${end}`, (events) => {
    var $eventsList = $("#eventsList");
    $eventsList.empty();
    events.forEach((event) => $eventsList.append(createEventElement(event)));
  }).fail((xhr) => {
    alert(xhr.responseText);
  });
}

// JQuery functions to generate an "event" element from event data
function createEventElement(event) {
  var { _id, location, epoch } = event;
  var datetime = new Date(epoch);

  var formattedTime = datetime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  var formattedDate = datetime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  var $event = $("<div></div>").addClass("event");
  $event.click(() => (window.location.href = `/session/${_id}`));

  var $locationDiv = $("<div></div>");
  var $location = $("<h4></h4>").text(location);

  var $datetimeDiv = $("<div></div>").addClass("event__datetime");
  var $datePara = $("<p></p>").text(formattedDate);
  var $timePara = $("<p></p>").text(formattedTime);

  $locationDiv.append($location);

  $datetimeDiv.append($datePara);
  $datetimeDiv.append($timePara);

  $event.append($locationDiv);
  $event.append($datetimeDiv);

  return $event;
}
