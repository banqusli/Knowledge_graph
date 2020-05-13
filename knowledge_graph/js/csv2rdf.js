$(function(){
    /*
    //get dataset for organisations as csv
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://cordis.europa.eu/data/cordis-h2020organizations.csv"; 
    fetch(proxyurl+ url)
    .then(response => response.text())
    .then(contents => convert_to_rdf(contents))
    */

    //get part of the dataset of organisations as csv, so browser won't crash.
    $.ajax({
      type: 'GET',
      //to get the whole dataset change the url value to: `./js/cordis_org.csv`
      url: `./csv/cordis_copy.csv`,
      success: function(data){
        convert_to_rdf(data);
      },
      error: function(e){
        console.log(e);
      }
	  });
  
   //convert csv data to rdf
   function convert_to_rdf(csvData){
      let Data = csvData.split('\n').map(row => row.trim());
      let headings = Data[0].split(';');
      let rdf = `<rdf:RDF
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:org="http://www.onem2m.org/ontology/Base_Ontology#"
      xmlns:owl="http://www.w3.org/2002/07/owl#"
      xmlns:dcatapop="http://data.europa.eu/88u/ontology/dcatapop#"
      xmlns:cfso="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#"
      xmlns:dcat="http://www.w3.org/ns/dcat#">`;
      for(let i = 1; i < Data.length; i++) {
          let details = Data[i].split(';');
          rdf += `<dcatapop:organisation rdf:about="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#organisation">`;
          for(let j = 0; j < headings.length; j++) {
              if(headings[j] == "id" || headings[j] == "ecContribution" || headings[j] == "vatNumber" ||  headings[j] == "projectRcn" || headings[j] == "projectID" || headings[j] == "contactTelephoneNumber" || headings[j] == "contactFaxNumber "){
                rdf += `<owl:${headings[j]}><owl:${headings[j]} rdf:about="http://www.w3.org/2001/XMLSchema#${details[j]}"/>${details[j]}</owl:${headings[j]}>`;
              }else if(headings[j] == "contactForm" || headings[j] == "organizationUrl"){
                rdf += `<dcat:${headings[j]}><dcat:${headings[j]} rdf:resource="http://www.w3.org/ns/dcat#URL"/></dcat:${headings[j]}>`;
              }else if(headings[j] == "activityType"){
                rdf += `<rdf:${headings[j]}><rdf:${headings[j]} rdf:about="http://www.w3.org/1999/02/22-rdf-syntax-ns#${details[j]}"/></rdf:${headings[j]}>`;
              }else{
                rdf += `<cfso:${headings[j]}><cfso:${headings[j]} rdf:about="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#type"/></cfso:${headings[j]}>`;
              }
          }
          rdf += "</dcatapop:organisation>"
        }
      rdf += "</rdf:RDF>";

      graph(rdf);
    };

    //store the Data in graph  
    function graph(data){
      var store = $rdf.graph();
      var baseUrl="http://localhost:8080/knowledge_graph/knowledge_graph/projects.html";
      $rdf.parse(data, store, baseUrl, 'application/rdf+xml');
      read_graph(store);
    };

    //extract the Data from the graph
    function read_graph(store){
      var stms = store.statementsMatching(undefined, undefined , undefined);
      for (var i=0; i<stms.length;i++) {
          var stm = stms[i]
      }
      visualization(stms);
    };

    //Display the Knowledgegraph
    function visualization(data){  
      const spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 600,
        "height": 1600,
        "padding": 5,

        "data": [
              {
                "name": "tree",
                "values": data,
                "transform": [
                  {
                    "type": "nest",
                    "generate":true,
                    "keys": ["graph", "subject", "predicate", "object"]
                  },
                  {
                    "type": "tree",
                    "size": [{"signal": "height"}, {"signal": "width - 100"}],
                    "as": ["y", "x", "depth", "children"]
                  }
                ]
              },
              {
                "name": "links",
                "source": "tree",
                "transform": [
                  { "type": "treelinks" },
                  {
                    "type": "linkpath",
                    "orient": "horizontal"
                  }
                ]
              }
            ],
      
        "scales": [
          {
            "name": "color",
            "type": "linear",
            "range": {"scheme": "magma"},
            "domain": {"data": "tree", "field": "depth"},
            "zero": true
          }
        ],
      
        "marks": [
          {
            "type": "path",
            "from": {"data": "links"},
            "encode": {
              "update": {
                "path": {"field": "path"},
                "stroke": {"value": "#ccc"}
              }
            }
          },
          {
            "type": "symbol",
            "from": {"data": "tree"},
            "encode": {
              "enter": {
                "size": {"value": 100},
                "stroke": {"value": "#fff"}
              },
              "update": {
                "x": {"field": "x"},
                "y": {"field": "y"},
                "fill": {"scale": "color", "field": "depth"}
              }
            }
          },
          {
            "type": "text",
            "from": {"data": "tree"},
            "encode": {
              "enter": {
                "text": {"field": "object"},
                "fontSize": {"value": 9},
                "baseline": {"value": "middle"}
              },
              "update": {
                "x": {"field": "x"},
                "y": {"field": "y"},
                "dx": {"signal": "datum.children ? -7 : 7"},
                "align": {"signal": "datum.children ? 'right' : 'left'"}
              }
            }
          }
        ]
      };

      render(spec);
      function render(spec) {
        view = new vega.View(vega.parse(spec), {
          renderer:  'canvas',
          container: '#org',
          hover:     true 
        });
        return view.runAsync();
      };

      const spex = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 1000,
        "height": 720,
        "padding": 2,
        "autosize": "none",
      
        "signals": [
          {
            "name": "labels", "value": true,
            "bind": {"input": "checkbox"}
          },
          {
            "name": "radius", "value": 280,
            "bind": {"input": "range", "min": 20, "max": 600}
          },
          {
            "name": "extent", "value": 360,
            "bind": {"input": "range", "min": 0, "max": 360, "step": 1}
          },
          {
            "name": "rotate", "value": 0,
            "bind": {"input": "range", "min": 0, "max": 360, "step": 1}
          },
          {
            "name": "layout", "value": "tidy",
            "bind": {"input": "radio", "options": ["tidy", "cluster"]}
          },
          {
            "name": "links", "value": "line",
            "bind": {
              "input": "select",
              "options": ["line", "curve", "diagonal", "orthogonal"]
            }
          },
          { "name": "originX", "update": "width / 2" },
          { "name": "originY", "update": "height / 2" }
        ],
      
        "data": [
          {
            "name": "tree",
            "values": data,
            "transform": [
              {
                "type": "nest",
                "generate":true,
                "keys": ["graph", "subject", "predicate", "object"]
              },
              {
                "type": "tree",
                "method": {"signal": "layout"},
                "size": [1, {"signal": "radius"}],
                "as": ["alpha", "radius", "depth", "children"]
              },
              {
                "type": "formula",
                "expr": "(rotate + extent * datum.alpha + 270) % 360",
                "as":   "angle"
              },
              {
                "type": "formula",
                "expr": "PI * datum.angle / 180",
                "as":   "radians"
              },
              {
                "type": "formula",
                "expr": "inrange(datum.angle, [90, 270])",
                "as":   "leftside"
              },
              {
                "type": "formula",
                "expr": "originX + datum.radius * cos(datum.radians)",
                "as":   "x"
              },
              {
                "type": "formula",
                "expr": "originY + datum.radius * sin(datum.radians)",
                "as":   "y"
              }
            ]
          },
          {
            "name": "links",
            "source": "tree",
            "transform": [
              { "type": "treelinks" },
              {
                "type": "linkpath",
                "shape": {"signal": "links"}, "orient": "radial",
                "sourceX": "source.radians", "sourceY": "source.radius",
                "targetX": "target.radians", "targetY": "target.radius"
              }
            ]
          }
        ],
      
        "scales": [
          {
            "name": "color",
            "type": "linear",
            "range": {"scheme": "magma"},
            "domain": {"data": "tree", "field": "depth"},
            "zero": true
          }
        ],
      
        "marks": [
          {
            "type": "path",
            "from": {"data": "links"},
            "encode": {
              "update": {
                "x": {"signal": "originX"},
                "y": {"signal": "originY"},
                "path": {"field": "path"},
                "stroke": {"value": "#ccc"}
              }
            }
          },
          {
            "type": "symbol",
            "from": {"data": "tree"},
            "encode": {
              "enter": {
                "size": {"value": 100},
                "stroke": {"value": "#fff"}
              },
              "update": {
                "x": {"field": "x"},
                "y": {"field": "y"},
                "fill": {"scale": "color", "field": "depth"}
              }
            }
          },
          {
            "type": "text",
            "from": {"data": "tree"},
            "encode": {
              "enter": {
                "text": {"field": "object"},
                "fontSize": {"value": 9},
                "baseline": {"value": "middle"}
              },
              "update": {
                "x": {"field": "x"},
                "y": {"field": "y"},
                "dx": {"signal": "(datum.leftside ? -1 : 1) * 6"},
                "angle": {"signal": "datum.leftside ? datum.angle - 180 : datum.angle"},
                "align": {"signal": "datum.leftside ? 'right' : 'left'"},
                "opacity": {"signal": "labels ? 1 : 0"}
              }
            }
          }
        ]
      };
      renderRadial(spex);
      function renderRadial(spex) {
        view = new vega.View(vega.parse(spex), {
          renderer:  'canvas',
          container: '#Radial',
          hover:     true 
        });
        return view.runAsync();
      }
    };
});