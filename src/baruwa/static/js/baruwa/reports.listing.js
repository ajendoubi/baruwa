dojo.require("dojox.charting.Chart2D");dojo.require("dojox.charting.action2d.Highlight");dojo.require("dojox.charting.action2d.Magnify");dojo.require("dojox.charting.action2d.Shake");dojo.require("dojox.charting.action2d.Tooltip");dojo.require("dojox.charting.widget.Legend");dojo.require("dojox.charting.axis2d.Invisible");dojo.require("dojox.charting.axis2d.Default");function build_rows(a){var d=[];var b=0;var e="LightBlue_div";dojo.forEach(a,function(f,c){if(e=="LightBlue_div"){e="LightGray_div"}else{e="LightBlue_div"}d[b++]='<div class="'+e+'">';d[b++]='<div class="totals_date">'+f.date+"</div>";d[b++]='<div class="totals_mail">'+f.mail_total+"</div>";d[b++]='<div class="totals_virii">'+f.virus_total+"</div>";d[b++]='<div class="totals_viriip">'+f.virus_percent+"</div>";d[b++]='<div class="totals_spam">'+f.spam_total+"</div>";d[b++]='<div class="totals_spamp">'+f.spam_percent+"</div>";d[b++]='<div class="totals_volume">'+filesizeformat(f.size_total)+"</div>";d[b++]="</div>"});return d.join("")}function process_response(c){var d=dojo.byId("my-spinner");d.innerHTML=gettext("Processing...........");if(c.success==true){url=window.location.pathname;var a=build_filters(c.active_filters);dojo.empty("fhl");if(a!=""){dojo.place(a,"fhl","last");dojo.removeClass("filterrow","hide")}else{dojo.addClass("filterrow","hide")}dojo.query("#fhl a").onclick(function(f){remove_filter(f,this)});dojo.xhrGet({url:url,handleAs:"json",load:function(e){dojo.empty("graphrows");var f=build_rows(e.items);dojo.place(f,"graphrows","last");chart.updateSeries("mail",e.pie_data.mail);chart.updateSeries("spam",e.pie_data.spam);chart.updateSeries("virii",e.pie_data.virii);chart.updateSeries("volume",e.pie_data.volume);chart.render();d.innerHTML="";dojo.style("my-spinner","display","none");dojo.attr("filter_form_submit",{value:gettext("Add")});dojo.removeAttr("filter_form_submit","disabled");window.scrollTo(0,0)}})}else{dojo.destroy("filter-error");dojo.create("div",{id:"filter-error",innerHTML:c.errors+'<div id="dismiss"><a href="#">'+gettext("Dismiss")+"</a></div>"},"afform","before");var b=setTimeout(function(){dojo.destroy("filter-error")},15050);dojo.query("#dismiss a").onclick(function(){clearTimeout(b);dojo.destroy("filter-error")});d.innerHTML="";dojo.style("my-spinner","display","none");dojo.attr("filter_form_submit",{value:gettext("Add")});dojo.removeAttr("filter_form_submit","disabled")}}dojo.addOnLoad(function(){init_form();dojo.query("#filter-form").onsubmit(function(f){f.preventDefault();dojo.attr("filter_form_submit",{disabled:"disabled",value:gettext("Loading")});dojo.style("my-spinner","display","block");dojo.destroy("filter-error");dojo.xhrPost({form:"filter-form",handleAs:"json",load:function(g){process_response(g)}})});dojo.query("#fhl a").onclick(function(f){remove_filter(f,this)});var b=dojox.charting;var c=450;chart=new dojox.charting.Chart2D("chart");chart.addAxis("x",{labels:labels,majorTickStep:10});chart.addAxis("y",{vertical:true});chart.addAxis("vol_x",{type:"Invisible",leftBottom:false});chart.addAxis("vol_y",{type:"Invisible",vertical:true,leftBottom:false});chart.addPlot("default",{type:"ClusteredColumns",gap:2});chart.addPlot("other",{type:"Areas",hAxis:"vol_x",vAxis:"vol_y"});chart.addSeries("mail",mail_data,{stroke:{color:"black"},fill:"green"});chart.addSeries("spam",spam_data,{stroke:{color:"black"},fill:"pink"});chart.addSeries("virii",virii_data,{stroke:{color:"black"},fill:"red"});chart.addSeries("volume",volume_data,{plot:"other",stroke:{color:"blue"},fill:"lightblue"});var a=new b.action2d.Highlight(chart,"default",{duration:c,easing:dojo.fx.easing.sineOut});var e=new b.action2d.Tooltip(chart,"default");chart.render();var d=new dojox.charting.widget.Legend({chart:chart},"mail_legend")});