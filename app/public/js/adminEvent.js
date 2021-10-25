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
        date: now.getDate(),
        month: now.getMonth(),
        year: now.getYear(),
      }),
      dataType: "json",
      contentType: "application/json",
    })
      .done((data) => {
        $data = $("<pre></pre>").text(JSON.stringify(data, null, 2));
        $("div.content").append($data);
        //TODO parse this data and display as table
      })
      .fail(() => {
        //TODO handle server failure
      });
  });
});
