<!-- Confirmation Modal -->
<div class="modal-content">
   <div class="modal-header modal-confirmation">
      <button type="button" class="close" ng-click="cancel()">&times;</button>
      <h2 class="modal-title modal-title-h2">Confirmation</h2>
   </div>
   <div class="modal-body">
      <div id="getStartedContent" class="tabcontent align-left">
         {{item.modalMsg}} <code>{{item.cluster.name}}</code>?
         <!--end wrapper-->
      </div>
   </div>
   <div class="modal-footer">
      <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button>
      <button class="btn btn-hdp pull-right" ng-click="ok()"><a>Confirm</a></button>
   </div>
</div>
<!--End of Modal -->