function mainscript() {
  //THE ACTUAL FILE MUST BE EDITED FROM THE README LINK
  
  //Get values for request
  var sha = getSHA();
  var authenticationToken = "token masked for safety";
  var content = buildJSON();
  var url = "https://api.github.com/repos/teku45/Web-DROP/contents/Map.json";
  
  //construct request to be sent
  var headers = {
    "Authorization" : "token " + authenticationToken,
  };
  
  var payload = {  
    "path": "Map.json",
    "message": "Initial Commit",
    "committer":{  
      "name": "Sidd",
      "email": "siddsubra@gmail.com"
    },
    "content": content,
    "sha": sha,
    "branch": "master"
  };
  
  var options = {
    "headers" : headers,
    "method" : "PUT",
    "payload" : JSON.stringify(payload)
  };
  
  //Send Request to Github
  UrlFetchApp.fetch(url, options);
}

function buildJSON(){
  //Build the GeoJSON to be sent
  var point = getPoint();
  var orbit = getOrbit();
  var orbit1 = orbit[0];
  var orbit2 = orbit[1];
  
  var GeoJSON =   {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": point
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": orbit1
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": orbit2
      }
    }
  ]
};
  
  //Encode in the required base 64 format
  var encodedJSON = Utilities.base64Encode(JSON.stringify(GeoJSON));
  return encodedJSON;
}

function getOrbitalProfile(){
  //retrieves GeoJSON of entire profile from github and extracts the array of points
  var profileJSON = JSON.parse(UrlFetchApp.fetch("https://raw.githubusercontent.com/teku45/Web-DROP/master/Profile.json"));
  var profileArray = profileJSON.features[0].geometry.coordinates;
  return profileArray;
}

function getPoint(){
  //returns the instantaneuous location of the payload
  var profile = getOrbitalProfile();
  var profileIndex = minutesFromStart();
  return profile[profileIndex];
}

function findWrap(orbit){
  //finds at what point the orbit wraps around the earth
  var index = 0;
  for (i = 0; i < orbit.length; i++){
    if (!(orbit[i][0] >= orbit[i+1][0]-50 && orbit[i][0] <= orbit[i+1][0]+50)){
      var index = i;
      break;
    }
  }
  Logger.log(index);
  return index;
}

function getOrbit(){
  //returns the current orbit that the payload is in
  var profile = getOrbitalProfile();
  var profileIndex = minutesFromStart();
  var orbitDuration = 90;
  var orbitIteration = Math.floor(profileIndex/orbitDuration);
  var rangeBegin1 = orbitDuration * orbitIteration;
  var rangeEnd2 = orbitDuration * (orbitIteration + 1) - 1;
  var orbit = [];
  
  for (i = rangeBegin1; i <= rangeEnd2; i++){
    orbit.push(profile[i]);
  }
  
  var wrapIndex = findWrap(orbit);
  var rangeEnd1 = wrapIndex + (90 * orbitIteration);
  var rangeBegin2 = rangeEnd1 + 1;
  
  var orbit1 = [];
  var orbit2 = [];
  
  for (i = rangeBegin1; i <= rangeEnd1; i++){
    orbit1.push(profile[i]);
  }
  for (i = rangeBegin2; i <= rangeEnd2; i++){
    orbit2.push(profile[i]);
  }
  
  Logger.log(orbit);
  var outputArray = [orbit1, orbit2];
  return outputArray;
}

function minutesFromStart(){
  //Set Start Date here. Parameters are (Year, Month (January starts at 0), Day, Hour (24 Hour time), Minutes, Seconds, Milliseconds)
  var startTime = new Date(2016, 6, 28, 9, 46, 0, 0);
  var currentTime = new Date();
  var minutesElapsed = Math.floor((currentTime - startTime)/60000);
  return minutesElapsed;
}

function getSHA(){
  //Get SHA Key for the GeoJSON File
  var options = {
    "headers": {
    "Authorization" : "token " + "e03ffa53d94813d593fc5abb714c77018da4ef94",
    },
  };
  var url = "https://api.github.com/repos/teku45/Web-DROP/contents/Map.json";
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  return(response.sha);
  Logger.log(response);
}
