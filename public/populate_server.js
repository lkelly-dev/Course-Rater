
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpPost(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", theUrl, true);
  xmlHttp.send("name=CSC158");

}

function populate_server() {
  var urlString = "https://crossorigin.me/https://cobalt.qas.im/api/1.0/courses?key=456y8hDcetwgug1EGcDxM9XHcrAx84P8";
  var jsonData = httpGet(urlString);
  var arr_from_json = JSON.parse(jsonData);

  httpPost("http://localhost:8080/api/courses");

  console.log(arr_from_json);
  for(i = 0; i < arr_from_json.length; i++){
    var courseName = arr_from_json[i].code


    var classMeetings = arr_from_json[i].meeting_sections;
    for(j = 0; j < classMeetings.length; j++){
      var meetingTimes = classMeetings[j];
      for(x = 0; x < meetingTimes.instructors.length; x++){
        //console.log(meetingTimes.instructors[x]);
        var instructors = meetingTimes.instructors[x];
        console.log(instructors + "LOL");

      }
    }
  }
}
