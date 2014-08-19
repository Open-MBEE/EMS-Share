function main()
{
   var uri = args.docwebURI,
      docwebTitle = '',
      isDefault = false;

   //if (!uri)
   //{
      // Use the default
	   //TODO make Url relative.../afresco/mmsappbeta/portal.html
	   //uri = "https://ems.jpl.nasa.gov/alfresco/mmsappbeta/portal.html";
	   //docwebTitle = "Docweb Portal";
	   //isDefault = true;
      /*var conf = new XML(config.script);
      uri = conf.uri[0].toString();
      isDefault = true;*/
   //}
   
   var siteName = page.url.templateArgs.site;
   if (siteName)
   {
	   try{
		   var cfg = config.global;
		   uri = cfg.share.protocl + '://' + cfg.share.host + cfg.share.port + '/alfresco/mmsapp/docweb.html#/sites/' + siteName;
	   }
	   catch(error){
		   uri = 'https://ems.jpl.nasa.gov/alfresco/mmsapp/docweb.html#/sites/' + siteName;
	   }
	   docwebTitle = siteName + ' Docweb';
   }
   else{
	 //TODO make Url relative.../afresco/mmsappbeta/portal.html
	   uri = 'https://ems.jpl.nasa.gov/alfresco/mmsappbeta/portal.html';
	   docwebTitle = 'Docweb Portal';
   }
    
   /*if (args.docwebTitle)
   {
      docwebTitle = args.docwebTitle;
   }*/

   var height = args.height;
   if (!height)
   {
      height = "";
   }

   var re = /^(http|https):\/\//;

   if (!isDefault && !re.test(uri))
   {
      uri = "http://" + uri;
   }

   model.docwebTitle = docwebTitle;
   model.uri = uri;
   model.height = height;
   model.isDefault = isDefault;

   /*var userIsSiteManager = true;
   if (page.url.templateArgs.site)
   {
      // We are in the context of a site, so call the repository to see if the user is site manager or not
      userIsSiteManager = false;
      var json = remote.call("/api/sites/" + page.url.templateArgs.site + "/memberships/" + encodeURIComponent(user.name));

      if (json.status == 200)
      {
         var obj = eval('(' + json + ')');
         if (obj)
         {
            userIsSiteManager = (obj.role == "SiteManager");
         }
      }
   }
   model.userIsSiteManager = userIsSiteManager;*/
   
   // Widget instantiation metadata...
   var docWeb = {
      id : "DocWeb", 
      name : "Alfresco.dashlet.DocWeb",
      assignTo : "docWeb",
      options : {
         componentId : instance.object.id,
         docwebURI : model.uri,
         docwebTitle : model.docwebTitle,
         docwebHeight : model.height,
         isDefault : model.isDefault
      }
   };

   var dashletResizer = {
      id : "DashletResizer", 
      name : "Alfresco.widget.DashletResizer",
      initArgs : ["\"" + args.htmlid + "\"", "\"" + instance.object.id + "\""],
      useMessages: false
   };

   var actions = [];
   if (model.userIsSiteManager)
   {
      actions.push(
      {
         cssClass: "edit",
         eventOnClick: {
            _alfValue : "editDocWebDashletEvent" + args.htmlid.replace(/-/g, "_"),
            _alfType: "REFERENCE"
         }, 
         tooltip: msg.get("dashlet.edit.tooltip")
      });
   }
   actions.push({
      cssClass: "help",
      bubbleOnClick:
      {
         message: msg.get("dashlet.help")
      },
      tooltip: msg.get("dashlet.help.tooltip")
   });
   
   var dashletTitleBarActions = {
      id : "DashletTitleBarActions", 
      name : "Alfresco.widget.DashletTitleBarActions",
      useMessages : false,
      options : {
         actions: actions
      }
   };
   model.widgets = [docWeb, dashletResizer, dashletTitleBarActions];
}

main();
