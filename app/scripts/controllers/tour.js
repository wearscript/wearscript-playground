'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('TourCtrl', function ($scope) {
    
    $scope.onCompletedEvent = function (element) {
      console.log("Completed Event called"); 
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      
    };

    $scope.onExitEvent = function () { 
      console.log("Exit Change Event called");
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      
    };

    $scope.onBeforeChangeEvent = function () { 
      console.log("Before Change Event called"); 
      console.log("DEBUG: " + arguments.length +" arguments were passed.");

    };

    $scope.onChangeEvent = function (element) { 
      console.log("Change Event called");
      console.log("DEBUG: " + arguments.length +" arguments were passed.");
      
    };

    $scope.onAfterChangeEvent = function () { 
      console.log("After Change Event called"); 
      console.log("DEBUG: " + arguments.length +" arguments were passed.");

    };

    $scope.IntroOptions = {
      steps:[
        {
          element: document.querySelector('#editor-tab'),
          intro: "This is the editor tab. It is where all of the coding happens!",
          position: 'right'
        },
        {
          element: document.querySelectorAll('#step2')[0],
          intro: "Save your code as Gists on Github!",
          position: 'right'
        },
        {
          element: '#step3',
          intro: "Tab to view pictures from your devices.",
          position: 'right'
        },
        {
          element: '#step4',
          intro: "",
          position: 'right'
        },
        {
          element: '#step5',
          intro: 'Get it, use it.',
          position: 'right'
        }
      ],
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
