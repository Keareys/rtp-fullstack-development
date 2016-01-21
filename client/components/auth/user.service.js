'use strict';

angular.module('testApp')
    .factory('User', function($resource, baseurl) {

        var urlBase = baseurl.baseURL();

        return $resource(urlBase + '/api/users/:id/:controller', {
            id: '@_id'
        }, {
            changePassword: {
                method: 'PUT',
                params: {
                    controller: 'password'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            }
        });
    });
