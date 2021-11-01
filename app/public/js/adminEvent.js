import downloadFileAsString from "./utils/downloadFileAsString.js";
var eventId;
$(async function () {
  var eventUrl = window.location.pathname;
  var attendanceUrl = "/event:/attendance";
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
  $.getJSON(eventUrl, function (res) {
    eventId = res._id;
    attendanceUrl = `/event/${eventId}/attendance`;
    $("#location").text(res.location);
    $("#time").text(
      `${res.start.hours}:${
        res.start.minutes != 0 ? res.start.minutes : "00"
      } - ${res.end.hours}:${res.end.minutes != 0 ? res.end.minutes : "00"}`
    );
    $("#day").text(days[res.day]);

    $("#getAttendance")
      .removeClass("disabled")
      .on("click", () => {
        $.ajax({
          type: "GET",
          url: attendanceUrl,
          contentType: "application/json",
        })
          .done((res) => parseAttendanceRecords(res))
          .fail(() => {
            //TODO handle server failure
          });
      });

    $("#exportAttendanceLink").on("click", () => downloadCsv(attendanceUrl));
  });
});

function downloadCsv(url) {
  var mime = "text/csv";
  $.ajax({
    url: url,
    headers: {
      //TODO Fix responses so that only status codes are sent then this can be removed
      //Accept: mime,
      Accept: `${mime}, */*`,
    },
    dataType: "json",
  })
    .done((res) => downloadFileAsString(res.fileName, res.data, mime))
    .fail((xhr) => {
      switch (xhr.status) {
        case 404:
          alert("No users registered for event");
          break;
      }
    });
  return false;
}

function parseAttendanceRecords(res) {
  if (res.users.length === 0) {
    alert("No users registered for event");
    return;
  } else {
    res.users.forEach((user) => {
      var userTableDetails = [
        `${user.name.first} ${user.name.last}`,
        user.emergency.name,
        user.emergency.phone,
      ];

      var $table = $("#attendanceTableBody");
      var $row = $("<tr></tr>");
      var $td;

      $table.empty();
      userTableDetails.forEach((detail) => {
        $td = $("<td></td>");
        $td.text(detail);
        $row.append($td);
      });

      $table.append($row);
    });
  }
}
