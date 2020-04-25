## Initial setup

The following steps are required to run the project properly:

+ run a localhost server, any server works but we suggest `localhost:8080`
* run apache-tomcat server `localhost:8080` to run the pages local.

## Apache-tomcat Server

If you want to use another localhost server, make sure to change the links in HTML files.
to run apache server, you will find "startup.sh" file in bin folder.

    ./startup.sh

to disconnect apache server, you will find "shutdown.sh" file in bin folder.

     ./shutdown.sh

check this link for more info: `https://www.mulesoft.com/tcat/tomcat-start`

## Libraries

The libraries were added and used are:
* bootstrap.
* vega
* vega-lite
* vega-embed
* jquery.js
* jsonld
* rdflib