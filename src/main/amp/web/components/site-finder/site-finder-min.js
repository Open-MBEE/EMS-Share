(function(){var b=YAHOO.util.Dom,y=YAHOO.util.Event,l=YAHOO.util.KeyListener;var r=Alfresco.util.encodeHTML;Alfresco.SiteFinder=function(z){Alfresco.SiteFinder.superclass.constructor.call(this,"Alfresco.SiteFinder",z,["button","container","datasource","datatable","json"]);this.buttons=[];this.searchTerm="";this.memberOfSites={};this.pendingInvites={};YAHOO.Bubbling.on("siteDeleted",this.onSiteDeleted,this);return this};YAHOO.extend(Alfresco.SiteFinder,Alfresco.component.Base,{options:{minSearchTermLength:0,maxSearchResults:100,currentUser:"",inviteData:[],setFocus:false},buttons:null,searchTerm:null,memberOfSites:null,pendingInvites:null,onReady:function c(){var F=this;var E=this.options.inviteData,A;for(i=0,j=E.length;i<j;i++){A=E[i];this.pendingInvites[A.siteId]=A.id;this.memberOfSites[A.siteId]="PENDING"}var D=Alfresco.constants.PROXY_URI+"api/sites?roles=user&";this.widgets.dataSource=new YAHOO.util.DataSource(D,{responseType:YAHOO.util.DataSource.TYPE_JSON,connXhrMode:"queueRequests",responseSchema:{resultsList:"items"}});this.widgets.dataSource.doBeforeParseData=function z(G,U){var J=U;if(U){var P=[];if(F.searchTerm.length===0){P=U}else{var V,R,T,N,O;for(var S=0,Q=U.length;S<Q;S++){V=U[S];R=V.shortName;T=V.title;N=V.visibility;O=V.isMemberOfGroup;P.push(V)}}P.sort(function(X,W){return(X.title>W.title)?1:(X.title<W.title)?-1:0});var H,M,L,K,I;for(M=0,L=P.length;M<L;M++){P[M].isSiteManager=(P[M].siteRole==="SiteManager")}J={items:P}}return J};this._setupDataTable();this.widgets.searchButton=Alfresco.util.createYUIButton(this,"button",this.doSearch);var C=b.get(this.id+"-term"),B=new l(C,{keys:13},{fn:function(){F.doSearch()},scope:this,correctScope:true},"keydown").enable();if(this.options.setFocus){C.focus()}b.setStyle(this.id+"-body","visibility","visible")},_setupDataTable:function s(){var B=this;renderCellThumbnail=function C(I,H,J,L){var F=H.getData("shortName"),G=Alfresco.constants.URL_PAGECONTEXT+"site/"+F+"/dashboard",K=r(H.getData("title"));I.innerHTML='<a href="'+G+'"><img src="'+Alfresco.constants.URL_RESCONTEXT+'components/site-finder/images/site-64.png" alt="'+K+'" title="'+K+'" /></a>'};renderCellDescription=function A(J,I,K,L){var F=I.getData("visibility").toUpperCase(),G=Alfresco.constants.URL_PAGECONTEXT+"site/"+I.getData("shortName")+"/dashboard";var H='<h3 class="sitename"><a href="'+G+'" class="theme-color-1">'+r(I.getData("title"))+"</a></h3>";H+='<div class="sitedescription">'+r(I.getData("description"))+"</div>";if(F=="MODERATED"){H+='<span class="visibility theme-color-3 theme-bg-color-1">'+B.msg("site-finder.moderated")+"</span>"}else{if(F=="PRIVATE"){H+='<span class="visibility theme-color-3 theme-bg-color-1">'+B.msg("site-finder.private")+"</span>"}}J.innerHTML=H};renderCellActions=function z(P,S,J,G){var K=S.getData("visibility").toUpperCase(),M=S.getData("shortName"),O=S.getData("isSiteManager"),N=r(S.getData("title")),F=S.getData("siteRole")!=="";var R=(F&&O);var H='<span id="'+B.id+"-button-"+M+'"></span>';if(R){H='<span id="'+B.id+"-deleteButton-"+M+'"></span>&nbsp;'+H}P.innerHTML=H;if(R){var L=new YAHOO.widget.Button({container:B.id+"-deleteButton-"+M});L.set("label",B.msg("site-finder.delete"));L.set("onclick",{fn:B.doDelete,obj:{shortName:M,title:N},scope:B})}var I=new YAHOO.widget.Button({container:B.id+"-button-"+M,disabled:S.getData("isMemberOfGroup")});switch(K){case"PUBLIC":if(F){I.set("label",B.msg("site-finder.leave"));I.set("onclick",{fn:B.doLeave,obj:{shortName:M,title:N},scope:B})}else{I.set("label",B.msg("site-finder.join"));I.set("onclick",{fn:B.doJoin,obj:{shortName:M,title:N},scope:B})}B.buttons[M]={button:I};break;case"PRIVATE":if(F){I.set("label",B.msg("site-finder.leave"));I.set("onclick",{fn:B.doLeave,obj:{shortName:M,title:N},scope:B});B.buttons[M]={button:I};break}case"MODERATED":if(F){I.set("label",B.msg("site-finder.leave"));I.set("onclick",{fn:B.doLeave,obj:{shortName:M,title:N},scope:B})}else{if(B.memberOfSites[M]=="PENDING"){var Q=false;for(i=0;i<B.options.inviteData.length;i++){if(B.options.inviteData[i].siteId==M){if(B.options.inviteData[i].type!="MODERATED"){Q=true}break}}if(!Q){I.set("label",B.msg("site-finder.cancel-request"));I.set("onclick",{fn:B.doCancelRequest,obj:{shortName:M,title:N},scope:B})}else{P.innerHTML="<div></div>"}}else{I.set("label",B.msg("site-finder.request-join"));I.set("onclick",{fn:B.doRequestJoin,obj:{shortName:M,title:N},scope:B})}}B.buttons[M]={button:I};break;default:P.innerHTML="<div></div>";break}};var E=[{key:"shortName",label:"Short Name",sortable:false,formatter:renderCellThumbnail},{key:"description",label:"Description",sortable:false,formatter:renderCellDescription},{key:"button",label:"Actions",formatter:renderCellActions}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-sites",E,this.widgets.dataSource,{renderLoopSize:32,initialLoad:false,MSG_EMPTY:this.msg("message.instructions")});this.widgets.dataTable.subscribe("rowDeleteEvent",this.onRowDeleteEvent,this,true);this.widgets.dataTable.doBeforeLoadData=function D(G,H,J){if(H.error){try{var F=YAHOO.lang.JSON.parse(H.responseText);this.widgets.dataTable.set("MSG_ERROR",F.message)}catch(I){B._setDefaultDataTableErrors(B.widgets.dataTable)}}else{if(H.results){if(H.results.length===0){B.widgets.dataTable.set("MSG_EMPTY",'<span style="white-space: nowrap;">'+B.msg("message.empty")+"</span>")}B.renderLoopSize=Alfresco.util.RENDERLOOPSIZE}}return true}},doSearch:function d(){this.searchTerm=YAHOO.lang.trim(b.get(this.id+"-term").value);if(this.searchTerm.replace(/\*/g,"").length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:parent._msg("message.minimum-length",this.options.minSearchTermLength)});return}this.searchTerm = '*' + this.searchTerm + '*';this._performSearch(this.searchTerm)},_failureCallback:function k(A,z){this._clearFeedbackMessage();if(z){Alfresco.util.PopupManager.displayPrompt({title:Alfresco.util.message("message.failure"),text:z})}},doJoin:function w(B,A){var z=this.options.currentUser;Alfresco.util.Ajax.jsonPut({url:Alfresco.constants.PROXY_URI+"api/sites/"+A.shortName+"/memberships",dataObj:{role:"SiteConsumer",person:{userName:z}},successCallback:{fn:this._joinSuccess,obj:A,scope:this},failureCallback:{fn:this._failureCallback,obj:this.msg("site-finder.join-failure",this.options.currentUser,A.title),scope:this}})},_joinSuccess:function x(z,A){Alfresco.util.PopupManager.displayMessage({text:this.msg("site-finder.join-success",this.options.currentUser,A.title)});this.doSearch()},doLeave:function f(B,A){var z=this.options.currentUser;Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/sites/"+A.shortName+"/memberships/"+encodeURIComponent(z),method:"DELETE",successCallback:{fn:this._leaveSuccess,obj:A,scope:this},failureCallback:{fn:this._failureCallback,obj:this.msg("site-finder.leave-failure",this.options.currentUser,A.title),scope:this}})},_leaveSuccess:function u(z,A){delete this.memberOfSites[A.shortName];Alfresco.util.PopupManager.displayMessage({text:this.msg("site-finder.leave-success",this.options.currentUser,A.title)});this.doSearch()},doRequestJoin:function n(B,A){var z=this.options.currentUser;this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:this.msg("message.please-wait"),spanClass:"wait",displayTime:0});Alfresco.util.Ajax.jsonRequest({url:Alfresco.constants.PROXY_URI+"api/sites/"+A.shortName+"/invitations",method:"POST",dataObj:{invitationType:"MODERATED",inviteeUserName:z,inviteeComments:"",inviteeRoleName:"SiteConsumer"},successCallback:{fn:this._requestJoinSuccess,obj:A,scope:this},failureCallback:{fn:this._failureCallback,obj:this.msg("site-finder.request-join-failure",this.options.currentUser,A.title),scope:this}})},_requestJoinSuccess:function t(z,A){var B=z.json.data,C=A.shortName;this.memberOfSites[C]="PENDING";this.pendingInvites[C]=B.inviteId;Alfresco.util.PopupManager.displayMessage({text:this.msg("site-finder.request-join-success",this.options.currentUser,A.title)});this.doSearch()},doCancelRequest:function v(B,A){var z=this.options.currentUser,C=A.shortName;this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:this.msg("message.please-wait"),spanClass:"wait",displayTime:0});Alfresco.util.Ajax.jsonRequest({url:Alfresco.constants.PROXY_URI+"api/sites/"+C+"/invitations/"+encodeURIComponent(this.pendingInvites[C]),method:"DELETE",successCallback:{fn:this._cancelRequestSuccess,obj:A,scope:this},failureCallback:{fn:this._failureCallback,obj:this.msg("site-finder.cancel-request-failure",this.options.currentUser,A.title),scope:this}})},_cancelRequestSuccess:function h(z,A){this.memberOfSites[A.shortName]="MODERATED";Alfresco.util.PopupManager.displayMessage({text:this.msg("site-finder.cancel-request-success",this.options.currentUser,A.title)});this.doSearch()},doDelete:function p(A,z){Alfresco.module.getDeleteSiteInstance().show({site:z})},_setDefaultDataTableErrors:function e(z){var A=Alfresco.util.message;z.set("MSG_EMPTY",A("message.empty","Alfresco.SiteFinder"));z.set("MSG_ERROR",A("message.error","Alfresco.SiteFinder"))},_clearFeedbackMessage:function m(){if(this.widgets.feedbackMessage){try{this.widgets.feedbackMessage.destroy()}catch(z){}this.widgets.feeedbackMessage=null}},_performSearch:function o(A){this._setDefaultDataTableErrors(this.widgets.dataTable);this.widgets.dataTable.set("MSG_EMPTY",Alfresco.util.message("site-finder.searching","Alfresco.SiteFinder"));this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength());var F=null;var D=function G(){F=Alfresco.util.PopupManager.displayMessage({displayTime:0,text:'<span class="wait">'+r(this.msg("message.loading"))+"</span>",noEscape:true})};var B=YAHOO.lang.later(2000,this,D);var E=function H(I,J,K){this.widgets.searchButton.set("disabled",false);if(B){B.cancel()}if(F){F.destroy()}this.searchTerm=A;this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,I,J,K)};var z=function C(J,K){this.widgets.searchButton.set("disabled",false);if(B){B.cancel()}if(F){F.destroy()}if(K.status==401){window.location.reload()}else{try{var I=YAHOO.lang.JSON.parse(K.responseText);this.widgets.dataTable.set("MSG_ERROR",I.message);this.widgets.dataTable.showTableMessage(I.message,YAHOO.widget.DataTable.CLASS_ERROR)}catch(L){this._setDefaultDataTableErrors(this.widgets.dataTable)}}};this.widgets.dataSource.sendRequest(this._buildSearchParams(A),{success:E,failure:z,scope:this});this.widgets.searchButton.set("disabled",true)},_buildSearchParams:function a(z){var A=YAHOO.lang.substitute("size={maxResults}&nf={term}",{maxResults:this.options.maxSearchResults,term:encodeURIComponent(z)});return A},onSiteDeleted:function q(E,C){var B=C[1].site;var A=this.widgets.dataTable.getRecordSet();var F=A.getLength();for(var D=0;D<F;D++){var z=A.getRecord(D);if(z.getData("shortName")==B.shortName){this.widgets.dataTable.deleteRow(z)}}if(A.getLength()==0){this.widgets.dataTable.set("MSG_EMPTY",Alfresco.util.message("message.empty","Alfresco.SiteFinder"))}},onRowDeleteEvent:function g(z){if(this.widgets.dataTable.getRecordSet().getLength()===0){this.widgets.dataTable.showTableMessage(this.msg("site-finder.enter-search-term",this.name),"siteFinderTableMessage")}}})})();