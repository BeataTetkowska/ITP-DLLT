import validateForm from "./utils/validateForm.js";


 $(function () {

  $("#submit").click((e) => handleSubmit(e));

    //Get JSON data about current user 
    //Parse into html data 
    $.getJSON("/user",function(response){

    //test line 
    //$.getJSON("/user", (response) => console.log(response ))
      var {email, name, postcode, dob,  emergency } = response;

      $("#email").val(email);
      $("#firstName").val(name.first);
      $("#lastName").val(name.last);

      // need to insert dob WIP 
      $("#dateOfBirth").val(dob);

      $("#postcode").val(postcode);
      $("#emergencyName").val(emergency.name);
      $("#phoneNumber").val(emergency.phone);
  });
});



  //Validates form input and sends form data to server to edit user
function handleSubmit(e) {
  e.preventDefault();

  var formData = validateSubmitForm();
  if (!formData) {
    return;
  }

  var url = "/user";
  $.ajax({
    type:'PATCH',
    url: url,
    data: formData,
  })
    .done((res) => {
     // window.location.href = "/event";
     console.log(res)
     console.log("hello1")
    })
    .fail((xhr) => {
      alert(xhr.responseText);
     // $("#email").addClass("input--error");
    });
}

//Prepares formfield validation metadata and validates form fields
function validateSubmitForm() {
  var fields = [
    {
      selector: "#firstName",
      id: "firstName",
    },
    {
      selector: "#lastName",
      id: "lastName",
    },
    {
      selector: "#email",
      id: "email",
      re: true,
      reString: /^\S+@\S+\.\S+$/,
    },
    {
      selector: "#dateOfBirth",
      id: "dateOfBirth",
    },
    {
      selector: "#postcode",
      id: "postcode",
    },
    {
      selector: "#emergencyName",
      id: "emergencyName",
    },
    {
      selector: "#phoneNumber",
      id: "phoneNumber",
    },
  ];

  var formData = validateForm(fields);

  if (!formData.isValid) {
    return false;
  }
  return formData;
}
    

  
  
  




