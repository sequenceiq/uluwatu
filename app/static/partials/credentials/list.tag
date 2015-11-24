<div ng-controller="credentialController" class="col-md-10 col-lg-10 col-sm-10">
    <div class="col-md-3 col-lg-3 col-sm-3" ng-repeat="credential in $root.credentials">
        {{credential.name}}
    </div>
</div>