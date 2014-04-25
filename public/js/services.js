var phonecatServices = angular.module('requestCodeServices', ['ngResource']);

phonecatServices.factory(
    'RequestCode',
    [
        '$resource',
        function($resource){
            return $resource('requestCodes/:requestCode_id', {}, {
                query: {
                    method:'GET',
                    params:{
                        phoneId:'phones'
                    },
                    isArray:true
                }
            });
        }
    ]
);