'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('AnnotationCtrl', function ($scope,Socket) {
      var ws = Socket.ws;
      $scope.images = {}; // [device] = imageb64
      this.canvas = document.querySelector('#canvas');
      this.context = this.canvas.getContext('2d');
      this.pointCount = -1;
      this.points = [];
      this.response = '';
      this.initCanvas = function () {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

          this.canvas.addEventListener('mousedown', ev_canvas, false);
          this.canvas.addEventListener('mousemove', ev_canvas, false);
          this.canvas.addEventListener('mouseup', ev_canvas, false);
          this.canvas.addEventListener('touchmove', ev_canvas, false);
          this.canvas.addEventListener('touchstart', ev_canvas, false);
          this.canvas.addEventListener('touchend', ev_canvas, false);
          tool.mousemove = function (ev) {

          };
          tool.mousedown = function (ev) {
              if (this.pointCount > 0) {
                  this.points.push([ev._x, ev._y]);
                  if (this.points.length == this.pointCount) {
                      this.pointCount = -1;
                      ws.publish(this.response, this.points);
                      this.points = [];
                      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                  }
              }
              this.context.beginPath();
              this.context.arc(ev._x, ev._y, 50, 0, 2 * Math.PI);
              this.context.strokeStyle = '#0b61a4';
              this.context.stroke();
          }.bind(this);
          tool.mouseup = function (ev) {

          };

          tool.touchmove = function (ev) {

          };
          tool.touchstart = function (ev) {

          };
          tool.touchend = function (ev) {

          };
      }
      this.initCanvas();

      this.image_cb = function (channel, response, imageData, numPoints, description) {
          this.pointCount = numPoints;
          this.points = [];
          this.response = response;
          var image = new Image();
          console.log(channel); 
          image.onload = function (image_id) {
              this.context.drawImage(image, 0, 0);
              console.log('Height: ' + image.naturalHeight + ' Width: ' + image.naturalWidth);
          }.bind(this);
          image.src = 'data:image/jpeg;base64,' + imageData;
          console.log(image.src.length);
          document.querySelector('#canvas')
          $scope.description = description;
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }.bind(this);

      ws.subscribe('annotationimagepoints', this.image_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('image');
      });
  });
