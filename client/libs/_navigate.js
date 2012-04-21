/**
 * Redirect to another page, flushing messages for the next page
 * @param route
 */
Meteor.navigate = function(route) {
    Router.navigate(route, {trigger: true});

    Meteor.message.flush();
}
