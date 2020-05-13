$(function(){
    //get part of the dataset of projects as csv, so browser won't crash.
    $.ajax({
      type: 'GET',
      //to get the whole dataset change the url value to: `./js/cordis_pro_copy.csv`
      url: `./csv/cordis_pro_copy.csv`,
      success: function(data){
        convert_to_rdf(data);
        csvJSON(data);
      },
      error: function(e){
        console.log(e);
      }
    });

    function csvJSON(csv){
      var lines= csv.split("\n");
      var result = [];
      var headers=lines[0].split(";");
      
      for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(";");
        if(currentline[0].length > 7){
          delete currentline[i]
        }else{
          for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
          }
        }
        result.push(obj);
      }
      const stringify = JSON.stringify(result)
      const data = JSON.parse(stringify);
      charts(data);
    };
  
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
          rdf += `<dcatapop:project rdf:about="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#project">`;
            if(details[0].length > 7){
              delete details[i];
            }else{
              for(let j = 0; j < headings.length; j++) {
                if(headings[j] == "rcn"){
                  rdf += `<owl:${headings[j]}>${details[j]}</owl:${headings[j]}>`;
                }else if(headings[j] == "id" ){
                  rdf += `<owl:${headings[j]}>${details[j]}</owl:${headings[j]}>`;
                }else if(headings[j] == "programme" || headings[j] == "frameworkProgramme"){
                  rdf += `<dcat:${headings[j]} xml:lang="en">${details[j]}</dcat:${headings[j]}>`;
                }else if(headings[j] == "endDate" || headings[j] == "startDate"){
                  if(details[j] != null){
                    if(details[j].length > 10){
                      delete details[j];
                    }else{
                      rdf += `<dcat:${headings[j]}>${details[j]}</dcat:${headings[j]}>`; 
                    }
                  }
                }else if(headings[j] == "acronym" || headings[j] == "topic"){
                  rdf += `<rdf:${headings[j]}>${details[j]}</rdf:${headings[j]}>`;
                }else if(headings[j] == "status"){
                  rdf += `<dcatapop:${headings[j]}>${details[j]}</dcatapop:${headings[j]}>`;
                }else{
                  rdf += `<cfso:${headings[j]}><cfso:${headings[j]} rdf:about="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#type"/></cfso:${headings[j]}>`;
                }
              }
            } 
          rdf += "</dcatapop:project>"
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

    function charts(data){
      let programme = [];
      $.each(data, function(key, value){
        programme.push(value.programme) 
      })

      var H2020EU132 = 0;
      var H2020EU351 = 0;
      var H2020EU347 = 0;
      var H2020EU11 = 0;
      var H2020EU3454 = 0;
      var H2020EU356 = 0;
      var H2020EU4 = 0;
      var H2020EU214 = 0;
      for(var i = 0; i < programme.length; ++i){
          if(programme[i] == "H2020-EU.1.3.2."){
            H2020EU132++;
          }else if(programme[i] == "H2020-EU.3.5.1."){ 
            H2020EU351++
          }else if(programme[i] == "H2020-EU.3.4.7."){
            H2020EU347++
          }else if(programme[i] == "H2020-EU.1.1."){
            H2020EU11++
          }else if(programme[i] == "H2020-EU.3.4.5.4."){
            H2020EU3454++
          }else if(programme[i] == "H2020-EU.3.5.6."){
            H2020EU356++
          }else if(programme[i] == "H2020-EU.4."){
            H2020EU4++
          }else if(programme[i] == "\"H2020-EU.2.1.4."){
            H2020EU214++
          }
          
      }
      const spec = {
          "width": 650,
          "height": 200,
          "padding": 5,
        
          "data": [
            {
              "name": "table",
              "values":[
                {"category": "H2020-EU.1.3.2.", "amount": H2020EU132},
                {"category": "H2020-EU.3.5.1.", "amount": H2020EU351},
                {"category": "H2020-EU.3.4.7.", "amount": H2020EU347},
                {"category": "H2020-EU.1.1.", "amount": H2020EU11},
                {"category": "H2020-EU.3.4.5.4.", "amount": H2020EU3454},
                {"category": "H2020-EU.3.5.6.", "amount": H2020EU356},
                {"category": "H2020-EU.4.", "amount": H2020EU4},
                {"category": "H2020-EU.2.1.4.", "amount": H2020EU214}
              ] 
            }
          ],
        
          "signals": [
            {
              "name": "tooltip",
              "value": {},
              "on": [
                {"events": "rect:mouseover", "update": "datum"},
                {"events": "rect:mouseout",  "update": "{}"}
              ]
            }
          ],
        
          "scales": [
            {
              "name": "xscale",
              "type": "band",
              "domain": {"data": "table", "field": "category"},
              "range": "width",
              "padding": 0.05,
              "round": true
            },
            {
              "name": "yscale",
              "domain": {"data": "table", "field": "amount"},
              "nice": true,
              "range": "height"
            }
          ],
        
          "axes": [
            { "orient": "bottom", "scale": "xscale", "title": "finanzierte Programme" },
            { "orient": "left", "scale": "yscale", "title": "Projekte" }
          ],
        
          "marks": [
            {
              "type": "rect",
              "from": {"data":"table"},
              "encode": {
                "enter": {
                  "x": {"scale": "xscale", "field": "category"},
                  "width": {"scale": "xscale", "band": 1},
                  "y": {"scale": "yscale", "field": "amount"},
                  "y2": {"scale": "yscale", "value": 0}
                },
                "update": {
                  "fill": {"value": "steelblue"}
                },
                "hover": {
                  "fill": {"value": "red"}
                }
              }
            },
            {
              "type": "text",
              "encode": {
                "enter": {
                  "align": {"value": "center"},
                  "baseline": {"value": "bottom"},
                  "fill": {"value": "#333"}
                },
                "update": {
                  "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                  "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                  "text": {"signal": "tooltip.amount"},
                  "fillOpacity": [
                    {"test": "datum === tooltip", "value": 0},
                    {"value": 1}
                  ]
                }
              }
            }
          ]
        };
    
      render(spec);
      function render(spec) {
        view = new vega.View(vega.parse(spec), {
          renderer:  'canvas',
          container: '#bar',
          hover:     true 
        });
        return view.runAsync();
      };

      const spex = {
        "width": 200,
        "height": 200,
      
        "data": [
          {
            "name": "table",
            "values": [
              {"id": "H2020-EU.1.3.2.", "field": H2020EU132},
              {"id": "H2020-EU.3.5.1.", "field": H2020EU351},
              {"id": "H2020-EU.3.4.7.", "field": H2020EU347},
              {"id": "H2020-EU.1.1.", "field": H2020EU11},
              {"id": "H2020-EU.3.4.5.4.", "field": H2020EU3454},
              {"id": "H2020-EU.3.5.6.", "field": H2020EU356},
              {"id": "H2020-EU.4.", "field": H2020EU4},
              {"id": "H2020-EU.2.1.4.", "field": H2020EU214}
            ] ,
            "transform": [
              {
                "type": "pie",
                "field": "field"
              }
            ]
          }
        ],

        "signals": [
          {
            "name": "tooltip",
            "value": {},
            "on": [
              {"events": "rect:mouseover", "update": "datum"},
              {"events": "rect:mouseout",  "update": "{}"}
            ]
          }
        ],

        "scales": [
            {
                "name": "color",
                "type": "ordinal",
                "domain": {"data": "table", "field": "id"},
                "range": {"scheme": "category10"}
            }],

        "legends": [
            {
                "fill": "color",
                "title": "Programme",
                "encode": {
                    "symbols": {
                        "update": {
                            "shape": {
                                "value": "circle"
                            }
                        }
                    }
                }
            }
        ],

        "marks": [
          {
            "type": "arc",
            "from": {"data": "table"},
            "encode": {
              "enter": {
                "fill": {"scale": "color", "field": "id"},
                "x": {"signal": "width / 2"},
                "y": {"signal": "height / 2"},
                "tooltip": {"signal": "datum.field"}
              },
              "update": {
                "startAngle": {"field": "startAngle"},
                "endAngle": {"field": "endAngle"},
                "outerRadius": {"signal": "width / 2"}
              }
            }
          }
        ]
      };
  
    render2(spex);
    function render2(spec) {
      view = new vega.View(vega.parse(spec), {
        renderer:  'canvas',
        container: '#pie',
        hover:     true 
      });
      return view.runAsync();
    }
    }

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
          container: '#project',
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