/*
 * reset pagination Generated cookies
 * Invoke this function on the login button
*/
function resetPaginationCookiesOnFirstLoad() {
    var cookies = document.cookie.split(";");
    for(var i=0; i < cookies.length; i++) {
        var cookieName = cookies[i].split("=");
        var paginationCookie = cookieName[0].split("--");
        if(paginationCookie[1] == "cookie") {
        	jQuery.cookie(cookieName[0], null, {path: "/"});
        }
    }
}
    
jQuery(document).ready(function() {
	// init paginateMe
	jQuery("#thetable").paginateMe({colToSort: "1", excludeRow: "title"});
	jQuery("#rodan").paginateMe({excludeRow: "title"});
	jQuery("#ken").paginateMe({colToSort: "5", excludeRow: "title"});
});

(function($) {
    $.fn.paginateMe = function(options) {
        var me = this;
        var selector = me.attr('id');
        var s = $.extend({
	        'tblList'   :  selector+'List-nav',
	        'tmpList'   :  selector+"List",
	        'colToSort' :  '0', // default to sort the First Column of the lists
	        'excludeRow':  '', // exclude rows with these selectors
	        'placeNavTo':  '' // place the pagination links in the specified selector
	    },options);
	    var col = s.colToSort - 1;
	    var sortByColNum = col < 0 ? 0 : col;
    
	    // exclude rows(tr) with the class provided on the option
	    var splitExClass = s.excludeRow.split(",");
	    var tmpClass = "", ctr = 0;
	    for(var i=1;i<=splitExClass.length;i++) {
	        tmpClass += "."+splitExClass[ctr]+",";
	        ctr++;
	    }
	    var trimmedSetOfClass = tmpClass.replace(/\s/g, "");
	    var excluderow = trimmedSetOfClass.slice(0, -1);
    
	    /*
	     * Create Required Elements
	     * These next two lines cannot be changed
	    */
	    if(s.placeNavTo == "") {
	        me.before("<div id='"+s.tblList+"'></div>");
	    } else {
	        $(s.placeNavTo).prepend("<div id='"+s.tblList+"'></div>");
	    }
	    $("body").prepend("<ul id='"+s.tmpList+"' style='position: absolute; top: 3000'></ul>");
    
	    // hide the table rows by default
	    me.find("tr:not('"+excluderow+"')").hide();
    
	    var lists = "";
	    me.find("tr:not('"+excluderow+"')").find("td:eq("+sortByColNum+")").each(function() {
	        var txt = $(this).text();
	        for(var i=0;i<=lists.length;i++) {
	        	$("#"+s.tmpList).prepend("<li>"+txt+"</li>");
	        }
	    });
    
	    $('#'+s.tmpList).listnav({
		    includeAll   :  false,
		    includeNums  :  false,
		    showCounts   :  false
	    });
    
	    $("#"+s.tblList).find(".ln-letters a").click(function() {
		    var cls = $(this).attr("class");
		    var splCls = cls.split(" ");
		    $.cookie(selector+"--cookie", splCls[0], {path: "/"});
		    
		    // hide all rows before showing the list that starts from the selected letter
		    me.find("tr:not('"+excluderow+"')").hide();
		    
		    // display list starting from the selected letter on the pagination
		    tableSort(s.tmpList, selector);
	    });
    
	    /*
	     * check if the pagination cookie has a value
	     * if it already has a value, the page will stay on the selected letter when the page is refreshed
	     * if not, the pagination will find the first letter that has available list and trigger it
	    */
	    var navSelected = $.cookie(selector+"--cookie");
	    $("#"+s.tblList).find(navSelected ? "a."+navSelected : "a."+triggerNext()).trigger("click");
	    function triggerNext() {
	        var cName = $("#"+s.tblList).find("a:not('.ln-disabled')").attr("class");
	        return cName[0];
	    }
    
	    // Sort the LIST - show only List that starts from the Letter that is selected
	    function tableSort(ml,obj) {
	        var listText = new Array();
	        var ctr = 0;
	        $("#"+ml).find("li").each(function() {
	            if($(this).is(":visible")) {
	                listText[ctr] = $.trim($(this).text());
	                $('#'+obj).find("tr:not('"+excluderow+"')").each(function() {
	                    var tdTxt = $.trim($(this).find("td:eq("+sortByColNum+")").text());
	                    if(listText[ctr] == tdTxt) {
	                    	$(this).show().find("td:eq("+sortByColNum+")").css("color", "blue");
	                    }
	                });
	                ctr++;
	            }
	        });
	    }
    };
})(jQuery);