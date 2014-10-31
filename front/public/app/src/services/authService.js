'use strict';

services.service('auth', function () {
    var currentUser = {
        user: null,
        init: function (user) {
            this.user = user;
        },

        isAuth: function () {
            return this.user!==null;
        }
    };
    return currentUser;
});
