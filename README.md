# view amp for alfresco share (overlay on share.war)
(config modified according to [this page](http://blog.productivist.com/setting-up-a-dual-amp-maven-project/))

To build the amp file, do

	mvn package -P mbee-dev
	
To run in embedded jetty container

	mvn integration-test -Pamp-to-war
	
To clean all data and artifacts

	mvn clean -Ppurge

Note that for Alfresco 4.2.e the URLs have changed to match the deployed application (E.g., share instead of view-share).

Go to [http://localhost:8081/share/](http://localhost:8081/share/) for the share interface (start the view-repo server first!)