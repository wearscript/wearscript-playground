'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('AnnotationCtrl', function ($scope,Socket) {
      var ws = Socket.ws;
      $scope.images = {}; // [device] = imageb64

      this.initCanvas = function ($canvas) {
          var context = $canvas.getContext('2d');
          context.fillStyle = '#FFFFFF'; // set canvas background color
          context.fillRect(0, 0, $canvas.width, $canvas.height);  // now fill the canvas        

          var tool = {};
          function ev_canvas (ev) {
              if (ev.layerX || ev.layerX == 0) { // Firefox
                  ev._x = ev.layerX;
                  ev._y = ev.layerY;
              } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                  ev._x = ev.offsetX;
                  ev._y = ev.offsetY;
              }
              var evtype = ev.type;
              if (evtype.slice(0, 5) == "touch" && event.touches.length == 1) {
                  console.log('Touch')
                  ev._x = ev.touches[0].pageX;
                  ev._y = ev.touches[0].pageY;
              }
              console.log(ev._x + " " + ev._y)

              var func = tool[evtype];
              if (func) {
                  func(ev);
              }
          }

          $canvas.addEventListener('mousedown', ev_canvas, false);
          $canvas.addEventListener('mousemove', ev_canvas, false);
          $canvas.addEventListener('mouseup', ev_canvas, false);
          $canvas.addEventListener('touchmove', ev_canvas, false);
          $canvas.addEventListener('touchstart', ev_canvas, false);
          $canvas.addEventListener('touchend', ev_canvas, false);
          tool.mousemove = function (ev) {

          };
          tool.mousedown = function (ev) {
              var ctx = $canvas.getContext("2d");
              ctx.beginPath();
              ctx.arc(ev._x, ev._y, 50, 0, 2 * Math.PI);
              ctx.strokeStyle = '#0b61a4';
              ctx.stroke();
          };
          tool.mouseup = function (ev) {

          };

          tool.touchmove = function (ev) {

          };
          tool.touchstart = function (ev) {

          };
          tool.touchend = function (ev) {

          };
      }
      this.initCanvas(document.querySelector('#canvas'));


      function image_cb(channel, time, imageData, numPoints, description) {
          $scope.imageData = 'data:image/jpeg;base64,' + btoa(imageData);
          $scope.numPoints = numPoints;
          $scope.description = description;
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }

      ws.subscribe('annotationimage', image_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('annotationimage');
      });
  });
