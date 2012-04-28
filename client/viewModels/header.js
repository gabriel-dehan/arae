/**
 * Checks if the user is logged in
 * @return {boolean}
 */
Template.header.is_logged = function() {
    return Session.get('user') !== undefined;
};

/**
 * Get the logged user name
 * @return {string} User name
 */
Template.header.user_name = function() {
    return Session.get('user').name;
};

/* Set the logout click event */
Template.header.events = {
    'click .logout_link': function(e) {
        /* TODO: Set a message */
        Session.set('user', undefined);
        Meteor.navigate('/user/list');
    }
};