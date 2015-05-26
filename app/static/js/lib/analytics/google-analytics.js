var _gaq = _gaq || [];
	var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
	_gaq.push(['_require', 'inpage_linkid', pluginUrl]);
	_gaq.push(['_setAccount', 'UA-22950817-1']);
	_gaq.push(['_setDomainName', '.hortonworks.com']);
	_gaq.push(['_trackPageview']);
	/*
			// SetCustomeVar's allow us to group pages in GA.
			_gaq.push(['_setCustomVar',
			1,                  // This custom var is set to slot #1.  Required parameter.
			'Section',          // The top-level name for your online content categories.  Required parameter.
			'High level sell',  // Sets the value of "Section" to "Life & Style" for this particular aricle.  Required parameter.
			3                   // Sets the scope to page-level.  Optional parameter.
			]);

			// This would allow us to assign categories to each page.
			 _gaq.push(['_setCustomVar', 2, 'Category',  'Hive',  3   ]);
	*/
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();