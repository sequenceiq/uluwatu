'use strict';

var $jq = jQuery.noConflict();

angular.module('uluwatuControllers').controller('launchController', ['$scope', '$rootScope', '$filter', '$timeout', 'UluwatuCluster', 'GlobalStack', 'Cluster', 'GlobalStackInstance', 'AccountNetwork', 'AccountSecurityGroup', '$interval', 'UserEvents', 'AccountBlueprint', 'AccountCredential', 'AccountTemplate',
    function ($scope, $rootScope, $filter, $timeout, UluwatuCluster, GlobalStack, Cluster, GlobalStackInstance, AccountNetwork, AccountSecurityGroup, $interval, UserEvents, AccountBlueprint, AccountCredential, AccountTemplate) {

        var azureRegions = [
                    {key: 'WEST_US', value: 'West US', cloud: 'AZURE'},
                    {key: 'EAST_US', value: 'East US', cloud: 'AZURE'},
                    {key: 'CENTRAL_US', value: 'Central US', cloud: 'AZURE'},
                    {key: 'SOUTH_CENTRAL_US', value: 'South Central US'},
                    {key: 'NORTH_CENTRAL_US', value: 'North Central US', cloud: 'AZURE'},
                    {key: 'EAST_US_2', value: 'East US 2', cloud: 'AZURE'}
                ];

        $rootScope.activeCluster = {};
        $rootScope.activeCredential = {};
        $rootScope.showGetStarted = true;
        $scope.periscopeShow = false;
        $scope.metricsShow = false;
        $scope.activeMetadata = {};

        $scope.securityGroups = AccountSecurityGroup.query()
        $scope.networks = AccountNetwork.query();
        $scope.blueprints = AccountBlueprint.query();
        $scope.credentials = AccountCredential.query();
        $scope.templates = AccountTemplate.query();
        getUluwatuClusters();

        $scope.changeShowGetStarted = function() {
            $rootScope.showGetStarted = !$scope.showGetStarted;
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
            $scope.cluster.name = $scope.cluster.name + getHash();
            $scope.cluster.userName = $scope.user.email.split("@")[0].replace(/[^\w\s]/gi, '_').replace(/_/g,'');
            $scope.cluster.password = generatePassword();
            var regionNumber = new Date().getTime() % azureRegions.length;
            $scope.cluster.region = azureRegions[regionNumber].key;
            $scope.cluster.storageAccountRegion = azureRegions[regionNumber].value;
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
                result.stackCredential = $rootScope.activeCredential;
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

        $scope.selectMetadata = function (metadata, userName) {
            $scope.activeMetadata = metadata;
            $scope.activeUsername = userName;
        }

        $scope.deleteCluster = function (cluster) {
            UluwatuCluster.delete(cluster, function (result) {
                var actCluster = $filter('filter')($rootScope.clusters, { id: cluster.id }, true)[0];
                actCluster.status = "DELETE_IN_PROGRESS";
                $scope.$broadcast('DELETE_PERISCOPE_CLUSTER', cluster.id);
                $scope.setProgressForStatus(actCluster);
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
                   var credential = $filter('filter')($scope.credentials, {id: item.credentialId, cloudPlatform: 'AZURE_RM'}, true)[0];
                   item.stackCredential= credential;
                   angular.forEach(item.instanceGroups, function(group) {
                       nodeCount += group.nodeCount;
                   });
                   item.nodeCount = nodeCount;
                   item.progress = $scope.setProgressForStatus(item);
              });
              $scope.$parent.orderClusters();
          });
        }

        $rootScope.setProgressForStatus = function(actCluster){
            if (actCluster.status == 'AVAILABLE') {
                if (actCluster.cluster != undefined && actCluster.cluster.status != 'REQUESTED') {
                    if (actCluster.cluster.status == 'AVAILABLE') {
                        return 100;
                    } else if ($scope.endsWith(actCluster.cluster.status, 'FAILED')){
                        return 100;
                    } else if (actCluster.cluster.status == 'UPDATE_IN_PROGRESS') {
                        return 75;
                    }
                }
                return 50;
            } else if ($scope.endsWith(actCluster.status, 'FAILED')){
                return 100;
            } else if (actCluster.status == 'UPDATE_IN_PROGRESS') {
                if (actCluster.cluster.status == 'UPDATE_IN_PROGRESS') {
                    return 75;
                }
                return 25;
            } else if (actCluster.status == 'CREATE_IN_PROGRESS') {
                return 25;
            } else if (actCluster.status == 'DELETE_IN_PROGRESS') {
                return 100;
            }
            return 0;
        }

        $rootScope.endsWith = function(str, suffix) {
            if (str != undefined) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            } else {
                return false;
            }
        }

        $rootScope.startWith = function(str, suffix) {
            if (str === undefined) {
                return false;
            } else {
                return str.indexOf(suffix) === 0;
            }
        }

        $scope.isFailedCluster = function(cluster) {
            if ($scope.endsWith(cluster.status, 'FAILED')) {
                return true;
            } else if ($scope.startWith(cluster.status, 'DELETE_')) {
                return true;
            } else if (cluster.cluster != undefined) {
                if($scope.endsWith(cluster.cluster.status, 'FAILED')) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        $scope.errorMessageTransformer = function(cluster){
            if (cluster.statusReason != undefined) {
                return cluster.statusReason.replace(new RegExp("^.+Exception: "), "").replace(new RegExp("^.+due to: "), "");
            }
            return "";
        }

        $scope.selectCluster = function(cluster) {
            $scope.selectedCluster = cluster
        }

        function initCluster(blueprint){
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
                progress: 0,
                failurePolicy: {
                  adjustmentType: "BEST_EFFORT",
                },
                networkId: network.id,
                securityGroupId: securityGroup.id,
                blueprintId: blueprint.id,
                region: azureRegions[0].key,
                validateBlueprint: false,
                "public": false
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

        function generatePassword() {
            var letters = ['a','b','c','d','e','f','g','h','i','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            var BigLetters = ['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            var numbers = [0,1,2,3,4,5,6,7,8,9];
            var randomstring = '';

            for(var i=0;i<5;i++){
                var rlet = Math.floor(Math.random()*letters.length);
                randomstring += letters[rlet];
            }
            for(var i=0;i<3;i++){
                var rlet = Math.floor(Math.random()*BigLetters.length);
                randomstring += BigLetters[rlet];
            }
            for(var i=0;i<3;i++){
                var rnum = Math.floor(Math.random()*numbers.length);
                randomstring += numbers[rnum];
            }
            return randomstring += '!?';
        }

        function getHash() {
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            var result = (random+current_date).split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
            return result.toString().substring(result.toString().length - 4, result.toString().length);
        }

        $scope.onTimeout = function(){
            if($scope.user.expired != null && $scope.user.expired != undefined) {
                $scope.user.expired.second = $scope.user.expired.second - 1;
                $scope.user.expired.secondString = $scope.user.expired.second;
                if ($scope.user.expired.second <= 0) {
                    $scope.user.expired.minute = $scope.user.expired.minute - 1;
                    $scope.user.expired.second = 59;
                    $scope.user.expired.secondString = $scope.user.expired.second;
                }
                if ($scope.user.expired.minute <= 0) {
                    $scope.user.expired.hour = $scope.user.expired.hour - 1;
                    $scope.user.expired.minute = 59;
                    $scope.user.expired.minuteString = $scope.user.expired.minute;
                }
                if ($scope.user.expired.minute < 10) {
                    $scope.user.expired.minuteString = '0' + $scope.user.expired.minute;
                }
                if ($scope.user.expired.second < 10) {
                    $scope.user.expired.secondString = '0' + $scope.user.expired.second;
                }
                if ($scope.user.expired.hour < 10 && $scope.user.expired.hour > -1) {
                    $scope.user.expired.hourString = '0' + $scope.user.expired.hour;
                } else {
                    $scope.user.expired.hourString = $scope.user.expired.hour;
                }
            }
            mytimeout = $timeout($scope.onTimeout,1000);
        }
        var mytimeout = $timeout($scope.onTimeout,1000);

    }]);
