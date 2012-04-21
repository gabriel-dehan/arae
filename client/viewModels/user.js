/**
 * User controller
 */

/* User */

User = new Meteor.Collection("user");
Meteor.subscribe("all_users");

/* User list */
Template.user_list.users = function() {
    return User.find().fetch();
}

Template.user_list.capitalize = function( string ) {
    return string.capitalize();
}

/* User login */
Template.user_login.events = {
    'click #login_submit': function(e){
        e.preventDefault();

        var form = $(e.delegateTarget);
        var name = form.find('#name').val();
        var pass = form.find('#pass').val();

        var results;
        Meteor.call('login', name, pass, function(error, user){
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