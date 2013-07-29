# view amp for alfresco share (overlay on share.war)
(config modified according to [this page](http://blog.productivist.com/setting-up-a-dual-amp-maven-project/))

To build the amp file, do

	mvn package
	
To run in embedded jetty container

	mvn integration-test -Pamp-to-war
	
To clean all data and artifacts

	mvn clean -Ppurge
	
Go to [http://localhost:8081/view-share/](http://localhost:8081/view-share/) for the share interface (start the view-repo server first!)