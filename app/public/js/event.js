var scheduleId;
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

  //Get JSON data about the currently on event 
  //Parse data into html
  $.getJSON(url, function (data) {
    scheduleId = data._id;
    $("#location").text(data.location);
    $("#time").text(
      `${data.start.hours}:${
        data.start.minutes != 0 ? data.start.minutes : "00"
      } - ${data.end.hours}:${data.end.minutes != 0 ? data.end.minutes : "00"}`
    );
    $("#day").text(days[data.day]);
  });

  $("#register").on("click", registerEvent);
});

//Sends data about the current event to the server to attempt to register
//the currently logged in user for the event
function registerEvent() {
  var now = new Date();

  var url = "/api/event/register";
  $.post({
    type: "POST",
    url: url,
    data: {
      scheduleId,
      date: now.getDate(),
      month: now.getMonth(),
      year: now.getYear(),
    },
    dataType: "json",
  })
    .done((response) => {
      //Notify user if registration was succesful
      if (response.result.success === true) {
        $("#register").css({color: "green", "border-color":"green"})
          .text("Registered")
      }
      //If user is not signed in, notify user
      else {
        //TODO Navigate user to the sign in page, or request more information
        alert("User is not signed in");
      }
    })
    .fail(() => {
      //TODO handle server failure
    });
}
