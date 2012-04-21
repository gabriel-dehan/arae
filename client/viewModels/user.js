/*
 * User modelView
 */

/* =Model subscription */
User = new Meteor.Collection("user");
Meteor.subscribe("all_users");

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

/* =User login events */
Template.user_login.events = {
    'click #login_submit': function(e){
        e.preventDefault();

        var form = $(e.delegateTarget);
        var name = form.find('#name').val();
        var pass = form.find('#pass').val();

        Meteor.call('login', name, md5(pass), function(error, user){
            if ( error ) {
                Meteor.message.set(error.error + ': ' + error.reason, 'warning');
                Meteor.navigate('/user/list');
            } else {
                Meteor.message.set('Vous voici connect&eacute;, ' + user.name + '.', 'info');
                Session.set('user', user);
                Meteor.navigate('/user/list');
            }
        });
    }
}