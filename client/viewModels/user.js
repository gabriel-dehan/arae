/*
 * User modelView
 */

/* =User list */
/**
 * Return all users
 * @return {Meteor Collection} all users
 */
Template.user_list.users = function() {
    return User.find().fetch();
}

/**
 * Uppercase the first letter of astring
 * @param {string} string String to capitalize
 * @return {string} Capitalized string
 */
Template.user_list.capitalize = function( string ) {
    return string.capitalize();
}


/* =Login events */
Template.login.events = {
    'click #login_submit': function(e){
        e.preventDefault();

        var form = $(e.delegateTarget);
        var name = form.find('#name').val();
        var pass = form.find('#pass').val();

        Meteor.call('login', name, md5(pass), function(error, user){
            if ( error ) {
                Meteor.message.set(error.error + ': ' + error.reason, 'warning');
                Meteor.navigate(Session.get('route'));
            } else {
                Meteor.message.set('You are now connected, ' + user.name + '.', 'info');
                Session.set('user', user);
                Meteor.navigate(Session.get('route'));
            }
        });
    }
}