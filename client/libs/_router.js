ClientRouter = Backbone.Router.extend({
    routes: {
        ""                 :       "default_route",
        ":route/"          :       "get_route",
        ":route"           :       "get_route",
        ":route/:action"   :       "get_route",
        ":route/:action/"  :       "get_route"
    },

    /* Default route */
    default_route: function() {
        Meteor.navigate('/user/list');
    },

    /* Generic routes */
    get_route: function( route, action ) {
        var args, query;
       if ( action ) {
           args   = action.split('?');
           query  = args[1];
           action = args[0];
       }

        Meteor.request.setController(route);
        Meteor.request.setAction(action);
        Meteor.request.setQuery(query);
    },

    /* Every time a route is called we set it in the Session */
    initialize: function() {
        this.bind("all", function() {
            Session.set('route', Backbone.history.fragment);
        });
    }
});

var Router = new ClientRouter;

/* Starts the backbone history, and thus the Router */
Backbone.history.start({pushState: true});

/*
 * After DOM is loaded we bind the click event on internal links to call the Meteor.navigate method
 * (This way we don't reload the session and fully use the backbone routing)
 */
Meteor.startup(function() {
    $('body').on('click', 'a[data-link="internal"]', function(e){
        e.preventDefault();
        Meteor.navigate($(this).attr('href'));
    });
})
