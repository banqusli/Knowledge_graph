"use strict";

(function(){
    var map = L.map('map').setView([40.4,20.5], 2.4);
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    /*
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://cordis.europa.eu/data/cordis-h2020organizations.csv"; 
        fetch(proxyurl+ url)
        .then(response => response.text())
        .then(contents => csvJSON(contents))
        .catch((e) => console.log(e))
    */
    $.ajax({
      type: 'GET',
      url: `./csv/cordis_org.csv`,
      success: function(data){
        csvJSON(data);
      },
      error: function(e){
        console.log(e);
      }
    });

    //convert csv to json
    function csvJSON(csv){
        var lines= csv.split("\n");
        var result = [];
        var headers=lines[0].split(";");
        
        for(var i=1;i<lines.length;i++){
          var obj = {};
          var currentline=lines[i].split(";");
          for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }
        const stringify = JSON.stringify(result)
        const data = JSON.parse(stringify);
        let loc = [];

        $.each(data, function(k,v){
          loc.push(`${v.street}, ${v.city} SE1 0JF, ${v.country}`);
        });
        locations(loc);
      };
      
      //convert address to coordinate and add them to map
      function locations(loc){
        var query_addr = loc.slice(1, 15);
        try {
          for (let i = 0; i < query_addr.length; i++) {
            $.get(location.protocol + '//nominatim.openstreetmap.org/search?format=json&q='+ query_addr[i], function(data){ 
              L.marker([data[0].lat, data[0].lon]).addTo(map);
            });
          }
        } catch (e) {
          if (e instanceof RangeError) {
            return false;
          } else {
            throw e;
          }
        }
      }
})();