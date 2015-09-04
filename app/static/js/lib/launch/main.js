
navCategories = {
    "Hortonworks Tutorials": {
        "starter"     : "Get Started",
        "dive_in"     : "Dive In"
    },
    "Tags": {
        "manage"      : "Manage",
        "analyze"     : "Analyze",
        "develop"     : "Develop",
        "operate"     : "Operate"
    },
    "Technology": {
        "pig"         : "Pig",
        "hive"        : "Hive",
        "hcatalog"    : "HCatalog",
        "sqoop"       : "Sqoop",
        "flume"       : "Flume",
        "mahout"      : "Mahout",
        "ambari"      : "Ambari",
        "zoo"         : "Zookeeper",
        "oozie"       : "Oozie"
    },
    "Partner Tutorials": {
        "biztools"    : "Business Tools",
        "data_manage" : "Data Management",
        "data_move"   : "Data Movement and Integration",
        "dev_tools"   : "Development Tools",
        "sys_tools"   : "System Tools"
    }
};

navMap =
[
    {
        "id" : "101" ,
        "tutorial" : "Hello World - Using the Hortonworks Sandbox with Hive and Pig",
        "categories" : {
            "starter"   : "Getting Started",
            "dive_in" : "Dive In",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "102" ,
        "tutorial" : "Data Processing with Pig - Processing Baseball Stats With Pig",
        "categories" : {
            "starter"   : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "103" ,
        "tutorial" : "Data Processing With Hive - Processing Baseball Stats With Hive",
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "104" ,
        "tutorial" : "HCatalog, Basic Pig & Hive Commands" ,
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "105" ,
        "tutorial" : "Using Basic Pig Commands" ,
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "106" ,
        "tutorial" : "Loading Data into the Hortonworks Sandbox" ,
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "107" ,
        "tutorial" : "Installing and Configuring the Hortonworks ODBC driver on Windows 7" ,
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "operate" : "Operate",
            "develop" : "Develop"
        }
    },
    {
        "id" : "108" ,
        "tutorial" :  "Using Excel 2013 to Access Sandbox Data",
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "109" ,
        "tutorial" : "Using Excel 2013 to Analyze Sandbox Data" ,
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "110" ,
        "tutorial" : "Visualizing Website Clickstream Data" ,
        "categories" : {
            "dive_in" : "Dive In",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },            
    {
        "id" : "111" ,
        "tutorial" : "Installing and Configuring the Hortonworks ODBC driver on Mac OS X" ,
        "categories" : {
            "starter" : "Getting Started",
            "analyze" : "Analyze",
            "operate" : "Operate",
            "develop" : "Develop"
        }
    },
    {
        "id" : "112" ,
        "tutorial" : "Refining and Visualizing Server Log Data" ,
        "categories" : {
            "dive_in" : "Dive In",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "113" ,
        "tutorial" : "Refining and Visualizing Sentiment Data" ,
        "categories" : {
            "dive_in" : "Dive In",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },             
    {
        "id" : "114" ,
        "tutorial" : "Analyzing Machine and Sensor Data" ,
        "categories" : {
            "dive_in" : "Dive In",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    },
    {
        "id" : "115" ,
        "tutorial" : "Analyzing Geolocation Data" ,
        "categories" : {
            "dive_in" : "Dive In",
            "analyze" : "Analyze",
            "develop" : "Develop"
        }
    }              
];




var myLayout = '';

var setScrollMargin = function(){
    $('.main').css('margin-top', $('header').outerHeight());
};
$( window ).resize(function() {
    setScrollMargin();
    anchorFix();
});
var tutorialSpecificShare = function(){
    var tutorial = $('title').html();
    var title = tutorial.split('-');
    $('.twitter-share-button').attr('data-text', 'I just finished - '+title[0]);
};
var fbShare = function(){
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('http://launch.hortonworks.com/'), 
      'facebook-share-dialog', 
      'width=626,height=436'); 
    return false;
};

var anchorFix = function(){
    //offsets anchor tags for fixed header
    $('a[name]').css({
        display: 'block', 
        position: 'relative', 
        top: -$('header').outerHeight() + 'px', 
        visibility: 'hidden'
    });
};

$('#fb-share').click(function(){
    fbShare();
});

//checks if flash is installed/enabled on the browser
function isFlashEnabled() {
    var hasFlash = false;
    try {
        var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if(fo) hasFlash = true;
    } catch(e) {
        if(navigator.mimeTypes ["application/x-shockwave-flash"] != undefined) hasFlash = true;
    }
    return hasFlash;
}

$("a.video").click(function(e){
    e.preventDefault();
    var _this = this;

    if (isFlashEnabled()) {
        parent.$.fancybox({
            'titleShow'     : false,
            'transitionIn'  : 'elastic',
            'transitionOut' : 'elastic',
            'href' : _this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
            'type'      : 'swf',
            'swf'       : {'wmode':'transparent','allowfullscreen':'true'}
        });
    } else {
        alert("Flash is required to view videos.");
    }
});

// Target fixes
$('.main-body a').not('.video,.popup').attr('target', "_blank");
$('a[href^="#"]').each(function(){
    $(this).attr('target', "");
});

var hortonNav = {
    htmlDivArray: [],
    catsUnique: [],
    propsUnique:[],
    checkboxArray:[],
    buildIndex: function(navMap){
        for( var prop in navMap){
            //Grab all Category Names and IDs from Array 'category'
            var props = [];
            var cats  = [];
            for (var i in navMap[prop].categories){
                props.push(i);
                cats.push(navMap[prop].categories[i]);
                if($.inArray(i, this.propsUnique) === -1) 
                    this.propsUnique.push(i);
                if($.inArray(i, this.catsUnique) === -1) 
                    this.catsUnique.push(i);
                    
                htmlDiv  = "<div class=\"item row " + props.join(" ")  + "\">" +
                   "<div class=\"tutorial\">" + navMap[prop].tutorial + "</div>" + 
                   "<div class=\"category\"><span>Categories: </span>" + cats.join(", ")  + "</div>" + 
                   "<div class=\"openButton\"><a href=\"" + navMap[prop].id + ".html\">" +
                   "Open <img src=\"images/home/openArrow.png\" border=\"0\" /></a></div></div>";
                
                   
            }          
            this.htmlDivArray.push(htmlDiv);
        }
        //console.log("Unique Props:");
        //console.log(this.propsUnique.join("-"));
        //console.log("Unique Cats:");
        //console.log(this.catsUnique.join("-"));
        return this.htmlDivArray.join(""); 
    },
    buildControls: function(navCategories){
        var z = 0;
        var blocks = [];
        
        //console.log(this.catsUnique.join("-"));
                
        for (var obj in navCategories){
            //console.log("-"+obj);
            
            var block = '';
            var subclasses = [];
            
            for (var prop in navCategories[obj]){
                //console.log("-"+prop+"-"+navCategories[obj][prop]);
                // if it's in the keysUnique Array
                // it's being used so we should show it
                
 
                
                if($.inArray(prop, this.catsUnique) >= 0) {
                    //console.log("-"+prop+" -"+navCategories[obj][prop]);
                    //console.log(this.catsUnique.join("-"));
                    
                    subclasses.push(prop);
                    var inputHtml = "";
                    inputHtml += "<div class=\"subcat\">";
                    inputHtml += "<input id=\"checkbox" + z + "\" type=\"checkbox\" value=\""+prop+"\"/ class=\"regular-checkbox\">";
                    inputHtml += "<label for=\"checkbox" + z + "\"></label>";
                    inputHtml += "<div class=\"subTag\">" + navCategories[obj][prop] + "</div>";
                    inputHtml += "</div>";

                    block += inputHtml;
                }
                z++;
            }
            //console.log(subclasses.join(" "));
            if (subclasses.length >0){
                var allHtml  = "";
                
                allHtml += "<div class=\"cat\">";
                allHtml += "<input id=\""+obj.toLowerCase().replace(" ", "-")+"\" class=\"regular-checkbox\" type=\"checkbox\" value=\""+subclasses.join(" ")+"\">";
                allHtml += "<label for=\""+obj.toLowerCase().replace(" ", "-")+"\"></label>";
                allHtml += "<div class=\"tag\">" + obj + "</div>";
                allHtml += block;
                allHtml += "</div>";
                this.checkboxArray.push(allHtml);
            }
            
            
        }
        return this.checkboxArray.join("");

    },
    onClick: function(obj){
        var $filterSel = $('input[type="checkbox"]:checked');
        var $container = $('#container .item');
        var filters = [];
        
        $filterSel.each(function(){
            var all = $(this).val().split(" ");
            if (all.length == 1)
            {
               filters.push(all); 
            } else {
                for(var k=0; k<all.length; k++)
                {
                    filters.push(all[k]);
                }
            }
        });
        

        if (filters.length){
            $container.each(function(){
                $(this).hide();
            });
            $container.each(function(){
                var _this = this;
                var hasAnyClass = function(arr){
                    //console.log(arr.join(","));
                    var retVal = false;
                    for (var i=0; i<arr.length; i++){
                        if ($( _this).hasClass(arr[i])){
                            retVal = arr[i];
                        }
                    }
                    return retVal;
                };
                var shouldShow = hasAnyClass(filters);
                if (shouldShow){
                    //console.log(shouldShow);
                    $(_this).show();
                }
            });
        } else {
            $container.each(function(){
                $(this).show();
            });
        }
        this.shuffle();
        
    },
    shuffle: function(){
        var $container = $('#container .item');
        var alt = false;
        var i = 0;
        $container.each(function(){
            $(this).removeClass("odd");
            $(this).removeClass("even");
        });
        $container.each(function(){
            if ($(this).is(':visible')){
                if(i % 2 == 0)
                {
                    $(this).addClass("even");
                }else{
                    $(this).addClass("odd");
                }
                i++;
            }
        });
    },
    init: function(navMap, navCategories){
        var _this = this;
        var tocHtml = _this.buildIndex(navMap);
        var ctlHtml = _this.buildControls(navCategories);
        
        var $container = $('#container');
        var $filterDiv = $('#filters');

        $container.html(tocHtml).css("height", $(tocHtml).outerHeight());
        $filterDiv.html(ctlHtml);
        this.shuffle();
    }
    
};


$(document).ready(function()
{
    /*
	********************
	Wire Stone Functions
	********************
	*/
    setScrollMargin();
    tutorialSpecificShare();
    anchorFix();
    
    hortonNav.init(navMap, navCategories);
    
    $('input[type="checkbox"]').click(function(){
            hortonNav.onClick(this);
    });
			   
	/*
	*******************
	fancybox for images 
	*******************
	*/
	$("a.popup").click(function()
	{
        parent.$.fancybox([{
                href : $(this).attr("href")
        }]);		
		return false;		  

     });
     

	 /*
	 ************
	 close button 
	 ************
	 */   
	 $('#hide').click(function()
	 {
	     parent.myLayout.close("west");
	     
	     return false;
	 });

	 /*
	 *************
	 expand button 
	 *************
	 */
	 $('#expand').click(function()
	 {
         var local = document.location.href;
         parent.$('#c1').attr('src', local);
		 window.open(local+"?popup=1");
		 parent.myLayout.close("west");
         
	     return false;
	 });
	

 	 //check if it should show the expand button
 	 var $_GET = {};
 	
 	 document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
 	    function decode(s) {
 	        return decodeURIComponent(s.split("+").join(" "));
 	    }
 	
 	    $_GET[decode(arguments[1])] = decode(arguments[2]);
 	 });
 
 	 if($_GET["popup"] == '1')
 	 {
 	    $('#expand, #hide').hide();
 	    $('#go-top').css('top','25px');
 	 }

	 /*
	 ***********************
	 enable smooth scrolling 
	 ***********************
	 */
	 $('.smooth-scroll, .smooth-scroll a').smoothScroll();
	 
    
    
});

