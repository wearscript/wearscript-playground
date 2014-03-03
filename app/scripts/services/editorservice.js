'use strict';

angular.module('wearscriptPlaygroundApp')
  .service('Editorservice', function Editorservice() {
      this.dirty = false;
      this.content = '';
      this.gistid = undefined;
      this.file = undefined;
      this.forkonsave = false;
  });
