<br/>   <br/>
<div class="col-md-12 green-border">
    <div class="col-md-4"><span class="blue">Blueprint Name</span> : {{blueprint.name}}</div>
    <div class="col-md-4"><span class="blue">Stack Name</span> : {{blueprint.stack_name}}</div>
    <div class="col-md-4"><span class="blue">Stack Version</span> : {{blueprint.stack_version}}</div>
</div>
<div class="row" ng-repeat="hostgroup in blueprint.ambariBlueprint.host_groups track by $index" ng-if="$index % 4 == 0">
   <div ng-repeat="i in [$index, $index + 1, $index + 2, $index + 3]" ng-if="blueprint.ambariBlueprint.host_groups[i] != null">
      <div class="col-md-3">
        <ul class="services-list">
            <br/>
            <span class="blue">{{blueprint.ambariBlueprint.host_groups[i].name}}</span>
            <li ng-repeat="component in blueprint.ambariBlueprint.host_groups[i].components">{{component.name}}</li>
        </ul>
    </div>
   </div>
</div>
