'use strict';

angular.module('wearscriptPlaygroundApp')
  .controller('SensorsCtrl', function ($scope,$window, Socket) {
      var ws = Socket.ws;
      $scope.sensors = {};
      
      // NOTE(brandyn): All of this cube code should eventually be moved to a library or something
      this.cubeMatrix = function (values) {

        var mat = this.remap_coordinate_system(this.getRotationMatrixFromVector(values), 1, 3);
        mat = this.remap_coordinate_system(this.transpose_matrix(mat), 3, 1);

          $scope.cubeMatrix = 
          $scope.cubeMatrixStyle = 
            { 'transform': 'matrix3d(' + mat.join(',') + ')',
              '-webkit-transform': 'matrix3d(' + mat.join(',') + ')',
              'transition-duration': '0s'
            };
      }

      this.getRotationMatrixFromVector = function (rotationVector) {
          var q0;
          var q1 = rotationVector[0];
          var q2 = rotationVector[1];
          var q3 = rotationVector[2];

          var R = new Array(16);

          if (rotationVector.length == 4) {
              q0 = rotationVector[3];
          } else {
              q0 = 1 - q1*q1 - q2*q2 - q3*q3;
              q0 = (q0 > 0) ? Math.sqrt(q0) : 0;
          }

          var sq_q1 = 2 * q1 * q1;
          var sq_q2 = 2 * q2 * q2;
          var sq_q3 = 2 * q3 * q3;
          var q1_q2 = 2 * q1 * q2;
          var q3_q0 = 2 * q3 * q0;
          var q1_q3 = 2 * q1 * q3;
          var q2_q0 = 2 * q2 * q0;
          var q2_q3 = 2 * q2 * q3;
          var q1_q0 = 2 * q1 * q0;

          R[0] = 1 - sq_q2 - sq_q3;
          R[1] = q1_q2 - q3_q0;
          R[2] = q1_q3 + q2_q0;
          R[3] = 0.0;
          
          R[4] = q1_q2 + q3_q0;
          R[5] = 1 - sq_q1 - sq_q3;
          R[6] = q2_q3 - q1_q0;
          R[7] = 0.0;
          
          R[8] = q1_q3 - q2_q0;
          R[9] = q2_q3 + q1_q0;
          R[10] = 1 - sq_q1 - sq_q2;
          R[11] = 0.0;
          
          R[12] = R[13] = R[14] = 0.0;
          R[15] = 1.0;

          return R;
      }
      this.remap_coordinate_system = function (inR, X, Y) {
          // AXIS_X=1, AXIS_Y=2, AXIS_Z=3
          /*
           * X and Y define a rotation matrix 'r':
           *
           *  (X==1)?((X&0x80)?-1:1):0    (X==2)?((X&0x80)?-1:1):0    (X==3)?((X&0x80)?-1:1):0
           *  (Y==1)?((Y&0x80)?-1:1):0    (Y==2)?((Y&0x80)?-1:1):0    (Y==3)?((X&0x80)?-1:1):0
           *                              r[0] ^ r[1]
           *
           * where the 3rd line is the vector product of the first 2 lines
           *
           */
          var outR = new Array(16);

          var length = outR.length;
          if (inR.length != length)
              return;   // invalid parameter
          if ((X & 0x7C)!=0 || (Y & 0x7C)!=0)
              return;   // invalid parameter
          if (((X & 0x3)==0) || ((Y & 0x3)==0))
              return;   // no axis specified
          if ((X & 0x3) == (Y & 0x3))
              return;   // same axis specified

          // Z is "the other" axis, its sign is either +/- sign(X)*sign(Y)
          // this can be calculated by exclusive-or'ing X and Y; except for
          // the sign inversion (+/-) which is calculated below.
          var Z = X ^ Y;

          // extract the axis (remove the sign), offset in the range 0 to 2.
          var x = (X & 0x3)-1;
          var y = (Y & 0x3)-1;
          var z = (Z & 0x3)-1;

          // compute the sign of Z (whether it needs to be inverted)
          var axis_y = (z+1)%3;
          var axis_z = (z+2)%3;
          if (((x^axis_y)|(y^axis_z)) != 0)
              Z ^= 0x80;

          var sx = (X>=0x80);
          var sy = (Y>=0x80);
          var sz = (Z>=0x80);

          // Perform R * r, in avoiding actual muls and adds.
          var rowLength = ((length==16)?4:3);
          for (var j = 0; j < 3; j++) {
              var offset = j*rowLength;
              for (var i = 0; i < 3; i++) {
                  if (x==i)   outR[offset+i] = sx ? -inR[offset+0] : inR[offset+0];
                  if (y==i)   outR[offset+i] = sy ? -inR[offset+1] : inR[offset+1];
                  if (z==i)   outR[offset+i] = sz ? -inR[offset+2] : inR[offset+2];
              }
          }
          if (length == 16) {
              outR[3] = outR[7] = outR[11] = outR[12] = outR[13] = outR[14] = 0;
              outR[15] = 1;
          }
          return outR;
      }

      this.transpose_matrix = function (mat) {
          var mat_trans = [];
          for (var i = 0; i < 4; i++)
              for (var j = 0; j < 4; j++)
                  mat_trans.push(mat[j * 4 + i]);
          return mat_trans;
      }

      this.sensors_cb = function (channel, sensorTypes, sensorValues) {
          if (!$scope.sensors.hasOwnProperty(channel))
              $scope.sensors[channel] = {sensors: {}}
          for (var key in sensorValues)
              if (sensorValues.hasOwnProperty(key)) {
                  var values = sensorValues[key];
                  var value = values[values.length - 1];
                  var d = new Date(0);
                  if (key === 'MPL Rotation Vector') {
                      $scope.sensors[channel].cubeMatrixStyle = this.cubeMatrix(value[0]);
                  }
                  d.setUTCSeconds(value[1]);
                  value[1] = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
                  $scope.sensors[channel].sensors[key] = value;
              }
          //console.log('applying: ' + JSON.stringify($scope.sensors));
          $scope.$apply(); // HACK(brandyn): Not sure why we have to do this
      }.bind(this);
      ws.subscribe('sensors', this.sensors_cb);
      $scope.$on('$destroy', function cleanup() {
          ws.unsubscribe('sensors');
      });
  });
