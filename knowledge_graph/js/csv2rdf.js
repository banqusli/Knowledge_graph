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
      Charts(data);
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
          rdf += `<dcatapop:organisation rdf:about="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#org">`;
          for(let j = 0; j < headings.length; j++) {
              if(headings[j] == "id" || headings[j] == "ecContribution" || headings[j] == "vatNumber" ||  headings[j] == "projectRcn" || headings[j] == "projectID" || headings[j] == "contactTelephoneNumber" || headings[j] == "contactFaxNumber "){
                rdf += `<owl:${headings[j]}>${details[j]}</owl:${headings[j]}>`;
              }else if(headings[j] == "contactForm" || headings[j] == "organizationUrl"){
                rdf += `<dcat:${headings[j]}><dcat:${headings[j]} rdf:resource="http://www.w3.org/ns/dcat#URL"/></dcat:${headings[j]}>`;
              }else if(headings[j] == "activityType"){
                if(details[j] != null){
                  rdf += `<rdf:${headings[j]}>${details[j]}</rdf:${headings[j]}>`;
                }
              }else if(headings[j] == "projectAcronym"){
                if(details[j] != null){
                  rdf += `<dcatapop:${headings[j]} xml:lang="en">${details[j]}</dcatapop:${headings[j]}>`;
                }
              }else if(headings[j] == "firstNames" || headings[j] == "lastNames" || headings[j] == "contactTitle"){
                if(details[j] != null){
                  rdf += `<dcat:${headings[j]}>${details[j]}</dcat:${headings[j]}>`;
                }
              }else{
                if(details[j] != null){
                  rdf += `<cfso:${headings[j]}><cfso:${headings[j]} rdf:about="http://203.254.173.81:8080/ontologies/ConnectedFarmServiceOntology.owl#orgName"/></cfso:${headings[j]}>`;
                }
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

    //display charts about the orgamisations
    function Charts(data){
      let countries = [];
      $.each(data, function(key, value){
        countries.push(value.country) 
      })

      var de = 0, fr = 0, au = 0, es = 0, it= 0, pt = 0, uk = 0, kr = 0, fi = 0, no = 0, lu = 0, ru = 0, be = 0, cr = 0, ne = 0, hu = 0, is = 0;
      for(var i = 0; i < countries.length; ++i){
          if(countries[i] == "DE"){
            de++;
          }else if(countries[i] == "FR"){ 
            fr++
          }else if(countries[i] == "AU"){
            au++
          }else if(countries[i] == "ES"){
            es++
          }else if(countries[i] == "IT"){
            it++
          }else if(countries[i] == "PT"){
            pt++
          }else if(countries[i] == "UK"){
            uk++
          }else if(countries[i] == "KR"){
            kr++
          }else if(countries[i] == "FI"){
            fi++
          }else if(countries[i] == "NO"){
            no++
          }else if(countries[i] == "LU"){
            lu++
          }else if(countries[i] == "RU"){
            ru++
          }else if(countries[i] == "BE"){
            be++
          }else if(countries[i] == "CR"){
            cr++
          }else if(countries[i] == "NE"){
            ne++
          }else if(countries[i] == "HU"){
            hu++
          }else if(countries[i] == "IS"){
            is++
          }
      }
      const spec = {
          "width": 1000,
          "height": 400,
          "padding": 5,
        
          "data": [
            {
              "name": "table",
              "values":[
                {"category": "DE", "amount": de},
                {"category": "FR", "amount": fr},
                {"category": "AU", "amount": au},
                {"category": "ES", "amount": es},
                {"category": "IT", "amount": it},
                {"category": "PT", "amount": pt},
                {"category": "UK", "amount": uk},
                {"category": "KR", "amount": kr},
                {"category": "FI", "amount": fi},
                {"category": "NO", "amount": no},
                {"category": "LU", "amount": lu},
                {"category": "RU", "amount": ru},
                {"category": "BE", "amount": be},
                {"category": "CR", "amount": cr},
                {"category": "NE", "amount": ne},
                {"category": "HU", "amount": hu},
                {"category": "IS", "amount": is}
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
            { "orient": "bottom", "scale": "xscale", "title": "Finanzierte Länder" },
            { "orient": "left", "scale": "yscale", "title": "Projekte Anzahl" }
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
    
      render1(spec);
      function render1(spec) {
        view = new vega.View(vega.parse(spec), {
          renderer:  'canvas',
          container: '#bar',
          hover:     true 
        });
        return view.runAsync();
      };

      const spex = {
          "width": 400,
          "height": 400,
        
          "data": [
            {
              "name": "table",
              "values": [
                {"id": "DE", "field": de},
                {"id": "FR", "field": fr},
                {"id": "AU", "field": au},
                {"id": "ES", "field": es},
                {"id": "IT", "field": it},
                {"id": "PT", "field": pt},
                {"id": "UK", "field": uk},
                {"id": "KR", "field": kr},
                {"id": "FI", "field": fi},
                {"id": "NO", "field": no},
                {"id": "LU", "field": lu},
                {"id": "RU", "field": ru},
                {"id": "BE", "field": be},
                {"id": "CR", "field": cr},
                {"id": "NE", "field": ne},
                {"id": "HU", "field": hu},
                {"id": "IS", "field": is}
              ],
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
                  "title": "Länder",
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
      };

      let cities = [];
      $.each(data, function(key, value){
        cities.push(value.city) 
      })

      var muen = 0, lei = 0, ber = 0, ham = 0, col= 0, fra = 0, stu = 0, dus = 0, dort = 0, ess = 0, bre = 0, dre = 0, han = 0, nur = 0, boc = 0, bon = 0, mai = 0, kas = 0;
      for(var i = 0; i < cities.length; ++i){
          if(cities[i] == "MUENCHEN"){
            muen++;
          }else if(cities[i] == "LEIPZIG"){ 
            lei++
          }else if(cities[i] == "BERLIN"){
            ber++
          }else if(cities[i] == "HAMBURG"){
            ham++
          }else if(cities[i] == "KOLN"){
            col++
          }else if(cities[i] == "FRANKFURT"){
            fra++
          }else if(cities[i] == "STUTTGART"){
            stu++
          }else if(cities[i] == "DUSSELDORF"){
            dus++
          }else if(cities[i] == "DORTMUND"){
            dort++
          }else if(cities[i] == "ESSEN"){
            ess++
          }else if(cities[i] == "BREMEN"){
            bre++
          }else if(cities[i] == "DRESDEN"){
            dre++
          }else if(cities[i] == "HANOVER"){
            han++
          }else if(cities[i] == "NUREMBERG"){
            nur++
          }else if(cities[i] == "BOCHUM"){
            boc++
          }else if(cities[i] == "BONN"){
            bon++
          }else if(cities[i] == "MAINZ"){
            mai++
          }else if(cities[i] == "KASSEL"){
            kas++
          }
      }

      const spev = {
          "width": 400,
          "height": 400,
        
          "data": [
            {
              "name": "table",
              "values": [
                {"id": "MUENCHEN", "field": muen},
                {"id": "LEIPZIG", "field": lei},
                {"id": "BERLIN", "field": ber},
                {"id": "HAMBURG", "field": ham},
                {"id": "COLOGNE", "field": col},
                {"id": "FRANKFURT", "field": fra},
                {"id": "STUTTGART", "field": stu},
                {"id": "DUSSELDORF", "field": dus},
                {"id": "DORTMUND", "field": dort},
                {"id": "ESSEN", "field": ess},
                {"id": "BREMEN", "field": bre},
                {"id": "DRESDEN", "field": dre},
                {"id": "HANOVER", "field": han},
                {"id": "NUREMBERG", "field": nur},
                {"id": "BOCHUM", "field": boc},
                {"id": "BONN", "field": bon},
                {"id": "MAINZ", "field": mai},
                {"id": "KASSEL", "field": kas}
              ],
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
                  "title": "Städte",
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
    
      render3(spev);
      function render3(spec) {
        view = new vega.View(vega.parse(spec), {
          renderer:  'canvas',
          container: '#city',
          hover:     true 
        });
        return view.runAsync();
      };

      let deut = [], fran = [], aust = [], espa = [], ital= [], pto = [], uking = [], kro = [], fin = [], now = [], lux = [], rum = [], bel = [], cro = [], ned = [], hun = [], isr = [];
      $.each(data, function(key, value){
      if(value.country == "DE"){
        if(value.ecContribution != null){
          deut.push(value.ecContribution); 
        }
      }else if(value.country == "FR"){ 
        if(value.ecContribution != null){
          fran.push(value.ecContribution); 
        }
      }else if(value.country == "AU"){
        if(value.ecContribution != null){
          aust.push(value.ecContribution); 
        }
      }else if(value.country == "ES"){
        if(value.ecContribution != null){
          espa.push(value.ecContribution); 
        }
      }else if(value.country == "IT"){
        if(value.ecContribution != null){
          ital.push(value.ecContribution); 
        }
      }else if(value.country == "PT"){
        if(value.ecContribution != null){
          pto.push(value.ecContribution); 
        }
      }else if(value.country == "UK"){
        if(value.ecContribution != null){
          uking.push(value.ecContribution); 
        }
      }else if(value.country == "KR"){
        if(value.ecContribution != null){
          kro.push(value.ecContribution); 
        }
      }else if(value.country == "FI"){
        if(value.ecContribution != null){
          fin.push(value.ecContribution); 
        }
      }else if(value.country == "NO"){
        if(value.ecContribution != null){
          now.push(value.ecContribution); 
        }
      }else if(value.country == "LU"){
        if(value.ecContribution != null){
          lux.push(value.ecContribution); 
        }
      }else if(value.country == "RU"){
        if(value.ecContribution != null){
          rum.push(value.ecContribution); 
        }
      }else if(value.country == "BE"){
        if(value.ecContribution != null){
          bel.push(value.ecContribution); 
        }
      }else if(value.country == "CR"){
        if(value.ecContribution != null){
          cro.push(value.ecContribution); 
        }
      }else if(value.country == "NE"){
        if(value.ecContribution != null){
          ned.push(value.ecContribution); 
        }
      }else if(value.country == "HU"){
        if(value.ecContribution != null){
          hun.push(value.ecContribution); 
        }
      }else if(value.country == "IS"){
        if(value.ecContribution != null){
          isr.push(value.ecContribution); 
        }
      }
    })

    var deut_sum = deut.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var fran_sum = fran.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var aust_sum = aust.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var espa_sum = espa.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var ital_sum = ital.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var pto_sum = pto.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var uk_sum = uking.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var kro_sum = kro.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var fin_sum = fin.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var now_sum = now.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var lux_sum = lux.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var rum_sum = rum.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var bel_sum = bel.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var cro_sum = cro.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var ned_sum = ned.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var hun_sum = hun.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });
    var isr_sum = isr.reduce(function(prev, curr){
      return (Number(prev) || 0) + (Number(curr) || 0);
    });

     const sper = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A basic area chart example.",
      "width": 950,
      "height": 300,
      "padding": 5,
    
      "signals": [
        {
          "name": "interpolate",
          "value": "catmull-rom",
          "bind": {
            "input": "select",
            "options": [
              "basis",
              "cardinal",
              "catmull-rom",
              "linear",
              "monotone",
              "natural",
              "step",
              "step-after",
              "step-before"
            ]
          }
        }
      ],
    
      "data": [
        {
          "name": "table",
          "values": [
            {"u": "DE", "v": deut_sum},
            {"u": "FR", "v": fran_sum},
            {"u": "AU", "v": aust_sum},
            {"u": "ES", "v": espa_sum},
            {"u": "IT", "v": ital_sum},
            {"u": "PT", "v": pto_sum},
            {"u": "UK", "v": uk_sum},
            {"u": "KR", "v": kro_sum},
            {"u": "FI", "v": fin_sum},
            {"u": "NO", "v": now_sum},
            {"u": "LU", "v": lux_sum},
            {"u": "RU", "v": rum_sum},
            {"u": "BE", "v": bel_sum},
            {"u": "CR", "v": cro_sum},
            {"u": "NE", "v": ned_sum},
            {"u": "HU", "v": hun_sum},
            {"u": "IS", "v": isr_sum}
          ]
        }
      ],
    
      "scales": [
        {
          "name": "xscale",
          "type": "point",
          "range": "width",
          "domain": {"data": "table", "field": "u"}
        },
        {
          "name": "yscale",
          "type": "linear",
          "range": "height",
          "domain": {"data": "table", "field": "v"}
        }
      ],
    
      "axes": [
        {"orient": "bottom", "scale": "xscale", "tickCount": 20},
        {"orient": "left", "scale": "yscale"}
      ],
    
      "marks": [
        {
          "type": "area",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"scale": "xscale", "field": "u"},
              "y": {"scale": "yscale", "field": "v"},
              "y2": {"scale": "yscale", "value": 0},
              "fill": {"value": "steelblue"}
            },
            "update": {
              "interpolate": {"signal": "interpolate"},
              "fillOpacity": {"value": 1}
            },
            "hover": {
              "fillOpacity": {"value": 0.5}
            }
          }
        }
      ]
    };

      render4(sper);
      function render4(spec) {
        view = new vega.View(vega.parse(spec), {
          renderer:  'canvas',
          container: '#area',
          hover:     true 
        });
        return view.runAsync();
      };
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