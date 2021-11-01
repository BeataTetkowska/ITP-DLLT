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
  });

  $("#userSearch").on("input", (e) => {
    validateCurrentlySelectedUser();
    userSearchAutocompleteOnTimer($(e.target));
  });
});

//Sends a given user ID to the backend for the user to be registered
function manuallyRegisterUser(id) {
  var url = `/event/${eventId}/register?userId=${id}`;
  $.ajax({
    type: "PUT",
    url: url,
    contentType: "application/json",
  }).done((res) => {
    if (res.success) {
      //TODO notify user in a more user friendly manner, a toast would be ideal
      alert("User registered");
    } else {
      //TODO handle failure case
      alert("User failed to register, please try again");
    }
  });
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

  $registerButton = $("#registerManually");

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
  }).done((res) => {
    $dataList = $("#userSearchList");
    $options = [];

    res.users.forEach((user) => {
      $option = $("<option></option>");
      $option.attr({
        value: `${user.name.first} ${user.name.last}`,
        "data-id": user._id,
      });
      $options.push($option);
    });
    $dataList.empty().append($options);
    el.focus();
  });
}

function parseAttendanceRecords(res) {
  if (res.users.length === 0) {
    alert("No users registered for event");
    return;
  } else {
    var $table = $("#attendanceTableBody");
    $table.empty();
    res.users.forEach((user) => {
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
}
