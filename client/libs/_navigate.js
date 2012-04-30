/**
 * Redirect to another page, flushing flash message when it needs to
 * @param route
 */
Meteor.navigate = function(route) {
    Router.navigate(route, {trigger: true});

    // TODO: We reset the selected_file to 0 every time we are on a new page, bit overkill
    Session.set('selected_file', 0);
    Meteor.message.flush();
};
