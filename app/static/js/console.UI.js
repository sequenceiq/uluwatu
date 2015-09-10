var $jq = jQuery.noConflict();
var jQuery = jQuery.noConflict();


function addCrudControls(){
    $jq('.panel-heading .panel-title').click(function() {
         $jq('.panel-heading').removeClass('activeacc');
         $jq(this).parents('.panel-heading').addClass('activeacc');
     });
}

function addClusterListPanelJQEventListeners() {
  // cluster-block hide/show
  $jq('#toggle-cluster-block-btn').click(function () {
      $jq('.cluster-block').collapse('toggle');
  });
  // toggle fa-angle-up/down icon and sort button
  $jq('.cluster-block').on('hidden.bs.collapse', function () {
      $jq('#toggle-cluster-block-btn i').removeClass('fa-angle-up').addClass('fa-angle-down');
      $jq('#sort-clusters-btn').addClass('disabled');
  });
  $jq('.cluster-block').on('shown.bs.collapse', function () {
      $jq('#toggle-cluster-block-btn i').removeClass('fa-angle-down').addClass('fa-angle-up');
      $jq('#sort-clusters-btn').removeClass('disabled');
  });
  // Bootstrap carousel as clusters / cluster details / create cluster slider init
  $jq('.carousel').carousel('pause');
  // show cluster details
  $jq(document).on("click", ".cluster h4 .btn-cluster", function() {
      $jq('.carousel').carousel(1);
      $jq('.carousel').on('slid.bs.carousel', function () {
          // unbind event
          $jq(this).off('slid.bs.carousel');
          $jq('#cluster-details-panel-collapse').collapse('show');
      });
      $jq('#toggle-cluster-block-btn').addClass('disabled');
      $jq('#sort-clusters-btn').addClass('disabled');
  });
}

function addClusterFormJQEventListeners() {
    $jq('#cluster-form-panel .panel-heading > h5 > a').click(function (e) {
        e.preventDefault();
        accordion = $jq(this).attr("data-parent");
        if (accordion != "") {
            $jq(accordion).find('.in').collapse('hide');
        }
        $jq(this).parent().parent().next().collapse('toggle');
    });
    // solo panel or in accordion shown
    $jq('#cluster-form-panel .panel-collapse').on('shown.bs.collapse', function (e) {
        e.stopPropagation();
        var panel = $jq(this).parent();		// panel
        var offset = panel.offset().top;
        if(offset) {
            $jq('html,body').animate({
                scrollTop: offset - 64
            }, 500);
        }
    });
    // solo panel or in accordion hidden
    $jq('#cluster-form-panel .panel-collapse').on('hidden.bs.collapse', function (e) {
        e.stopPropagation();
    });
    // show create cluster panel
    $jq('#create-cluster-btn').click(function () {
        $jq('.carousel').carousel(2);
        $jq('.carousel').on('slid.bs.carousel', function () {
            // unbind event
            $jq(this).off('slid.bs.carousel');
            $jq('#create-cluster-panel-collapse').collapse('show');
        });
        $jq(this).addClass('disabled');
        $jq('#toggle-cluster-block-btn').addClass('disabled');
        $jq('#sort-clusters-btn').addClass('disabled');
    });
    // back to clusters
    $jq("#create-cluster-back-btn").click(function () {
        $jq('.carousel').carousel(0);
        $jq('.carousel').on('slid.bs.carousel', function () {
            // unbind event
            $jq(this).off('slid.bs.carousel');
            $jq('#create-cluster-panel-collapse').collapse('hide');
        });
        $jq('#toggle-cluster-block-btn').removeClass('disabled');
        $jq('#create-cluster-btn').removeClass('disabled');
        $jq('#sort-clusters-btn').removeClass('disabled');
    });
}

