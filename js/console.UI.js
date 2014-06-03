			$(document).ready(function () {
				
				var timers = new Array;
				var timersIndex = 0;
				var viewedCluster;
				var clusterIdNumber = 11; 
				
// copy credential menu selection to menu label, remove alert color and enable create cluster button
				$("#menu-credential ul li a").click(function () {
					if (!($(this).hasClass("not-option"))) {
						$(this).parents("#menu-credential").find('.dropdown-toggle span').text($(this).text()).removeClass('text-danger');
						$('#create-cluster-btn').removeClass('disabled');
					}
				});
				
// switch cluster title to normal word break if title has space in the middle 
				$(".cluster h4 .btn-cluster").each(function () {
					var s = $(this).text().trim();
					if (s.indexOf(" ") > -1 && (s.indexOf(" ") > 4 || s.lastIndexOf(" ") < 15)) {
						$(this).css("word-break", "normal");
					}
				});
				
// initialize Isotope with sort and filter
				var qsRegex;
				var $container = $('.isotope-wrapper').isotope({
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
// notification/filter field clearing on focus for filtering
				$('#notification-n-filter').focusin(function () {
					$(this).val("").trigger("keyup")
						// hide warning sign <i>
						.next().addClass('hidden');
					// delete state classes
					$('.combo-box').removeClass('has-feedback has-error has-warning has-success');
				});
				
// cluster-block hide/show
				$('#toggle-cluster-block-btn').click(function () {
					$('.cluster-block').collapse('toggle');
					// must force isotope redraw, its container height set 0 by some fucking shite
					$container.isotope();
				});
				// toggle fa-angle-up/down icon and sort button
				$('.cluster-block').on('hidden.bs.collapse', function () {
  				$('#toggle-cluster-block-btn i').removeClass('fa-angle-up').addClass('fa-angle-down');
					$('#sort-clusters-btn').addClass('disabled');
					$("#notification-n-filtering").prop("disabled", true);
				});
				$('.cluster-block').on('shown.bs.collapse', function () {
  				$('#toggle-cluster-block-btn i').removeClass('fa-angle-down').addClass('fa-angle-up');
					$('#sort-clusters-btn').removeClass('disabled');
					$("#notification-n-filtering").prop("disabled", false);
				});
				
// Bootstrap carousel as clusters / cluster details / create cluster slider
				// init
				$('.carousel').carousel('pause');

				// show cluster details
				$(".cluster h4 .btn-cluster").click(function () {
					viewedCluster = $(this).parent().parent();
					$('.carousel').carousel(1);
					// after slid in open panel
					$('.carousel').on('slid.bs.carousel', function () {
						// unbind event
						$(this).off('slid.bs.carousel');
						$('#cluster-details-panel-collapse').collapse('show');
					});
					$('.cluster-details h4').text(viewedCluster.find('h4').text());
					$('#toggle-cluster-block-btn').addClass('disabled');
					$('#sort-clusters-btn').addClass('disabled');
					$("#notification-n-filtering").prop("disabled", true);
				});
				// back to clusters
				$("#cluster-details-back-btn").click(function () {
					$('.carousel').carousel(0);
					$('.carousel').on('slid.bs.carousel', function () {
						// unbind event
						$(this).off('slid.bs.carousel');
						$('#cluster-details-panel-collapse').collapse('hide');
					});
					// must force isotope redraw, its container height set 0 by by some fucking shite
					$container.isotope();
					$('#toggle-cluster-block-btn').removeClass('disabled');
					$('#sort-clusters-btn').removeClass('disabled');
					$("#notification-n-filtering").prop("disabled", false);
				});
				
				// show create cluster panel
				$('#create-cluster-btn').click(function () {
					$('.carousel').carousel(2);
					// after slid in open panel
					$('.carousel').on('slid.bs.carousel', function () {
						// unbind event
						$(this).off('slid.bs.carousel');
						$('#create-cluster-panel-collapse').collapse('show');
					});
					$(this).addClass('disabled');
					$('#toggle-cluster-block-btn').addClass('disabled');
					$('#sort-clusters-btn').addClass('disabled');
					$("#notification-n-filtering").prop("disabled", true);
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
					$('#toggle-cluster-block-btn').removeClass('disabled');
					$('#sort-clusters-btn').removeClass('disabled');
					$("#notification-n-filtering").prop("disabled", false);
					$('#create-cluster-btn').removeClass('disabled');
				});
				
				// terminate modal cluster name
				$('#modal-terminate').on('shown.bs.modal', function () {
					$(this).find('strong').text(viewedCluster.find('h4 a span').text());
				});				

// terminate cluster process
				$('#terminate-cluster-btn').click(function () {
					var selectedCluster = viewedCluster;
					// hide modal
					$('#modal-terminate').modal('hide');
					// back to clusters view
					$('.carousel').carousel(0);
					// must force isotope redraw, its container height set 0 by by some fucking shite
					$container.isotope();
					// enable cluster bar buttons
					$('#toggle-cluster-block-btn').removeClass('disabled');
					$('#sort-clusters-btn').removeClass('disabled');
					$("#notification-n-filtering").prop("disabled", false);
					// remove cluster in isotope
					$('.carousel').on('slid.bs.carousel', function () {
						// unbind event
						$(this).off('slid.bs.carousel');
						// set isotope item attributes with VISUAL DELAY
						timers[timersIndex++] = window.setTimeout(function () {
							// set LED
							selectedCluster.find('.mod-LED span').removeClass().addClass('state0-stop-blink').text("stopping");
							// disable start/stop button
							selectedCluster.find('.mod-start-stop').addClass('disabled');
							// update isotope
							$container.isotope('updateSortData').isotope();
							var startTime = new Date();
							// set state classes
							$('#clusters-bar .combo-box').removeClass('has-warning has-success').addClass('has-feedback has-error');
							// set notification
							$('#notification-n-filter')
								// set text
								.val(("0"+startTime.getHours()).slice(-2) + ":" + ("0"+startTime.getMinutes()).slice(-2) + " " + selectedCluster.find('h4').text() + " is being terminated")
								// show warning sign <i>
								.next().removeClass('hidden');
							// simulated terminating process delay
							timers[timersIndex++] = window.setTimeout(function () {
								var endTime = new Date();
								// set state classes
								$('#clusters-bar .combo-box').removeClass('has-warning has-success').addClass('has-feedback has-error');
								// set notification
								$('#notification-n-filter')
								.val(("0"+endTime.getHours()).slice(-2) + ":" + ("0"+endTime.getMinutes()).slice(-2) + " " + selectedCluster.find('h4').text() + " has been terminated")
									// show warning sign
									.next().removeClass('hidden');
								// remove cluster visually
								$container.isotope('remove', selectedCluster);
								$container.isotope();
								}, 20000);	// 30s delay simulated termination
						}, 500);	// 0.5s VISUAL DELAY	
					});
				});
				
// create new cluster process
				$('#create-cluster-form-btn').click(function () {
					// back to clusters view
					$('.carousel').carousel(0);
					// must force isotope redraw, its container height set 0 by by some fucking shite
					$container.isotope();
					// enable toolbar buttons
					$('#toggle-cluster-block-btn').removeClass('disabled');
					$('#sort-clusters-btn').removeClass('disabled');
					$('#create-cluster-btn').removeClass('disabled');
					$("#notification-n-filtering").prop("disabled", false);
					// add cluster in isotope
					$('.carousel').on('slid.bs.carousel', function () {
						// unbind event
						$(this).off('slid.bs.carousel');
						// add new isotope item with VISUAL DELAY
						timers[timersIndex++] = window.setTimeout(function () {
							// irrelevant JS simulation of creating new cluster DOM object
							var newClusterName = $('.create-cluster form #clusterName').val();
								if (newClusterName == "") { newClusterName = "New cluster"; }
							var newClusterID = "cluster-" + ("00"+clusterIdNumber).slice(-3);
							var newClusterIdString = "#" + newClusterID; 
							var newCluster = $('#cluster-000').clone(true, true);
							newCluster.attr("id", newClusterID);
							$(newCluster).find('h4 a span').text(newClusterName);
							$(newCluster).find('.mod-nodes dd').text($('.create-cluster form #clusterSize').val());
							clusterIdNumber++;
							// insert new cluster DOM object with isotope
							$container.isotope( 'insert', newCluster );							
							// set LED
							$(newClusterIdString).find('.mod-LED span').removeClass().addClass('state2-run-blink').text("starting")
							// disable start/stop button
							$(newClusterIdString).find('.mod-start-stop').addClass('disabled');
							// update isotope
							$container.isotope('updateSortData').isotope();
							// notification
							var startTime = new Date();
							// set state classes
							$('#clusters-bar .combo-box').removeClass('has-error has-warning').addClass('has-feedback has-success');
							$('#notification-n-filter')
								// set text
								.val(("0"+startTime.getHours()).slice(-2) + ":" + ("0"+startTime.getMinutes()).slice(-2) + " " + $(newClusterIdString).find('h4').text() + " is being started")
								// show warning sign
								.next().removeClass('hidden');
							// simulated process delay
							timers[timersIndex++] = window.setTimeout(function () {
								// set LED
								$(newClusterIdString).find('.mod-LED span').removeClass().addClass('state5-run').text("starting")
								// enable start/stop button
								$(newClusterIdString).find('.mod-start-stop').removeClass('disabled');
								// update isotope
								$container.isotope('updateSortData').isotope();
								// set notification
								var endTime = new Date();
								// set state classes
								$('#clusters-bar .combo-box').removeClass('has-error has-warning').addClass('has-feedback has-success');
								$('#notification-n-filter')
									// set text
									.val(("0"+endTime.getHours()).slice(-2) + ":" + ("0"+endTime.getMinutes()).slice(-2) + " " + $(newClusterIdString).find('h4').text() + " is running")
									// show warning sign
								.next().removeClass('hidden');
							}, 20000);	// 20s delay simulated creating
						}, 500);	// 0.5s VISUAL DELAY				
					});
				});

				// stop cluster process
				$('.mod-start-stop').click(function () {
					if ($(this).find('i').hasClass('fa-pause')) {
					// STOP
						var cluster = $(this).parent();
						// set LED
						cluster.find('.mod-LED span').removeClass().addClass('state0-stop-blink').text("stopping")
						// disable start/stop button
						cluster.find('.mod-start-stop').addClass('disabled');
						// update isotope after VISUAL DELAY
						timers[timersIndex++] = window.setTimeout(function () {
							$container.isotope('updateSortData').isotope();
						}, 500);	// 0.5s VISUAL DELAY
						// notification
						var startTime = new Date();
						// set state classes
						$('#clusters-bar .combo-box').removeClass('has-warning has-success').addClass('has-feedback has-error');
						$('#notification-n-filter')
						// set text
						.val(("0"+startTime.getHours()).slice(-2) + ":" + ("0"+startTime.getMinutes()).slice(-2) + " " + cluster.find('h4').text() + " is stopping")
						// show warning sign
						.next().removeClass('hidden');
						// simulated process delay
						timers[timersIndex++] = window.setTimeout(function () {
							// set LED
							cluster.find('.mod-LED span').removeClass().addClass('state3-stop').text("ready")
							// disable start/stop button
							cluster.find('.mod-start-stop').removeClass('disabled').attr("title", 'start cluster')
							.find('i').removeClass('fa-pause').addClass('fa-play');
							// update isotope
							$container.isotope('updateSortData').isotope();
							// set notification
							var endTime = new Date();
							// set state classes
							$('#clusters-bar .combo-box').removeClass('has-warning has-success').addClass('has-feedback has-error');
							$('#notification-n-filter')
							// set text
							.val(("0"+endTime.getHours()).slice(-2) + ":" + ("0"+endTime.getMinutes()).slice(-2) + " " + cluster.find('h4').text() + " has stopped")
							// show warning sign
							.next().removeClass('hidden');
						}, 20000);	// 20s delay simulated stopping
					} else {
					// START
						var cluster = $(this).parent();
						// set LED
						cluster.find('.mod-LED span').removeClass().addClass('state2-run-blink').text("starting")
						// disable start/stop button
						cluster.find('.mod-start-stop').addClass('disabled');
						// update isotope after VISUAL DELAY
						timers[timersIndex++] = window.setTimeout(function () {
							$container.isotope('updateSortData').isotope();
						}, 500);	// 0.5s VISUAL DELAY
						// notification
						var startTime = new Date();
						// set state classes
						$('#clusters-bar .combo-box').removeClass('has-warning has-error').addClass('has-feedback has-success');
						$('#notification-n-filter')
						// set text
						.val(("0"+startTime.getHours()).slice(-2) + ":" + ("0"+startTime.getMinutes()).slice(-2) + " " + cluster.find('h4').text() + " is starting")
						// show warning sign
						.next().removeClass('hidden');
						// simulated process delay
						timers[timersIndex++] = window.setTimeout(function () {
							// set LED
							cluster.find('.mod-LED span').removeClass().addClass('state5-run').text("ready")
							// disable start/stop button
							cluster.find('.mod-start-stop').removeClass('disabled').attr("title", 'start cluster')
							.find('i').removeClass('fa-play').addClass('fa-pause');
							// update isotope
							$container.isotope('updateSortData').isotope();
							// set notification
							var endTime = new Date();
							// set state classes
							$('#clusters-bar .combo-box').removeClass('has-warning has-error').addClass('has-feedback has-success');
							$('#notification-n-filter')
							// set text
							.val(("0"+endTime.getHours()).slice(-2) + ":" + ("0"+endTime.getMinutes()).slice(-2) + " " + cluster.find('h4').text() + " is running")
							// show warning sign
							.next().removeClass('hidden');
						}, 20000);	// 20s delay simulated stopping
					}
				});				


// panel collapse scrolling
				// management panel click
				$('.panel-panel-container > .panel-heading > a').click(function (e) {
					e.preventDefault();
					$(this).parent().next().collapse('toggle');
				});
				// accordion panel click
				$('.panel-heading > h5 > a').click(function (e) {
					e.preventDefault();
					$(this).parent().parent().next().collapse('toggle');
				});
				// create panel click
				$('.btn-row-over-panel > a').click(function (e) {
					e.preventDefault();
					$(this).parent().parent().next().collapse('toggle');
				});

				// solo panel or accordion shown
				$('.panel-collapse').on('shown.bs.collapse', function (e) {
					e.preventDefault();
					var panel = $(this).parent();		// panel
					var offset = panel.offset().top;
					if(offset) {
						$('html,body').animate({
							scrollTop: offset - 64
						}, 500); 
					}
				});
				// create panel shown
				$('.panel-under-btn-collapse').on('shown.bs.collapse', function (e) {
					e.preventDefault();
					// button switch
					$(this).parent().prev()
					.find('.btn').fadeTo("fast", 0, function () { 
						$(this).removeClass('btn-success').addClass('btn-info')
						.find('i').removeClass('fa-plus').addClass('fa-times').removeClass('fa-fw')
						.parent().find('span').addClass('hidden');
						$(this).fadeTo("slow", 1);
					});
					// scroll
					var panel = $(this).parent().prev();	// btn-row-over-panel
					var offset = panel.offset().top;
					if(offset) {
						$('html,body').animate({
							scrollTop: offset - 64
						}, 500); 
					}
				});				
				// management panel shown	
				$('.panel-btn-in-header-collapse').on('shown.bs.collapse', function (e) {
					e.preventDefault();
					// button switch
  				$(this).parent().find('.panel-heading .btn i').removeClass('fa-angle-down').addClass('fa-angle-up');
					// scroll
					var panel = $(this).parent().parent();	// panel
					var offset = panel.offset().top;
					if(offset) {
						$('html,body').animate({
							scrollTop: offset - 64
						}, 500); 
					}
				});
				
				// management panel button switch back
				$('.panel-btn-in-header-collapse').on('hidden.bs.collapse', function (e) {
					e.preventDefault();
					$(this).parent().find('.panel-heading .btn i').removeClass('fa-angle-up').addClass('fa-angle-down');
				});

				// create panels' button switch back
				$('.panel-under-btn-collapse').on('hidden.bs.collapse', function () {
  				$(this).parent().prev()
						.find('.btn').fadeTo("fast", 0, function () { 
							$(this).removeClass('btn-info').addClass('btn-success')
							.find('i').removeClass('fa-times').addClass('fa-plus').addClass('fa-fw')
							.parent().find('span').removeClass('hidden');
							$(this).fadeTo("slow", 1);
					});
				});			
			

// btn-segmented-control
				$('.btn-segmented-control a').click(function (e) {
					var selected = 'btn-info';
					var active = 'btn-default';
					var control = $(this).parent().parent();
					e.preventDefault();
					control.find('a').each(function () {
						$(this).removeClass(selected).addClass(active);
					});
					$(this).removeClass(active).addClass(selected);
					
					// do something...
				});
			
			});


	