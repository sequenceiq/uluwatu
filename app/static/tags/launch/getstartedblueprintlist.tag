<br/>   <br/>
<div class="col-md-12 green-border">
    <div class="col-md-4"><span class="blue">Blueprint Name</span> : {{blueprint.name}}</div>
    <div class="col-md-4"><span class="blue">Stack Name</span> : {{blueprint.stack_name}}</div>
    <div class="col-md-4"><span class="blue">Stack Version</span> : {{blueprint.stack_version}}</div>
</div>
<div class="row">
   <div ng-repeat="hostgroup in blueprint.ambariBlueprint.host_groups">
      <div class="col-md-3">
        <ul class="services-list">
            <br/>
            <span class="blue">{{hostgroup.name}}</span>
            <li ng-repeat="component in hostgroup.components">{{component.name}}</li>
        </ul>
    </div>
   </div>
</div>
