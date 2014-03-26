<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link href="${url.context}/res/components/discussions/replies.css" group="discussions"/>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script src="${url.context}/res/components/discussions/replies.js" group="discussions"/>
   <@script type="text/javascript" src="${url.context}/res/modules/editors/tiny_mce/plugins/asciimath/js/ASCIIMathML.js"/>
</@>

<@markup id="widgets">
   <@createWidgets group="discussions"/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
     <div id="${args.htmlid}-replies-root" class="indented hidden"></div>
   </@>
</@>


