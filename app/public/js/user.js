  $(function () {

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

      $("#postcode").val(postcode);
      $("#emergencyName").val(emergency.name);
      $("#phoneNumber").val(emergency.phone);
  });
    
  });
  
  
  




