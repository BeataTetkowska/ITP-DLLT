//Flattens an object
//taken from https://stackoverflow.com/a/56253298
function flattenObject(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + "_" + key : key;
    if (typeof obj[key] == "object") {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

module.exports = flattenObject;
