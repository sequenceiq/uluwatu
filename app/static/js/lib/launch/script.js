function switchTab(tab_id, tab_content) {
	var x = document.getElementsByClassName("tabcontent");
	var i;
	// hide all tab content
	for (i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}
	// display the content of the tab we need
	document.getElementById(tab_content).style.display = 'block'; 
 	// get menu items by class names - to highlight current
	var x = document.getElementsByClassName("tabmenu");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].className = 'tabmenu'; 
	}
	document.getElementById(tab_id).className = 'tabmenu active';
}

/*
$(document).ready(function(){
	$(".bigbutton a").click(function () {
		var $button = $(this);
		$button.text($button.text() == "Close Cluster Details" ? "View Cluster Details >>": "Close Cluster Details   ");
        $('.options').slideToggle(300, function(){
        });
	});

	$("#new1l").click(function(){
		var $l1 = $(this);
		($l1).text($l1.text() == "Hide" ? "See More": "Hide");
        $('#new1c').slideToggle(200, function(){
        });
	});

	$("#new2l").click(function(){
		var $l2 = $(this);
		($l2).text($l2.text() == "Hide" ? "See More": "Hide");
        $('#new2c').slideToggle(200, function(){
        });
	});
});

*/