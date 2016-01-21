'use strict';

angular.module('testApp')
    .service('systememail', function($http, baseurl) {
        var urlBase = '/api/systememails';
        var mainURL = baseurl.baseURL();
        urlBase = mainURL + urlBase;
      
        this.sendEmail = function(email) {
            return $http.post(urlBase + '/send', email);
        };

        this.getEmails = function() {
            return $http.get(urlBase + '/list');
        };

        this.getEmailStats = function(category, startdate) {
            // return $http({
            //     method: 'GET',
            //     url: 'https://api.sendgrid.com/v3/categories/stats?start_date=2015-09-01&aggregated_by=week&categories=rtp',
            //     headers: {
            //         'Authorization': 'Bearer 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'
            //     }
            // });


            return $.ajax({
            url: 'https://api.sendgrid.com/v3/categories/stats?start_date=' + startdate + '&aggregated_by=month&categories=' + category,
            headers: {
                'Authorization': 'Bearer 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'

            },
            method: 'GET',
            dataType: 'json',
            cache: false,
            success: function(data) {
               console.log(data);
            }
        });
        };

    });
