/**
 * Request Class
 * @property {string} controller The current request controller
 * @property {string} action     The current request action
 * @property {string} query      The current request query
 */
var Request = Base.extend({
    constructor: function() {
        this.params = {}
    },

    setController: function( controller ) {
        this.controller = controller;
    },
    setAction: function( action ) {
        this.action = action;
    },
    setQuery: function( query ) {
        if (query) {
            var query_object = {};
            query.replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { query_object[$1] = $3; }
            );
        }
        this.query = query_object;
    },

    pushParam: function(key, value ) {
        this.params[key] = value;
    }
});

Meteor.request = new Request;
