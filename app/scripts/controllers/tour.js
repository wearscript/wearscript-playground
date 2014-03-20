'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('TourCtrl', function ($scope) {
    /*
    $scope.changeStyle = function (element, changeTo){
      dict = {}
      changeTo = {
        'borderBottom': 'none'
      }
      if(element && element.style){
        for(var i = 0; i < element.style.length; i++) {
          var key = element.style[i];
          var value = element.style[key];
          dict[key] = element.style[value];
        }
        for(var i in changeTo) {
          var key = i;
          var value = element.style[key];
          dict[key] = element.style[value];
        }
        cache.push({
          element: element,
          changedStyles: dict
        });
        
      }
    }
    */
    $scope.onCompletedEvent = function (element) {
      console.log("Completed Event called"); 
      console.log("" + arguments.length +" arguments were passed.");
      //element.style.borderBottom = self.cache.borderBottom;
    };

    $scope.onExitEvent = function () { 
      console.log("Exit Change Event called");
      console.log("" + arguments.length +" arguments were passed.");
      //e.style.borderBottom = self.cache.borderBottom;
      /*
      for(var i = 0; i < self.cache.length; i ++){
        self.cache[i].element.style = self.cache[i].style;
      }
      */
    };

    $scope.onBeforeChangeEvent = function () { 
      console.log("Before Change Event called"); 
      console.log("" + arguments.length +" arguments were passed.");

    };

    $scope.onChangeEvent = function (element) { 
      console.log("Change Event called");
      console.log("" + arguments.length +" arguments were passed.");
      /*
      self.cache.push({
        element: element,
        style: element.style
      });

      element.style.borderBottom = "none"; 
      */
    };

    $scope.onAfterChangeEvent = function () { 
      console.log("After Change Event called"); 
      console.log("" + arguments.length +" arguments were passed.");

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
          intro: "<strong>You</strong> can also <em>include</em> HTML",
          position: 'right'
        },
        {
          element: '#step3',
          intro: 'More features, more fun.',
          position: 'right'
        },
        {
          element: '#step4',
          intro: "Another step.",
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
