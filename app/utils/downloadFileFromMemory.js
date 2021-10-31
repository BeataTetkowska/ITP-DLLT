var stream = require("stream");

//Sends a file to be donwloaded on the frontend.
//Takes Express response object, the filename as string
//and the contents as string
//optionally takes file encoding
function downloadFileFromMemory(res, name, fileString, encoding = "utf8") {
  var fileContents = Buffer.from(fileString, encoding);

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set("Content-disposition", "attachment; filename=" + name);
  res.set("Content-Type", "text/plain");

  readStream.pipe(res);
}

module.exports = downloadFileFromMemory;
