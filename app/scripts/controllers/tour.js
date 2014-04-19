'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('TourCtrl', function ($scope, $timeout) {

    $scope.nextLabel = 'next';

    $scope.onBeforeChangeEvent = function (element) { 
        console.log("Before Change Event called"); 
        //console.log($scope.intro)
        
        var eID = element.id;
        switch(eID){
          case "menu-toggle":
            //$scope.IntroOptions.nextLabel = "hi";
            /*
            element.onclick = function(event){
              document.querySelector('.introjs-nextbutton').click();
              console.log('you set an event listener')
              $scope.nextLabel = 'good job';
            }
            //introJs(4).setOption("nextLable", "swag").start()
            break;
          case "shortcuts-button":
            $scope.$on('modal-shown', function() {

            });
            */
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
          //element.onClick = null

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
          element: '#page-title-text',
          intro: "Welcome! You are currently in the WearScript Playground. Use your arrow keys or press the next button to continue with the tour!",
          position: 'bottom'
        },
        {
          element: '#menu-toggle',
          intro: "Clicking this button will toggle the menu on the left.",
          position: 'right'
        },
        {
          element: '#shortcuts-button',
          intro: "Keyboard shortcuts can be found by clicking this button.",
          position: 'left'
        },
        {
          element: '#file-manager',
          intro: "Clicking this button will allow you to create or edit other files in this gist.",
          position: 'left'
        },
        {
          element: '#connection-status',
          intro: "The connection status of the server and glass will be displayed here. <span style='color:green;'>Green</span> means connected and <span style='color:red;'>Red</span> means not connected.",
          position: 'left'
        },
        {
          element: '#setup',
          intro: "Setup your devices with WearScript and auth with GitHub by clicking on the gears.",
          position: 'top'
        },
        {
          element: '#apidocs',
          intro: "To find out more information about WearScript and for detailed docs click on the question mark.",
          position: 'top'
        },
        {
          element: '#statusBar',
          intro: "You can find contextual information about your project status in the status bar.",
          position: 'top'
        },
        {
          element: '#tabs',
          intro: "You can find all of the menus in the nav bar.",
          position: 'right'
        },
        {
          element: '#editor-tab',
          intro: "This is the editor-tab. It is where all of the WearScript coding happens.",
          position: 'right'
        },
        {
          element: '#gists-tab',
          intro: "Use the Gists tab to view and load gists.",
          position: 'right'
        },
        {
          element: '#weariverse-tab',
          intro: 'This is the Weariverse tab',
          position: 'right'
        },
        {
          element: '#images-tab',
          intro: "When you wear a script that uses your devices camera, the imagery will be displayed in this tab.",
          position: 'right'
        },
        {
          element: '#sensors-tab',
          intro: "Use this tab to view a graphical representation of sensor data.",
          position: 'right'
        },
        {
          element: '#channels-tab',
          intro: 'This is the Channels tab',
          position: 'right'
        },
        {
          element: '#logging-tab',
          intro: 'View logs in the logging tab',
          position: 'right'
        }
      ]
    $scope.IntroOptions = {
      steps: $scope.steps,
      scrollToElement: false,
      showStepNumbers: false,
      exitOnOverlayClick: true,
      exitOnEsc:true,
      nextLabel: 'next',
      prevLabel: 'prev',
      skipLabel: 'Exit',
      doneLabel: 'Thanks'
    };

  });
