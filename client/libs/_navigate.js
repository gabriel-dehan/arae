/**
 * Redirect to another page, flushing flash message when it needs to
 * @param route
 */
Meteor.navigate = function(route) {
    Router.navigate(route, {trigger: true});
    Meteor.message.flush();
}
