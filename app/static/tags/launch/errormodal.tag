<!-- Error Modal -->
   <!-- Modal content-->
   <div class="modal-content">
      <div class="modal-header modal-error">
         <button type="button" class="close" ng-click="cancel()">&times;</button>
         <h2 class="modal-title modal-title-h2">Error</h2>
      </div>
      <div class="modal-body">
         <div id="getStartedContent" class="tabcontent align-left">
            <h4>{{item.title}}</h4>
            <p class="lead"><mark>{{item.message}}</mark></p>
         </div>
      </div>
   </div>
<!--End of Modal -->