function init_form(){bool_fields=["scaned","spam","highspam","saspam","rblspam","whitelisted","blacklisted","virusinfected","nameinfected","otherinfected","isquarantined"];num_fields=["size","sascore"];text_fields=["id","from_address","from_domain","to_address","to_domain","subject","clientip","spamreport","headers"];time_fields=["date","time"];num_values=[{value:1,opt:gettext("is equal to")},{value:2,opt:gettext("is not equal to")},{value:3,opt:gettext("is greater than")},{value:4,opt:gettext("is less than")}];text_values=[{value:1,opt:gettext("is equal to")},{value:2,opt:gettext("is not equal to")},{value:9,opt:gettext("is null")},{value:10,opt:gettext("is not null")},{value:5,opt:gettext("contains")},{value:6,opt:gettext("does not contain")},{value:7,opt:gettext("matches regex")},{value:8,opt:gettext("does not match regex")}];time_values=[{value:1,opt:gettext("is equal to")},{value:2,opt:gettext("is not equal to")},{value:3,opt:gettext("is greater than")},{value:4,opt:gettext("is less than")}];bool_values=[{value:11,opt:gettext("is true")},{value:12,opt:gettext("is false")}];dojo.place('<option value="0" selected="0">'+gettext("Please select")+"</option>","id_filtered_field","first");dojo.attr("id_filtered_value","disabled","disabled");select_field=dojo.query("#id_filtered_field");select_field.onchange(function(a){var b=dojo.byId("id_filtered_field").value;if(dojo.indexOf(bool_fields,b)!=-1){dojo.empty("id_filtered_by");dojo.forEach(bool_values,function(d,c){dojo.create("option",{value:d.value,innerHTML:d.opt},"id_filtered_by","last")});dojo.attr("id_filtered_value","disabled","disabled");dojo.byId("id_filtered_value").value=""}if(dojo.indexOf(num_fields,b)!=-1){dojo.empty("id_filtered_by");dojo.forEach(num_values,function(d,c){dojo.create("option",{value:d.value,innerHTML:d.opt},"id_filtered_by","last")});dojo.removeAttr("id_filtered_value","disabled");dojo.byId("id_filtered_value").value=""}if(dojo.indexOf(text_fields,b)!=-1){dojo.empty("id_filtered_by");dojo.forEach(text_values,function(d,c){dojo.create("option",{value:d.value,innerHTML:d.opt},"id_filtered_by","last")});dojo.removeAttr("id_filtered_value","disabled");dojo.byId("id_filtered_value").value=""}if(dojo.indexOf(time_fields,b)!=-1){dojo.empty("id_filtered_by");dojo.forEach(time_values,function(d,c){dojo.create("option",{value:d.value,innerHTML:d.opt},"id_filtered_by","last")});dojo.removeAttr("id_filtered_value","disabled");if(b=="time"){dojo.byId("id_filtered_value").value="HH:MM"}if(b=="date"){dojo.byId("id_filtered_value").value="YYYY-MM-DD"}}})}function build_filters(a){var b=[];var c=0;dojo.forEach(a,function(e,d){b[c++]='<a href="/reports/fd/'+d+'/"><img src="'+media_url+'imgs/sm-del.png" alt="[x]"/></a>';b[c++]='&nbsp;"'+e.filter_field+" "+e.filter_by+" "+e.filter_value+'"'});return b.join("")}function remove_filter(c,b){c.preventDefault();dojo.attr("filter_form_submit",{disabled:"disabled",value:"Loading"});dojo.style("my-spinner","display","block");var a=dojo.attr(b,"href");dojo.xhrGet({url:a,handleAs:"json",load:function(d){process_response(d)}})};