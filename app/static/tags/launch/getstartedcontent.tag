<div ng-controller="launchController">

<div id="getStartedPanel" ng-show="showGetStarted">
<h2>Select Cluster Configuration</h2>
<div class="wrapper">
   <div id="track-container">
      <div class="one-track col-md-3 col-sm-6 col-xs-6">
         <img src="images/splash/developer.png" class="track-img">
         <div class="track-text">
            <h5>Data Developer</h5>
            Develop Data Apps with Hadoop &amp; Spark
         </div>
         <br/>
         <button type="button" class="btn  btn-hdp" data-toggle="modal" data-target="#sandbox-equivalent">
         <a>View Cluster Details &raquo;</a>
         </button>
      </div>
      <!-- Modal -->
      <div id="sandbox-equivalent" class="modal fade" role="dialog">
         <div class="modal-dialog modal-lg">
            <!-- Modal content-->
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Additional Cluster Configuration Details</h2>
               </div>
               <div class="modal-body">
                  <div id="getStartedContent" class="tabcontent align-left">
                     <h6>Configuration: Data Developer Cluster</h6>
                     <div ng-repeat="blueprint in blueprints | filter:{name:'multi-node-hdfs-yarn'}:true">
                        <div ng-include src="'tags/launch/getstartedblueprintlist.tag'"></div>
                     </div>
                     <!--end wrapper-->
                  </div>
               </div>
               <div class="modal-footer">
                  <h6><a class="orangelink pull-left" href="" data-dismiss="modal">&laquo; Back to Cluster Configurations</a></h6>
                  <button class="btn btn-hdp pull-right">
                  <a href="splash2.html">Confirm Cluster Configuration &raquo;</a>
                  </button>
               </div>
            </div>
         </div>
      </div>
      <!--End of Modal -->
      <div class="one-track col-md-3 col-sm-6 col-xs-6">
         <img src="images/splash/admin.png" class="track-img">
         <div class="track-text">
            <h5>Operator</h5>
            Administar and secure Hadoop Cluster
         </div>
         <br/>
         <button type="button" class="btn  btn-hdp" data-toggle="modal" data-target="#small">
         <a>View Cluster Details &raquo;</a>
         </button>
      </div>
      <!-- Modal -->
      <div id="small" class="modal fade" role="dialog">
         <div class="modal-dialog modal-lg">
            <!-- Modal content-->
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Additional Cluster Configuration Details</h2>
               </div>
               <div class="modal-body">
                  <div id="getStartedContent" class="tabcontent align-left">
                     <h6>Configuration: Hadoop Operator Cluster</h6>
                     <div ng-repeat="blueprint in blueprints | filter:{name:'multi-node-hdfs-yarn-incorrect'}:true">
                        <div ng-include src="'tags/launch/getstartedblueprintlist.tag'"></div>
                     </div>
                     <!--end wrapper-->
                  </div>
               </div>
               <div class="modal-footer">
                  <h6><a class="orangelink pull-left" href="" data-dismiss="modal">&laquo; Back to Cluster Configurations</a></h6>
                  <button class="btn btn-hdp pull-right">
                  <a>Confirm Cluster Configuration &raquo;</a>
                  </button>
               </div>
            </div>
         </div>
      </div>
      <!--End of Modal -->
      <div class="one-track col-md-3 col-sm-6 col-xs-6">
         <img src="images/configs/streaming-config-icon.png" class="track-img">
         <div class="track-text">
            <h5>Streaming Developer</h5>
            Develop real-time Apps with Hadoop
         </div>
         <br/>
         <button type="button" class="btn  btn-hdp" data-toggle="modal" data-target="#streaming">
         <a>View Cluster Details &raquo;</a>
         </button>
      </div>
      <!-- Modal -->
      <div id="streaming" class="modal fade" role="dialog">
         <div class="modal-dialog modal-lg">
            <!-- Modal content-->
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Additional Cluster Configuration Details</h2>
               </div>
               <div class="modal-body">
                  <div id="getStartedContent" class="tabcontent align-left">
                     <h6>Configuration: Stream Processing Cluster</h6>
                     <div ng-repeat="blueprint in blueprints | filter:{name:'hdp-spark-cluster'}:true">
                        <div ng-include src="'tags/launch/getstartedblueprintlist.tag'"></div>
                     </div>
                     <!--end wrapper-->
                  </div>
               </div>
               <div class="modal-footer">
                  <h6><a class="orangelink pull-left" href="" data-dismiss="modal">&laquo; Back to Cluster Configurations</a></h6>
                  <button class="btn btn-hdp pull-right">
                  <a href="splash2.html">Confirm Cluster Configuration &raquo;</a>
                  </button>
               </div>
            </div>
         </div>
      </div>
      <!--End of Modal -->
      <div class="one-track col-md-3 col-sm-6 col-xs-6">
         <img src="images/configs/spark-ready-config-icon.png" class="track-img">
         <div class="track-text">
            <h5>Data Scientist</h5>
            Analyze data with Hadoop &amp; Spark
         </div>
         <br/>
         <button type="button" class="btn  btn-hdp" data-toggle="modal" data-target="#spark">
         <a>View Cluster Details &raquo;</a>
         </button>
      </div>
      <!-- Modal -->
      <div id="spark" class="modal fade" role="dialog">
         <div class="modal-dialog modal-lg">
            <!-- Modal content-->
            <div class="modal-content">
               <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h2 class="modal-title">Additional Cluster Configuration Details</h2>
               </div>
               <div class="modal-body">
                  <div id="getStartedContent" class="tabcontent align-left">
                     <h6>Configuration: Data Analysis Cluster</h6>
                     <div ng-repeat="blueprint in blueprints | filter:{name:'hdp-multinode-default'}:true">
                        <div ng-include src="'tags/launch/getstartedblueprintlist.tag'"></div>
                     </div>
                     <!--end wrapper-->
                  </div>
               </div>
               <div class="modal-footer">
                  <h6><a class="orangelink pull-left" href="" data-dismiss="modal">&laquo; Back to Cluster Configurations</a></h6>
                  <button id="confirm-action" class="btn btn-hdp pull-right" data-toggle="modal" data-target="#myModal">
                  <a href="">Confirm Cluster Configuration &raquo;</a>
                  </button>
               </div>
            </div>
         </div>
      </div>
      <!--End of Modal -->
      <!-- Modal -->
      <div id="myModal" class="modal fade" role="dialog">
         <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
               <div class="modal-header modal-header-blue">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Cluster Creation In Progress</h4>
               </div>
               <div class="modal-body">
                  <p>Creating cluster with Spark Ready Configuration</p>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
</div>






<div ng-show="!showGetStarted">
         <h2> Clusters </h2>
         <button class="btn btn-hdp pull-right" ng-click="changeShowGetStarted()"> <a href="">&#43; Create Cluster</a></button>
         <div class="panel-group" id="accordion" aria-multiselectable="false">
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h4 class="panel-title">
                     <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="" data-target="#collapseOne">
                     employee_analysis_231  [ 4 nodes ]
                     </a>
                     <div class="pull-right"><input type="checkbox" checked data-toggle="toggle" data-style="ios" data-onstyle="success" data-size="mini"></div>
                  </h4>
               </div>
               <div id="collapseOne" class="panel-collapse collapse in">
                  <div class="panel-body">
                     <div class="col-md-6">
                        <h5>Login Details</h5>
                        <div class="col-md-6 col-sm-12 nopadding">
                           <h6>Apache Ambari</h6>
                           <br/>
                           <h7>url:</h7>
                           <a href="http://127.0.0.1:8000" target="_blank">http://127.0.0.1:8000</a>
                           <h7>username:</h7>
                           user
                           <br/>
                           <h7>password:</h7>
                           password
                           <br/>
                        </div>
                        <div class="col-md-6 col-sm-12">
                           <h6>Apache Ambari</h6>
                           <br/>
                           <h7>url:</h7>
                           <a href="http://127.0.0.1:8000" target="_blank">http://127.0.0.1:8000</a>
                           <h7>username:</h7>
                           user
                           <br/>
                           <h7>password:</h7>
                           password
                           <br/>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="col-md-12 col-sm-12">
                           <ul class="services-list">
                              <h5>Services</h5>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h4 class="panel-title">
                     <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="" data-target="#collapseTwo">
                     sales_analysis_details  [ 12 nodes ]
                     </a>
                     <div class="pull-right"><input type="checkbox" data-toggle="toggle" data-style="ios" data-onstyle="success" data-size="mini"></div>
                  </h4>
               </div>
               <div id="collapseTwo" class="panel-collapse collapse">
                  <div class="panel-body">
                     <div class="col-md-6">
                        <h5>Login Details</h5>
                        <div class="col-md-6 col-sm-12 nopadding">
                           <h6>Apache Ambari</h6>
                           <br/>
                           <h7>url:</h7>
                           <a href="http://127.0.0.1:8000" target="_blank">http://127.0.0.1:8000</a>
                           <h7>username:</h7>
                           user
                           <br/>
                           <h7>password:</h7>
                           password
                           <br/>
                        </div>
                        <div class="col-md-6 col-sm-12">
                           <h6>Apache Ambari</h6>
                           <br/>
                           <h7>url:</h7>
                           <a href="http://127.0.0.1:8000" target="_blank">http://127.0.0.1:8000</a>
                           <h7>username:</h7>
                           user
                           <br/>
                           <h7>password:</h7>
                           password
                           <br/>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="col-md-12 col-sm-12">
                           <ul class="services-list">
                              <h5>Services</h5>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h4 class="panel-title">
                     <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="" data-target="#collapseThree">
                     products_analysis_details  [ 7 nodes ]
                     </a>
                     <div class="pull-right"><input type="checkbox" data-toggle="toggle" data-style="ios" data-onstyle="success" data-size="mini"></div>
                  </h4>
               </div>
               <div id="collapseThree" class="panel-collapse collapse">
                  <div class="panel-body">
                     <div class="col-md-6">
                        <h5>Login Details</h5>
                        <div class="col-md-6 col-sm-12 nopadding">
                           <h6>Apache Ambari</h6>
                           <br/>
                           <h7>url:</h7>
                           <a href="http://127.0.0.1:8000" target="_blank">http://127.0.0.1:8000</a>
                           <h7>username:</h7>
                           user
                           <br/>
                           <h7>password:</h7>
                           password
                           <br/>
                        </div>
                        <div class="col-md-6 col-sm-12">
                           <h6>Apache Ambari</h6>
                           <br/>
                           <h7>url:</h7>
                           <a href="http://127.0.0.1:8000" target="_blank">http://127.0.0.1:8000</a>
                           <h7>username:</h7>
                           user
                           <br/>
                           <h7>password:</h7>
                           password
                           <br/>
                        </div>
                     </div>
                     <div class="col-md-6">
                        <div class="col-md-12 col-sm-12">
                           <ul class="services-list">
                              <h5>Services</h5>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                              <li>Link 1: <a>http://127.0.0.1:5463</a></li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <!--end wrapper-->
         <!--end wrapper-->
      </div>

</div>