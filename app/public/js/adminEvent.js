var eventId;
$(function () {
  var eventUrl = "/api/event";
  var attendanceUrl = "/api/admin/event/attendance";
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
  $.getJSON(eventUrl, function (data) {
    eventId = data._id;
    $("#location").text(data.location);
    $("#time").text(
      `${data.start.hours}:${
        data.start.minutes != 0 ? data.start.minutes : "00"
      } - ${data.end.hours}:${data.end.minutes != 0 ? data.end.minutes : "00"}`
    );
    $("#day").text(days[data.day]);
  });

  $("#getAttendance").on("click", () => {
    $.ajax({
      type: "POST",
      url: attendanceUrl,
      data: JSON.stringify({
        eventId,
      }),
      dataType: "json",
      contentType: "application/json",
    })
      .done((data) => {
        if (data.result.users.length === 0) {
          return;
        } else {
          data.result.users.forEach((user) => {
            var userTableDetails = [
              `${user.name.first} ${user.name.last}`,
              user.emergency.name,
              user.emergency.phone,
            ];

            var $table = $("#attendanceTableBody");
            var $row = $("<tr></tr>");
            var $td;

            userTableDetails.forEach((detail) => {
              $td = $("<td></td>");
              $td.text(detail);
              $row.append($td);
            });

            $table.append($row);
          });
        }
      })
      .fail(() => {
        //TODO handle server failure
      });
  });
});
