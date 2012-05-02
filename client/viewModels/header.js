/**
 * Get's current user tree id
 * @return {string}
 */
Template.header.get_user_tree_id = function() {
    return Session.get('user').tree_id;
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