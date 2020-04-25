$(function(){

    //get dataset for all Data informations as rdf
    const url = "https://cordis.europa.eu/data/cordis-h2020organizations.csv"; 
    fetch(url)
    .then(response => response.text())
    .then(contents => convert_to_rdf(contents))
    .catch((e) => console.log(e))
    
    //convert csv data to rdf
    function convert_to_rdf(csvData){
        console.log("csv data" + csvData);
        
        let Data = csvData.split('\n').map(row => row.trim());
        let headings = Data[0].split(';');
        let rdf = ``;

        for(let i = 1; i < Data.length; i++) {
        let details = Data[i].split(';');
        rdf += `<rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:si="https://www.w3schools.com/rdf/">`
        for(let j = 0; j < headings.length; j++) {
            rdf += `<${headings[j]}>${details[j]}</${headings[j]}>
            `;
        }
        rdf += "</rdf:RDF>\n"
        }
        console.log("rdf data" + rdf);
    };

    //store the Data in graph  
    function graph(data){
    };
  
    //extract the Data from the graph
    function read_graph(store){
    };
  
    //Display the Knowledgegraph
    function visualization(data){  
    };
  });