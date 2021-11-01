//Takes a filename, string data and file mimetype
//Creates and clicks a false link, causing the file to be downloaded
export default function download(name, data, mime) {
  var uri = `data:${mime};charset=utf-8,` + encodeURIComponent(data);

  var link = document.createElement("a");
  var $link = $(link);
  $link.hide();

  link.download = name;
  link.href = uri;
  link.click();
  $link.remove();
  return;
}
