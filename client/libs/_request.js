var Request = Base.extend({
    constructor: function() {
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
    }
});

Meteor.request = new Request;