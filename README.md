
## Web-DROP ##
Website Display of Realtime Orbital Profile


----------
Web-DROP is a live online display of a satellite that follows a pre-generated orbital profile that is in the GeoJSON format. It was created for the NASA IV&V Spaceflight Design Challenge in preparation for its orbital payload, OC-Flight-1.

To upload a profile, delete the current **Profile.json**  file and upload another one named **Profile.js**. Next, update the **[Web-DROP.js](https://script.google.com/d/1of5vbl6E2playLiH9KehZVsLCn0RZRDX4hd4c8kryHWdeWkLIogHL8e3/edit?usp=sharing)** file on line 141. 

    //Set Start Date here. Parameters are (Year, Month (January starts at 0), Day, Hour (24 Hour time), Minutes, Seconds, Milliseconds)
    
    var startTime = new Date(2016, 6, 28, 9, 46, 0, 0);

Finally, the map can be embedded using 

''<iframe height="420" width="620" frameborder="0" src="https://render.githubusercontent.com/view/geojson?url=https://raw.githubusercontent.com/teku45/GeoJSON-Update/master/mygeojson.json"></iframe>''

