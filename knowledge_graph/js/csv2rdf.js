$(function(){

    //get dataset for all Data informations as rdf
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://cordis.europa.eu/data/cordis-h2020organizations.csv"; 
    fetch(proxyurl+ url)
    .then(response => response.text())
    .then(contents => convert_to_rdf(contents))
    .catch((e) => console.log(e))
  
     //convert csv data to rdf
   function convert_to_rdf(csvData){
        let Data = csvData.split('\n').map(row => row.trim());
        let headings = Data[0].split(';');
        let rdf = `<?xml version="1.0" encoding="UTF-8"?>
        <rdf:RDF
        xmlns:adms="http://www.w3.org/ns/adms#"
        xmlns:dcat="http://www.w3.org/ns/dcat#"
        xmlns:dcatapop="http://data.europa.eu/88u/ontology/dcatapop#"
        xmlns:dcterms="http://purl.org/dc/terms/"
        xmlns:foaf="http://xmlns.com/foaf/0.1/"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:schema="http://schema.org/"
        xmlns:vcard="http://www.w3.org/2006/vcard/ns#"\n`;
    
        for(let i = 1; i < Data.length; i++) {
            let details = Data[i].split(';');
            rdf += `<rdf:Description rdf:about="http://data.europa.eu/88u/distribution/82d8d2c8-5a88-4e28-8f2e-6b6678a0e679">\n`;
            for(let j = 0; j < headings.length; j++) {
              if(headings[j] == "id" || headings[j] == "ecContribution" || headings[j] == "vatNumber" ||  headings[j] == "projectRcn" || headings[j] == "projectID" || headings[j] == "contactTelephoneNumber" || headings[j] == "contactFaxNumber "){
                rdf += `<dcatapop:${headings[j]} rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">${details[j]}</dcatapop:${headings[j]}>\n`;
              }
              else if(headings[j] == "contactForm" || headings[j] == "organizationUrl"){
                rdf += `<dcat:${headings[j]} rdf:resource="${details[j]}">${details[j]}</dcat:${headings[j]}>\n`;
              }
              else if(headings[j] == "activityType"){
                rdf += `<rdf:${headings[j]}>${details[j]}</rdf:${headings[j]}>\n`;
              } 
              else if(headings[j] == "projectAcronym" || headings[j] == "role" || headings[j] == "endOfParticipation"){
                rdf += `<dcterms:${headings[j]} xml:lang="en">${details[j]}</dcterms:${headings[j]}>\n`;
              }
              else{
                rdf += `<dcterms:${headings[j]} xml:lang="de">${details[j]}</dcterms:${headings[j]}>\n`;
                
              }
            }
            rdf += "</rdf:Description>\n"
          }
        rdf += "</rdf:RDF>\n"
        //console.log(rdf);
    };
});