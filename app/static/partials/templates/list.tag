<div ng-controller="templateController" class="col-md-10 col-lg-10 col-sm-10">
    <div class="col-md-4 col-lg-4 col-sm-4 " ng-repeat="template in $root.templates">
        <div class="thumbnail cb-pane">
            <h3 class="text-center">{{template.name}}</h3>
            <div class="caption">
                <ul class="media-list">
                    <li class="media" ng-show="template.description && template.description != ''">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-database fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.description}}</h4>
                        </div>
                    </li>

                    <li class="media">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-database fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.volumeCount}} Data disks</h4>
                        </div>
                    </li>

                    <li class="media">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-cubes fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.volumeCount}} x {{template.volumeSize}} GB storage</h4>
                        </div>
                    </li>

                    <li class="media" ng-show="template.cloudPlatform == 'GCP'">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-desktop fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.parameters.gcpInstanceType}}</h4>
                        </div>
                    </li>

                    <li class="media" ng-show="template.cloudPlatform == 'AZURE'">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-desktop fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.parameters.vmType}}</h4>
                        </div>
                    </li>

                    <li class="media" ng-show="template.cloudPlatform == 'AWS'">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-desktop fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.parameters.instanceType}}</h4>
                        </div>
                    </li>

                    <li class="media" ng-show="template.cloudPlatform == 'AWS'">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-cube fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.parameters.volumeType}}</h4>
                        </div>
                    </li>

                    <li class="media" ng-show="template.cloudPlatform == 'GCP'">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-cube fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">{{template.parameters.volumeType}}</h4>
                        </div>
                    </li>

                    <li class="media" ng-show="template.cloudPlatform == 'AWS' && template.parameters.encrypted">
                        <div class="media-left">
                            <a href="#">
                                <i class="fa fa-user-secret fa-3 media-icon"></i>
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading">Encrypted</h4>
                        </div>
                    </li>



                </ul>

            </div>
        </div>
    </div>
</div>