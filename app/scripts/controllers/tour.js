'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('TourCtrl', function ($scope, $timeout) {

    $scope.nextLabel = 'next';

    $scope.onBeforeChangeEvent = function (element) { 
        console.log("Before Change Event called"); 
        
        var eID = element.id;
        switch(eID){
          case "menu-toggle":
            //$scope.IntroOptions.nextLabel = "hi";
            element.onclick = function(event){
              document.querySelector('.introjs-nextbutton').click();
              console.log('you set an event listener')
              $scope.nextLabel = 'good job';
              $timeout(function(){}, 200);
            }
            //introJs(4).setOption("nextLable", "swag").start()
            break;
          case "shortcuts-button":
            $scope.$on('modal-shown', function() {

            });
            break;
          case "editor-tab":
            break;
          case "gists-tab":
            break;
          case "images-tab":
            break;
          case "sensors-tab":
            break;
          case "channels-tab":
            break;
          case "logging-tab":
            break;
          case "annotation-tab":
            break;
          case "weariverse-tab":
            break;
        }
      };
    

    $scope.onChangeEvent = function (element) { 
      console.log("Change Event called");
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      var eID = element.id;
      switch(eID){
        case "menu-toggle":

          break;
        case "editor-tab":
          break;
        case "gists-tab":
          break;
        case "images-tab":
          break;
        case "sensors-tab":
          break;
        case "channels-tab":
          break;
        case "logging-tab":
          break;
        case "annotation-tab":
          break;
        case "weariverse-tab":
          break;
      }
    };

    $scope.onAfterChangeEvent = function (element) { 
      console.log("After Change Event called"); 
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      
      var eID = element.id;
      switch(eID){
        case "menu-toggle":
          element.onClick = null

          break;
        case "editor-tab":
          break;
        case "gists-tab":
          break;
        case "images-tab":
          break;
        case "sensors-tab":
          break;
        case "channels-tab":
          break;
        case "logging-tab":
          break;
        case "annotation-tab":
          break;
        case "weariverse-tab":
          break;
      }
    };

    $scope.onExitEvent = function () { 
      console.log("Exit Change Event called");
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      
    };

    $scope.onCompletedEvent = function (element) {
      console.log("Completed Event called"); 
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      
    };

    $scope.steps = [
        {
          element: '#menu-toggle',
          intro: "Click this button to toggle the menu on the left.",
          position: 'right'
        },
        {
          element: '#menu-toggle',
          intro: "Ok now press it again to re-open the modal",
          position: 'right'
        },
        {
          element: '#shortcuts-button',
          intro: "Shortcuts can be found here when the editor is open.",
          position: 'left'
        },
        {
          element: '#editor-tab',
          intro: "This is the editor tab. It is where all of the coding happens!",
          position: 'right'
        },
        {
          element: '#gists-tab',
          intro: "Save your code as Gists on Github!",
          position: 'right'
        },
        {
          element: '#images-tab',
          intro: "Tab to view pictures from your devices.",
          position: 'right'
        },
        {
          element: '#sensors-tab',
          intro: "This is the Sensors tab",
          position: 'right'
        },
        {
          element: '#channels-tab',
          intro: 'This is the Channels tab',
          position: 'right'
        },
        {
          element: '#logging-tab',
          intro: 'This is the Logging tab',
          position: 'right'
        },
        {
          element: '#annotation-tab',
          intro: 'This is the Annotation tab',
          position: 'right'
        },
        {
          element: '#weariverse-tab',
          intro: 'This is the Weariverse tab',
          position: 'right'
        }
      ]
    $scope.IntroOptions = {
      steps: $scope.steps,
      showStepNumbers: false,
      exitOnOverlayClick: true,
      exitOnEsc:true,
      nextLabel: 'next',
      prevLabel: 'prev',
      skipLabel: 'Exit',
      doneLabel: 'Thanks'
    };

    $scope.startTour = function(){

    }

  });
