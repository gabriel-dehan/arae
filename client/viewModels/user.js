/*
 * User modelView
 */

/* =User list */
/**
 * Return all users
 * @return {Meteor Collection} all users
 */
Template.user_list.users = function() {
    return User.find( { name : { $ne : 'admin' } } ).fetch();
};

/**
 * Uppercase the first letter of astring
 * @param {string} string String to capitalize
 * @return {string} Capitalized string
 */
Template.user_list.capitalize = function( string ) {
    return string.capitalize();
};


/* =Login events */
Template.login.events = {
    'click #login_submit': function(e){
        e.preventDefault();

        var form = $(e.delegateTarget),
        name     = form.find('#name').val(),
        pass     = form.find('#pass').val();

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
    },
};


/* User register */

/**
 * Return true if there was an error with password in User registration form
 * TODO : Should be able to handle Name error AND Password error
 * @return {Boolean}
 */
Template.user_register.has_error = function() {
    return Session.get('register_error') !== undefined;
};

Template.user_register.events = {
    'click #register_submit': function(e){
        e.preventDefault();

        var form  = $(e.delegateTarget),
        name      = form.find('#register_name').val(),
        pass      = form.find('#register_pass').val(),
        match     = form.find('#register_pass_match').val();

        if ( pass === match ) {
            // If there was an error before, we flush it
            Session.set('register_error', undefined);

            Meteor.call('register', name, md5(pass), function(error, user){
                if ( error ) {
                    Meteor.message.set(error.error + ': ' + error.reason, 'warning');
                    /* TODO: Should automaticaly connect user */
                    Meteor.navigate(Session.get('route'));
                } else {
                    Meteor.message.set('You are now registered.', 'info');
                    Meteor.navigate('/user/list');
                }
            });
        } else {
            Meteor.message.set('Passwords do not match.', 'warning');
            /* TODO: Flush the error correctly, maybe implement an error manager */
            Session.set('register_error', true);
            Meteor.navigate(Session.get('route'));
        }
    }
}   ;