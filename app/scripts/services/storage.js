/**
 * # HTML5 localStorage management service
 *
 * Allows for storing and recalling data from localStorage prefixed with an
 * application specific key. Also handles object stringification and
 * de-stringification as needed
 *
 * Examples:
 *
 *     storageService.set('somekey','somevalue')
 *     storageService.set('somekey',{'key':'value'})
 *     var storedKey = storageService.get('somekey')
 *
 */

'use strict';

angular.module('wearscriptPlaygroundApp')

.factory
  ( 'Storage', function($log){
    var storage = {
        data : {},
        storage_id: 'WS_',
        get: function( key )  {
            var data , result;

            try{
                data = localStorage.getItem(this.storage_id+key);
            } catch(e){}

            try {
                result = JSON.parse(data);
            } catch(e) {
                result = data;
            }

            $log.info('>> storageService',key,result);
            return result;
        },
        set: function(key,data){
            if (typeof data == "object"){
                data = JSON.stringify(data);
            }

            try{
                localStorage.setItem(this.storage_id+key, data);
                $log.info('<< storageService',key,data);
            } catch(e){
                $log.error('!! storageService',e);
            }
        },
        remove: function(key)  {
            try {
                var status = localStorage.removeItem(this.storage_id+key);
                $log.info('-- storageService',key);
                return status;
            } catch( e ){
                $log.error('!! storageService',e);
                return false;
            }
        }
    };

    return storage;

});
