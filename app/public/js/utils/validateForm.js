//Taks an array of fields in the form
//{
//    selector: "#profileNameInput",
//    id: "name"
//    re: true,
//    reString: /^\S+@\S+\.\S+$/
//},
//
//Selector: the id of the input element
//id: the name to be used to store the resulting value
//reString: an re pattern which can be used to validate the fields value
//re: boolean value, if true the value will be evaluated against the reString, if false it won't
//
//Eech field will be evaluated and added to the results
//if any field is not valid, an error class will be added to it
//and the result will notify that form is not valid
export default function validateForm(fields) {
  var returnForm = {};
  returnForm.isValid = true;
  //Loop through each field
  fields.forEach((field) => {
    //Get fields input element
    var el = $(field.selector);
    el.on("input", function () {
      $(this).removeClass("input--error");
    });

    var val = el.val();
    //Check if value is empty
    if (val === "") {
      if (!field.canBeEmpty) {
        el.addClass("input--error");
        returnForm.isValid = false;
        return;
      } else {
        returnForm[field.id] = false;
      }
    } else if (field.re) {
      if (field.reString.test(val) === false) {
        el.addClass("input--error");
        returnForm.isValid = false;
        return;
      } else {
        returnForm[field.id] = val;
      }
    } else {
      returnForm[field.id] = val;
    }
  });
  return returnForm;
}
