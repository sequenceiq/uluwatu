$(document).ready(function () {

	(function CONSOLE($) {

		var timers = new Array;
		var timersIndex = 0;
		var clustersToolbar;
		var notification;
		var clusters = new Array;
		var clusterIdNumber = 0; 
		var $container;	// Isotope
		var SIM_DELAY = 5000; // 5s delay
		

		/** ... startup ........................................................ */
		
		setupEvents();
		initializeIsotope();
		syncExistingHadoopClusters();

		
		function setupEvents() {

			clustersToolbar = new ClustersToolbar();
			notification = new Notification();
			
			// cluster-block hide/show
			$('#toggle-cluster-block-btn').click(function () {
				$('.cluster-block').collapse('toggle');
				// must force isotope redraw, its container height set 0 by some fucking shite
				$container.isotope();
			});
			// toggle fa-angle-up/down icon and sort button
			$('.cluster-block').on('hidden.bs.collapse', function () {
				$('#toggle-cluster-block-btn i').removeClass('fa-angle-up').addClass('fa-angle-down');
				// disable filter and sort
				clustersToolbar.enabled(true, false, false, true);
			});
			$('.cluster-block').on('shown.bs.collapse', function () {
				$('#toggle-cluster-block-btn i').removeClass('fa-angle-down').addClass('fa-angle-up');
				// enable all
				clustersToolbar.enabled(true, true, true, true);
			});

			// Bootstrap carousel as clusters / cluster details / create cluster slider
			// init
			$('.carousel').carousel('pause');	

			// show create cluster panel
			$('#create-cluster-btn').click(function () {
				$('.carousel').carousel(2);
				// after slid in open panel
				$('.carousel').on('slid.bs.carousel', function () {
					// unbind event
					$(this).off('slid.bs.carousel');
					$('#create-cluster-panel-collapse').collapse('show');
				});
				// disable clusters toolbar
				clustersToolbar.enabled(false, false, false, false);
			});
			// back to clusters
			$("#create-cluster-back-btn").click(function () {
				$('.carousel').carousel(0);
				$('.carousel').on('slid.bs.carousel', function () {
					// unbind event
					$(this).off('slid.bs.carousel');
					$('#create-cluster-panel-collapse').collapse('hide');
				});
				// must force isotope redraw, .isotope-wrapper's height set 0 by by some fucking shite
				$container.isotope();
				// enable clusters toolbar
				clustersToolbar.enabled(true, true, true, true);
			});


			// create new cluster
			$('#create-cluster-form-btn').click(function () {
				// back to clusters view
				$('.carousel').carousel(0);
				// must force isotope redraw, its container height set 0 by by some fucking shite
				$container.isotope();
				// enable toolbar buttons
				clustersToolbar.enabled(true, true, true, true);
				// create new cluster
				$('.carousel').on('slid.bs.carousel', function () {
					// unbind event
					$(this).off('slid.bs.carousel');
					// add new cluster with VISUAL DELAY
					timers[timersIndex++] = window.setTimeout(function () {

						var name = $('.create-cluster form #clusterName').val();
						var size = $('.create-cluster form #clusterSize').val();
						if (!size) { size = 2; }
						var uptime = 0;
						clusters[clusterIdNumber] = new Cluster;
						clusters[clusterIdNumber].create(name, clusterIdNumber, size, uptime);

						// simulated process
						sim_CREATEHadoopCluster(clusterIdNumber++);

					}, 500);	// 0.5s VISUAL DELAY				
				});
			});
			
			// panel collapse page scrolling
			function scrollToPanelTop(panel) {
				var offset = panel.offset().top;
				if (offset) {
					$('html,body').animate({
						scrollTop: offset - 64	// - height of cluster toolbar
					}, 500); 
				}
			}
			
			// solo/accordion panel click
			$('.panel-heading > h5 > a').click(function (e) {
				e.preventDefault();
				accordion = $(this).attr("data-parent");
				if (accordion != "") {
					$(accordion).find('.in').collapse('hide');
				}
				$(this).parent().parent().next().collapse('toggle');
			});
			// create panel click
			$('.btn-row-over-panel > a').click(function (e) {
				e.preventDefault();
				$(this).parent().parent().next().collapse('toggle');
			});
			// management panel click
			$('.panel-panel-container > .panel-heading > a').click(function (e) {
				e.preventDefault();
				$(this).parent().next().collapse('toggle');
			});

			// solo panel or in accordion shown
			$('.panel-collapse').on('shown.bs.collapse', function (e) {
				e.stopPropagation();
				// scroll page
				scrollToPanelTop($(this).parent());
			});
			// solo panel or in accordion hidden
			$('.panel-collapse').on('hidden.bs.collapse', function (e) {
				e.stopPropagation();
			});
			// create template/blueprint/credential panel shown
			$('.panel-under-btn-collapse').on('shown.bs.collapse', function (e) {
				e.stopPropagation();
				// button switch
				$(this).parent().prev()
				.find('.btn').fadeTo("fast", 0, function () { 
					$(this).removeClass('btn-success').addClass('btn-info')
					.find('i').removeClass('fa-plus').addClass('fa-times').removeClass('fa-fw')
					.parent().find('span').addClass('hidden');
					$(this).fadeTo("slow", 1);
				});
				// scroll page
				scrollPanel($(this).parent().prev());	// btn-row-over-panel
			});
			// create template/blueprint/credential panel hidden
			$('.panel-under-btn-collapse').on('hidden.bs.collapse', function (e) {
				e.stopPropagation();
				$(this).parent().prev()
				.find('.btn').fadeTo("fast", 0, function () { 
					$(this).removeClass('btn-info').addClass('btn-success')
					.find('i').removeClass('fa-times').addClass('fa-plus').addClass('fa-fw')
					.parent().find('span').removeClass('hidden');
					$(this).fadeTo("slow", 1);
				});
			});			
			// management panel shown	
			$('.panel-btn-in-header-collapse').on('shown.bs.collapse', function (e) {
				// button switch
				$(this).parent().find('.panel-heading .btn i').removeClass('fa-angle-down').addClass('fa-angle-up');
				// scroll page
				scrollToPanelTop($(this).parent().parent());	// panel
			});
			// management panel hidden
			$('.panel-btn-in-header-collapse').on('hidden.bs.collapse', function (e) {
				// button switch
				$(this).parent().find('.panel-heading .btn i').removeClass('fa-angle-up').addClass('fa-angle-down');
			});
			

			// btn-segmented-control
			$('.btn-segmented-control a').click(function (e) {
				var selected = 'btn-info';
				var active = 'btn-default';
				var control = $(this).parent().parent();
				e.preventDefault();
				e.stopPropagation();
				if (!control.hasClass('multiselect')) {
					control.find('a').each(function () {
						$(this).removeClass(selected).addClass(active);
					});
					$(this).removeClass(active).addClass(selected);
				} else {
					if ($(this).hasClass(active)) {
						$(this).removeClass(active).addClass(selected);
					} else {
						$(this).removeClass(selected).addClass(active);
					}
				}
				// show next selector block
				var nextSelector = control.attr('data-next');
				if (nextSelector) { 
					$(nextSelector).collapse('show'); 
					$(nextSelector).on('shown.bs.collapse', function (e) {
						e.stopPropagation();
						// scroll page
						scrollToPanelTop($(this).parent().prev().prev());
					});
				}
			});
			
			// fake shit, all form elements should be checked to enable the create button
			$('#selectTemplate').change(function (e) {
				$('#create-cluster-form-btn').removeClass('disabled');
			});
			
			
			// refresh button
			$('#btnRefresh').click(function (e) {
				e.preventDefault();
				$(this).find('i').addClass('fa-spin');
			});
		}


		function initializeIsotope() {
			var qsRegex;

			$container = $('.isotope-wrapper').isotope({
				itemSelector: '.cluster',
				layoutMode: 'masonry',
				masonry: {
					columnWidth: 156,
					gutter: 0
				},
				filter: function () {
					return qsRegex ? $(this).find('h4 a').text().match(qsRegex) : true;
				},
				getSortData: {
					// cluster name
					name: function (itemElem) {
						var str = $(itemElem).find('h4 a').text();
						return str.toLowerCase();
					},
					// cluster node number
					nodes: function (itemElem) {
						var str = $(itemElem).find('.mod-nodes dd').text();
						return parseInt(str);
					},
					// cluster state from CSS class
					state: function (itemElem) {
						var str = $(itemElem).find('.mod-LED span').attr("class");
						return str;
					},
					// cluster uptime
					uptime: function (itemElem) {
						var str = $(itemElem).find('.mod-uptime dd').text();
						return parseInt(str);
					}
				}
			});
			$container.isotope({ sortBy : 'state' });
			// sorting dropdown
			$('#sort-clusters-btn + ul li').on('click', 'a', function (e) {
				// get sort parameters from selected menuitem 
				var sortByValue = $(this).attr('data-sort-by');
				var sortAsc = $(this).attr('data-sort-asc');
				$container.isotope({ sortBy: sortByValue, sortAscending: sortAsc });
				// set button label to selected sort mode
				$("#sort-clusters-btn span.title").text( sortByValue );
				// disable selected menu item
				$(this).parents().find('.disabled').removeClass( "disabled" );
				$(this).parent().addClass( "disabled" );
			});
			// filtering in the notification textfield
			var $quicksearch = $('#notification-n-filter').keyup( debounce( function () {
				qsRegex = new RegExp( $quicksearch.val(), 'gi' );
				$container.isotope();
			}, 300 ) );
			// debounce so filtering doesn't happen every millisecond
			function debounce(fn, threshold) {
				var timeout;
				return function debounced() {
					if (timeout) { clearTimeout(timeout); }
					function delayed() { fn(); timeout = null; }
					timeout = setTimeout(delayed, threshold || 100);
				}
			}				
		}


		function syncExistingHadoopClusters() {
			// create Clusters based on existing Hadoop clusters			
			var hadoopClusters = sim_GETHadoopClustersData();
			var n = hadoopClusters.length;
			
			for (var i = 0; i < n; i++) {
				clusters[clusterIdNumber] = new Cluster;
				clusters[clusterIdNumber].sync(hadoopClusters[i].name, clusterIdNumber++, 
																			 hadoopClusters[i].size, hadoopClusters[i].uptime,
																			 hadoopClusters[i].state, hadoopClusters[i].msg );
			}			
		}

		
		/** ... simulations .................................................... */
		
		// reading existing clusters' data simulator
		function sim_GETHadoopClustersData() {
			var HADOOPS = [
				{ name : 'Google-001',
					size : 3,
					uptime : '-517h -48m',
					state : 'Standby'
				},
				{ name : 'Big-One-AWS',
				 size : 99,
				 uptime : '-517h -48m',
				 state : 'Running'
				},
				{ name : 'lalyos-pet-cluster',
				 size : 1,
				 uptime : '-4h -28m',
				 state : 'Stopped',
				}
			];
			return HADOOPS;
		}
		// process delay simulators	
		function sim_CREATEHadoopCluster(idNumber) {
			var errormsg = "";
			// simulated process delay
			timers[timersIndex++] = window.setTimeout(function () {
				clusters[idNumber].op_COMPLETED();
		//	clusters[idNumber].op_FAILED(errormsg);
			}, SIM_DELAY);
		}
		function sim_STARTHadoopCluster(idNumber) {
			var errormsg = "";
			// simulated process delay
			timers[timersIndex++] = window.setTimeout(function () {
				clusters[idNumber].op_COMPLETED();
		//	clusters[idNumber].op_FAILED(errormsg);
			}, SIM_DELAY);
		}
		function sim_STOPHadoopCluster(idNumber) {
			// simulated process delay
			timers[timersIndex++] = window.setTimeout(function () {
				clusters[idNumber].op_COMPLETED();
			}, SIM_DELAY);
		}
		function sim_DELETEHadoopCluster(idNumber) {
			// simulated process delay
			timers[timersIndex++] = window.setTimeout(function () {
				clusters[idNumber].op_COMPLETED();
			}, SIM_DELAY);
		}
		// error simulator
		function sim_ERRORHadoopCluster(idNumber) {
			var errormsg = ": total failure";
			clusters[idNumber].op_ERROR(errormsg);
		}



		/** ... Cluster ........................................................ */

		function Cluster() {

			// HTML manifestation of the cluster
			var htmlCluster;
			var clusterName;
			var clusterSize;
			var clusterUptime;
			var clusterIdNumber;

			// finite state machine
			var fsm;
			var fsmBlueprint = {
				initial: 'Creating',
				events: [
					{ name: 'op_COMPLETED',		from:	'Creating',														to:	'Running' },
					{ name: 'op_FAILED',			from:	'Creating',														to:	'Aborted' },

					{ name: 'op_COMPLETED',		from: 'Starting',														to: 'Running' },
					{ name: 'op_FAILED',			from: 'Starting',														to: 'Stopped' },															

					{ name: 'startstop',			from: 'Running',														to: 'Stopping' },
			//	{ name: 'op_COMPLETED',		from: 'Stopping',														to: 'Stopped' }, // v0.1
					{ name: 'op_COMPLETED',		from: 'Stopping',														to: 'Standby' }, // v0.2
					
			//	{ name: 'startstop',			from: 'Stopped',														to: 'Starting' }, // v0.1
					{ name: 'startstop',			from: 'Standby',														to: 'Starting' }, // v0.2

					{ name: 'terminate',			from: ['Stopped', 'Standby', 'Running'],		to: 'Terminating' },
					{ name: 'op_COMPLETED',		from: 'Terminating',												to: 'Terminated' },

					{ name: 'op_ERROR',				from: ['Standby', 'Running'],								to: 'Stopped' }
				],		
				callbacks: {					
					onenterCreating: function(e,f,t) {
						setLED('state2-run-blink', 'starting'); 
						setStartStopBtn('fa-pause', 'disabled', '');
						notification.send(clusterName, 'has-success', ' is being created');
						// update isotope
						$container.isotope('updateSortData').isotope();
						// simulated creating process will trigger Cluster.op_COMPLETED() or Cluster.op_FAILED(errormsg)
						sim_CREATEHadoopCluster(clusterIdNumber);
					},
					onenterAborted: function(e,f,t, errormsg) {
						notification.send(clusterName, 'has-error', '\'s creation failed: ' + errormsg);
						deleteHtmlCluster();
					},
					onenterStarting: function(e,f,t) {
						setLED('state2-run-blink', 'starting'); 
						setStartStopBtn('fa-pause', 'disabled', '');
						notification.send(clusterName, 'has-success', ' is starting');
						// update isotope
						$container.isotope('updateSortData').isotope();
						// simulated starting process will trigger cluster.op_COMPLETED()
						sim_STARTHadoopCluster(clusterIdNumber);
					},
					onenterRunning: function(e,f,t) {
						startUptimer(clusterUptime);
						setLED('state5-run', 'running'); 
						setStartStopBtn('fa-pause', 'enabled', 'stop cluster');
						notification.send(clusterName, 'has-success', ' is running');
						// update isotope
						$container.isotope('updateSortData').isotope();
					},
					/* v0.2 */
					onenterStandby: function(e,f,t) {
						setLED('state4-ready', 'ready'); 
						setStartStopBtn('fa-play', 'enabled', 'start cluster');
						notification.send(clusterName, 'has-warning', ' is on standby');
						// update isotope
						$container.isotope('updateSortData').isotope();
					},
					onenterStopping: function(e,f,t) {
				//	setLED('state0-stop-blink', 'stopping'); // v0.1
						setLED('state1-ready-blink', 'stopping'); // v0.2
						setStartStopBtn('fa-play', 'disabled', '');
				//	notification.send(clusterName, 'has-error', ' is stopping'); // v0.1
						notification.send(clusterName, 'has-warning', ' is stopping'); // v0.2
						// update isotope
						$container.isotope('updateSortData').isotope();
						// simulated stopping process will trigger Cluster.op_COMPLETED()
						sim_STOPHadoopCluster(clusterIdNumber);
					},
					onenterStopped: function(e,f,t, errormsg) {
						var msg = "";
						stopUptimer();
						setLED('state3-stop', 'stopped'); 
				//	setStartStopBtn('fa-play', 'enabled', 'start cluster'); // v0.1
						setStartStopBtn('fa-play', 'disabled'); // v0.2
						if (errormsg) { msg = errormsg; }
						notification.send(clusterName, 'has-error', ' has stopped' + msg);
						// update isotope
						$container.isotope('updateSortData').isotope();
					},
					onenterTerminating: function(e,f,t) {
						setLED('state0-stop-blink', 'stopping'); 
						setStartStopBtn('fa-play', 'disabled', '');
						notification.send(clusterName, 'has-error', ' is being terminated');
						// update isotope
						$container.isotope('updateSortData').isotope();
						// simulated terminating process will trigger Cluster.op_COMPLETED()
						sim_DELETEHadoopCluster(clusterIdNumber);
					},
					onenterTerminated: function(e,f,t) {
						notification.send(clusterName, 'has-error', ' has been terminated');
						deleteHtmlCluster();
					}
				}
			};

			function createHtmlCluster(name, id, size, uptime) {
				htmlCluster = $('#cluster-template').clone(true, true);
				clusterName = name;
				clusterIdNumber = id;
				clusterSize = size;
				clusterUptime = uptime;
				if (clusterName == "") { clusterName = "New-cluster-" + ("00" + (clusterIdNumber)).slice(-3); }
				// switch cluster title to normal word break if name has space in the middle 
				var str = clusterName.trim();
				if (str.indexOf(" ") > -1 && (str.indexOf(" ") > 4 || str.lastIndexOf(" ") < 15)) {
					htmlCluster.find('h4 .btn-cluster').css("word-break", "normal");
				}
				var htmlId = "cluster-" + ("00" + (clusterIdNumber)).slice(-3);
				htmlCluster.attr("id", htmlId);
				htmlCluster.find('h4 .btn-cluster span').text(clusterName);
				htmlCluster.find('.mod-nodes dd').text(clusterSize);
				// set up HTML events for btns
				htmlCluster.find('.mod-start-stop').off('click');
				htmlCluster.find('.mod-start-stop').click(function () {
					this.blur();
					fsm.startstop();
				});
				htmlCluster.find('h4 .btn-cluster').off('click');
				htmlCluster.find('h4 .btn-cluster').click(function () {
					showClusterDetails();
				});
				// insert new cluster DOM object with isotope
				$container.prepend(htmlCluster).isotope( 'prepended', htmlCluster);
			}	
			function deleteHtmlCluster() {
				$container.isotope('remove', htmlCluster);
				$container.isotope();
			}

			function showClusterDetails() {
				// disable cluster toolbar except create cluster btn
				clustersToolbar.enabled(false, false, false, true);				
				// slide in details panel
				$('.carousel').carousel(1);
				// after slid open panel
				$('.carousel').on('slid.bs.carousel', function () {
					// unbind event
					$(this).off('slid.bs.carousel');
					$('#cluster-details-panel-collapse').collapse('show');
				});
				// set name and size
				$('.cluster-details h4').text(clusterName);
				$('.cluster-details #cluster-size').text(clusterSize);
				// set up HTML events
				$("#cluster-details-back-btn").off('click');
				$("#cluster-details-back-btn").click(function () {
					hideClusterDetails();
				});
				$("#terminate-btn").off('click');
				$("#terminate-btn").click(function () {
					showTerminateModal();
				});
			}
			function hideClusterDetails() {
				// enable cluster toolbar
				clustersToolbar.enabled(true, true, true, true);
				// slide in clusters
				$('.carousel').carousel(0);
				// after slid close panel
				$('.carousel').on('slid.bs.carousel', function () {
					// unbind event
					$(this).off('slid.bs.carousel');
					// must force isotope redraw, its container height set 0 by by some fucking shite
					$container.isotope();
				});
			}

			function showTerminateModal() {
				// open
				$('#modal-terminate').modal();
				// display cluster name
				$('#modal-terminate').find('strong').text(clusterName);
				// on okay button click do it
				$("#terminate-cluster-btn").off('click');
				$("#terminate-cluster-btn").click(function () {
					terminateCluster();
				});
			}
			function terminateCluster() {
				// hide modal
				$('#modal-terminate').modal('hide');
				// back to clusters view
				$('.carousel').carousel(0);
				// must force isotope redraw, its container height set 0 by by some fucking shite
				$container.isotope();
				// enable cluster bar buttons
				clustersToolbar.enabled(true, true, true, true);			
				$('.carousel').on('slid.bs.carousel', function () {
					// unbind event
					$(this).off('slid.bs.carousel');
					// start terminating after VISUAL DELAY
					timers[timersIndex++] = window.setTimeout(function () {
						fsm.terminate();							
					}, 500);	// 0.5s VISUAL DELAY	
				});
			}

			function setLED(state, stateText) {
				var led = htmlCluster.find('.mod-LED span');

				led.removeClass().addClass(state).attr('title', stateText);
			}
			function setStartStopBtn(button, state, titleText) {
				var startStopBtn = htmlCluster.find('.mod-start-stop');

				startStopBtn.find('i').removeClass('fa-play fa-pause').addClass(button);
				if (state == 'disabled') { startStopBtn.addClass('disabled'); } else { startStopBtn.removeClass('disabled'); }
				startStopBtn.attr('title', titleText);
			}

			function startUptimer(startTime) {
				var timer = htmlCluster.find('.mod-uptime dd');
				var timerSetup = {
					format: 'HM',
					layout: '{hn}<sup>h</sup>{mnn}<sup>m</sup>',
					since: '-0h -00m'
				}
				timerSetup.since = startTime;
				timer.countdown('destroy'); // to restart existing uptimer
				timer.countdown(timerSetup);
				// timer.countdown('resume');
			}
			function stopUptimer() {
				var timer = htmlCluster.find('.mod-uptime dd');
				timer.countdown('pause');
				clusterUptime = '-0h -00m';
			}


			/** ........................ public methods .......................... */

			// creating a new Hadoop cluster
			this.create = function (name, id, size) {
				createHtmlCluster(name, id, size, '-0h -00m');
				// create state machine
				fsm = StateMachine.create(fsmBlueprint);
			}
			// sync with an existing Hadoop cluster
			this.sync = function (name, id, size, uptime, state) {
				createHtmlCluster(name, id, size, uptime);
				// create state machine
				fsmBlueprint.initial = state;
				fsm = StateMachine.create(fsmBlueprint);
			}
			// events
			this.op_COMPLETED = function () {
				fsm.op_COMPLETED();
			}
			this.op_FAILED = function (errormsg) {
				fsm.op_FAILED(errormsg);
			}
			this.op_ERROR = function (errormsg) {
				fsm.op_ERROR(errormsg);
			}

		} // Cluster


		/** ... ClustersToolbar ................................................ */

		function ClustersToolbar() {

			var toggleClusterBtn = $('#toggle-cluster-block-btn');
			var filterField = $("#notification-n-filter");
			var sortBtn = $('#sort-clusters-btn');
			var createBtn = $('#create-cluster-btn');

			/** ....................... public methods ........................... */

			this.enabled = function (toggle, filter, sort, create) {
				if (toggle) { toggleClusterBtn.removeClass('disabled'); } else { toggleClusterBtn.addClass('disabled'); }
				filterField.prop('disabled', !filter);
				if (sort) { sortBtn.removeClass('disabled'); } else { sortBtn.addClass('disabled'); }
				if (create) { createBtn.removeClass('disabled'); } else { createBtn.addClass('disabled'); }
			}
			this.enableCreateBtn = function () {
				createBtn.removeClass('disabled');
			}

		} // ClustersToolbar


		/** ... Notification ................................................... */

		function Notification() {

			var container = $('#clusters-bar .combo-box');
			var textField = $('#notification-n-filter');
			var self = this;

			// setup events
			// notification/filter field clearing on focus for filtering
			textField.focusin(function () {
				self.clear();
			});

			/** ....................... public methods ........................... */

			this.clear = function () {
				textField.val("").trigger("keyup")
				// hide warning sign <i>
				textField.next().addClass('hidden');
				// delete message classes
				container.removeClass('has-feedback has-error has-warning has-success');
			}

			this.send = function (clusterName, hasCategory, errormsg) {
				var currentTime = new Date();
				var message = errormsg || '';
				// set message classes
				container.removeClass('has-success has-warning has-error').addClass('has-feedback').addClass(hasCategory);
				// set text
				textField.val(("0"+currentTime.getHours()).slice(-2) + ":" + ("0"+currentTime.getMinutes()).slice(-2) + " " + clusterName + message)
				// show warning sign
				textField.next().removeClass('hidden');
			}

		} // Notification

	
	})(jQuery);	// CONSOLE

});
