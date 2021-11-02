import downloadFileAsString from "./utils/downloadFileAsString.js";

var eventId;
$(async function () {
  var eventUrl = window.location.pathname;
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
    var { nextEvent: event } = res;
    eventId = event._id;
    var attendanceUrl = `/event/${eventId}/attendance`;
    $("#location").text(event.location);
    $("#time").text(
      `${event.start.hours}:${
        event.start.minutes != 0 ? event.start.minutes : "00"
      } - ${event.end.hours}:${
        event.end.minutes != 0 ? event.end.minutes : "00"
      }`
    );
    $("#day").text(days[event.day]);

    $("#getAttendance")
      .removeClass("disabled")
      .on("click", () => {
        $.ajax({
          type: "GET",
          url: attendanceUrl,
          dataType: "json",
        })
          .done((users) => parseAttendanceRecords(users))
          .fail((xhr) => alert(xhr.responseText));
      });

    $("#exportAttendanceLink").on("click", () => downloadCsv(attendanceUrl));
  });

  $("#userSearch").on("input", (e) => {
    validateCurrentlySelectedUser();
    userSearchAutocompleteOnTimer($(e.target));
  });
});

function downloadCsv(url) {
  var mime = "text/csv";
  $.ajax({
    url: url,
    headers: {
      Accept: `${mime}, */*`,
    },
    dataType: "json",
  })
    .done((res) => downloadFileAsString(res.fileName, res.data, mime))
    .fail((xhr) => alert(xhr.responseText));
  return false;
}

//Sends a given user ID to the backend for the user to be registered
function manuallyRegisterUser(id) {
  var url = `/event/${eventId}/register?userId=${id}`;
  $.ajax({
    type: "PUT",
    url: url,
  })
    .done((text) => alert(text))
    .fail((xhr) => alert(xhr.responseText));
}

//Delays the ajax call to update the list of users in datalist
//This ensures that the list is not updated more often than required
var timer;
function userSearchAutocompleteOnTimer(el) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    getUsersAndUpdateDatalist(el);
  }, 300);
}

//Confirms whether the current value in the input field matches
//one of the options in the datalist.
//If it does then the id is passed to manuallyRegisterUser and the
//button to manually register is enabled
function validateCurrentlySelectedUser() {
  var id = $(
    '#userSearchList option[value="' + $("#userSearch").val() + '"]'
  ).data("id");

  var $registerButton = $("#registerManually");

  if (!id) {
    $registerButton.addClass("disabled");
    $registerButton.off("click");
    return;
  }

  $("#registerManually").removeClass("disabled");
  $("#registerManually").on("click", () => manuallyRegisterUser(id));
}

//Takes the current value of the userSearch input field
//Makes an ajax call to search for users matching this input
//Updates the datalist attached to input field to display potential matching users
function getUsersAndUpdateDatalist(el) {
  var query = el.val();

  $.ajax({
    type: "GET",
    url: `/user/search?query=${query}`,
    contentType: "application/json",
  })
    .done((users) => {
      var $dataList = $("#userSearchList");
      var $options = [];

      users.forEach((user) => {
        var $option = $("<option></option>");
        $option.attr({
          value: `${user.name.first} ${user.name.last}`,
          "data-id": user._id,
        });
        $options.push($option);
      });
      $dataList.empty().append($options);
      el.focus();
    })
    .fail((xhr) => alert(xhr.responseText));
}

function parseAttendanceRecords(users) {
  var $table = $("#attendanceTableBody");
  $table.empty();
  users.forEach((user) => {
    var userTableDetails = [
      `${user.name.first} ${user.name.last}`,
      user.emergency.name,
      user.emergency.phone,
    ];

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
