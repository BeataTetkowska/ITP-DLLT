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
    var attendanceDownloadUrl = `/event/${eventId}/attendance?download=true`;
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

    $("#exportAttendanceLink").attr("href", attendanceDownloadUrl);
  });
});

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
