'use strict';

var $jq = jQuery.noConflict();

angular.module('uluwatuControllers').controller('launchController', ['$scope', '$rootScope', '$filter', 'UluwatuCluster', 'GlobalStack', 'Cluster', 'GlobalStackInstance', 'AccountNetwork', 'AccountSecurityGroup', '$interval', 'UserEvents', 'PeriscopeCluster', 'AccountBlueprint', 'AccountCredential', 'AccountTemplate',
    function ($scope, $rootScope, $filter, UluwatuCluster, GlobalStack, Cluster, GlobalStackInstance, AccountNetwork, AccountSecurityGroup, $interval, UserEvents, PeriscopeCluster, AccountBlueprint, AccountCredential, AccountTemplate) {

        var azureRegions = [
                    {key: 'WEST_US', value: 'West US', cloud: 'AZURE'},
                    {key: 'BRAZIL_SOUTH', value: 'Brazil South', cloud: 'AZURE'},
                    {key: 'EAST_US', value: 'East US', cloud: 'AZURE'},
                    {key: 'CENTRAL_US', value: 'Central US', cloud: 'AZURE'},
                    {key: 'SOUTH_CENTRAL_US', value: 'South Central US'},
                    {key: 'NORTH_CENTRAL_US', value: 'North Central US', cloud: 'AZURE'},
                    {key: 'EAST_US_2', value: 'East US 2', cloud: 'AZURE'}
                ];

        $rootScope.activeCluster = {};
        $scope.showGetStarted = true;
        $scope.periscopeShow = false;
        $scope.metricsShow = false;

        $scope.securityGroups = AccountSecurityGroup.query()
        $scope.networks = AccountNetwork.query();
        $scope.blueprints = AccountBlueprint.query();
        $scope.credentials = AccountCredential.query();
        $scope.templates = AccountTemplate.query();
        getUluwatuClusters();

        $scope.changeShowGetStarted = function() {
            $scope.showGetStarted = !$scope.showGetStarted;
        }

        $scope.isUndefined = function (variable) {
            return angular.isUndefined(variable) || variable === null;
        }

        $scope.createCluster = function (blueprintName) {
            var blueprint = $filter('filter')($scope.blueprints, {name: blueprintName}, true)[0];
            $scope.cluster = initCluster(blueprint);
            $scope.cluster.ambariStackDetails = null;

            if (blueprint.hostGroupCount > $scope.cluster.nodeCount) {
                $scope.showErrorMessage($rootScope.msg.hostgroup_invalid_node_count);
                return;
            }
            if (blueprint.hostGroupCount === 1 && $scope.cluster.nodeCount != 1) {
                $scope.showErrorMessage($rootScope.msg.hostgroup_single_invalid);
                return;
            }

            UluwatuCluster.save($scope.cluster, function (result) {
                var nodeCount = 0;
                angular.forEach(result.instanceGroups, function(group) {
                  nodeCount += group.nodeCount;
                });
                result.nodeCount = nodeCount;
                result.cloudPlatform = 'AZURE_RM';
                result.public = $scope.cluster.public;
                angular.forEach(result.instanceGroups, function(item) {
                  item.templateId = parseFloat(item.templateId);
                });
                result.blueprintId = parseFloat(result.blueprintId);

                var existingCluster = $filter('filter')($rootScope.clusters, {id: result.id}, true)[0];
                if (existingCluster != undefined) {
                    existingCluster = result;
                } else {
                    $rootScope.clusters.push(result);
                }
            }, function(failure) {
                $scope.showError(failure, $rootScope.msg.cluster_failed);
            });
        }

        $scope.deleteCluster = function (cluster) {
            UluwatuCluster.delete(cluster, function (result) {
                var actCluster = $filter('filter')($rootScope.clusters, { id: cluster.id }, true)[0];
                actCluster.status = "DELETE_IN_PROGRESS";
                $scope.$broadcast('DELETE_PERISCOPE_CLUSTER', cluster.id);
            }, function (failure){
                $scope.showError(failure, $rootScope.msg.cluster_delete_failed);
            });
        }

        $scope.$watch('pagination.currentPage + pagination.itemsPerPage', function(){
            if ($rootScope.activeCluster.metadata != null) {
                paginateMetadata();
            }
        });

        $rootScope.$watch('activeCluster.metadata', function() {
            if ($rootScope.activeCluster.metadata != null) {
                paginateMetadata();
            }
        });

        function paginateMetadata() {
            if ($scope.pagination != null) {
                $scope.pagination.totalItems = $rootScope.activeCluster.metadata.length;
                var begin = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage),
                end = begin + $scope.pagination.itemsPerPage;
                $scope.filteredActiveClusterData = addStatesToMetadata($rootScope.activeCluster.metadata.slice(begin, end));
            } else {
                $scope.filteredActiveClusterData = [];
            }
        }

        function addStatesToMetadata(filteredData) {
            angular.forEach(filteredData, function(data){
                if (data != null && data.discoveryFQDN != null) {
                    var hostGroup = $filter('filter')($rootScope.activeCluster.cluster.hostGroups, {instanceGroupName: data.instanceGroup});
                    if (hostGroup != null && hostGroup.length > 0) {
                        var hostMetadata = $filter('filter')(hostGroup[0].metadata, {name: data.discoveryFQDN})
                        if (hostMetadata != null && hostMetadata.length > 0) {
                            data.state = hostMetadata[0].state
                        }
                    }
                }
            });
            return filteredData;
        }

        $rootScope.events = [];

        $scope.loadEvents = function () {
            $rootScope.events = UserEvents.query(function(success) {
                angular.forEach(success, function(item) {
                    item.customTimeStamp =  new Date(item.eventTimestamp).toLocaleDateString() + " " + new Date(item.eventTimestamp).toLocaleTimeString();
                });
            });
        }

        $scope.loadEvents();

        $scope.stopCluster = function (activeCluster) {
            var newStatus = {"status":"STOPPED"};
            Cluster.update({id: activeCluster.id}, newStatus, function(success){
                GlobalStack.update({id: activeCluster.id}, newStatus, function(result){
                  activeCluster.status = "STOP_REQUESTED";
                }, function(error) {
                  $scope.showError(error, $rootScope.msg.cluster_stop_failed);
                });

            }, function(error) {
              $scope.showError(error, $rootScope.msg.cluster_stop_failed);
            });
        }

        $scope.startCluster = function (activeCluster) {
            var newStatus = {"status":"STARTED"};
            GlobalStack.update({id: activeCluster.id}, newStatus, function(result){

                Cluster.update({id: activeCluster.id}, newStatus, function(success){
                    activeCluster.status = "START_REQUESTED";
                }, function(error) {
                  $scope.showError(error, $rootScope.msg.cluster_start_failed);
                });

            }, function(error) {
              $scope.showError(error, $rootScope.msg.cluster_start_failed);
            });
        }

        $scope.syncCluster = function (activeCluster) {
            var newStatus = {"status":"SYNC"};
            GlobalStack.update({id: activeCluster.id}, newStatus, function(result){
                Cluster.update({id: activeCluster.id}, newStatus, function(success){}, function(error) {
                    $scope.showError(error, $rootScope.msg.cluster_sync_failed);
                });
            }, function(error) {
                $scope.showError(error, $rootScope.msg.cluster_sync_failed);
            });
        }

        $scope.requestStatusChange = function(cluster) {
            if(cluster.status == "STOPPED") {
                $scope.startCluster(cluster);
            } else if(cluster.status == "AVAILABLE") {
                $scope.stopCluster(cluster);
            }
        }

        function getUluwatuClusters(){
          UluwatuCluster.query(function (clusters) {
              $rootScope.clusters = clusters;
              angular.forEach($rootScope.clusters, function(item) {
                   var nodeCount = 0;
                   angular.forEach(item.instanceGroups, function(group) {
                       nodeCount += group.nodeCount;
                   });
                   item.nodeCount = nodeCount;
              });
              $scope.$parent.orderClusters();
          });
        }

        $scope.selectCluster = function(cluster) {
            $scope.selectedCluster = cluster
        }

        function initCluster(blueprint){
            var credential = $filter('filter')($scope.credentials, {name: 'launcharmazure', cloudPlatform: 'AZURE_RM'}, true)[0];
            var network = $filter('filter')($scope.networks, {name: 'default-azure-network', cloudPlatform: 'AZURE'}, true)[0];
            var securityGroup = $filter('filter')($scope.securityGroups, {name: 'all-services-port'}, true)[0];
            var template = $filter('filter')($scope.templates, {name: 'd3forlaunch', cloudPlatform: 'AZURE'}, true)[0];
            var cluster = {
                name: blueprint.name,
                password: "admin",
                userName: "admin",
                onFailureAction: "DO_NOTHING",
                bestEffort: "BEST_EFFORT",
                validateBlueprint: true,
                consulServerCount: 3,
                parameters: {},
                failurePolicy: {
                  adjustmentType: "BEST_EFFORT",
                },
                credentialId: credential.id,
                networkId: network.id,
                securityGroupId: securityGroup.id,
                blueprintId: blueprint.id,
                region: azureRegions[0].key
            };
            
            var instanceGroups = [];
            var hostGroups = [];
            instanceGroups.push({templateId: template.id, group: "cbgateway", nodeCount: 1, type: "GATEWAY"});
            blueprint.ambariBlueprint.host_groups.forEach(function(k){
            instanceGroups.push({templateId: template.id, group: k.name, nodeCount: 1, type: "CORE"});
                hostGroups.push({name: k.name, instanceGroupName: k.name})
            });
            cluster.instanceGroups = instanceGroups;
            cluster.hostGroups = hostGroups;

            prepareParameters(cluster);
            return cluster;
        }

        function prepareParameters (cluster) {
            if (cluster.consulServerCount === null || cluster.consulServerCount === undefined) {
              delete cluster.consulServerCount;
            }
            for (var item in cluster.parameters) {
                if (cluster.parameters[item] === "" || cluster.parameters[item] === undefined) {
                  delete cluster.parameters[item];
                }
            }
        }

    }]);
