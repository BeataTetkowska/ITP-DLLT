var scheduleId;
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
    scheduleId = data._id;
    $("#location").text(data.location);
    $("#time").text(
      `${data.start.hours}:${
        data.start.minutes != 0 ? data.start.minutes : "00"
      } - ${data.end.hours}:${data.end.minutes != 0 ? data.end.minutes : "00"}`
    );
    $("#day").text(days[data.day]);
  });

  $("#getAttendance").on("click", () => {
    var now = new Date();
    $.ajax({
      type: "POST",
      url: attendanceUrl,
      data: JSON.stringify({
        scheduleId,
        minutes: now.getMinutes(),
        hours: now.getHours(),
        date: now.getDate() +1,
        month: now.getMonth(),
        year: now.getYear(),
      }),
      dataType: "json",
      contentType: "application/json",
    })
      .done((data) => {
        if (data.result.users.length === 0) {
          return;
        }
        else {
          data.result.users.forEach(user => {
            var $table = $("#attendanceTable");
            var $row = $("<tr></tr>")

            var $tdName = $("<td></td>")
            $tdName.text(`${user.name.first} ${user.name.last}`)
            $row.append($tdName)

            $tdEmergencyName = $("<td></td>")
            $tdEmergencyName.text(user.emergency.name)
            $row.append($tdEmergencyName)

            $tdEmergencyPhone = $("<td></td>")
            $tdEmergencyPhone.text(user.emergency.phone)
            $row.append($tdEmergencyPhone)
            
            $table.append($row)
          });
        }

      })
      .fail(() => {
        //TODO handle server failure
      });
  });
});
