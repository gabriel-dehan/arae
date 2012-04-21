Meteor.message = {};

Meteor.message.set = function(message, type) {
    Session.set('message', {
                text  : message,
                class : type
            });
    Session.set('has_message', true);
}

Meteor.message.get = function() {
    Session.set('has_message', false);
    return Session.get('message');
}


Meteor.message.has_one = function() {
    return Session.get('message') !== undefined;
}

Meteor.message.flush = function() {
    if ( !Session.get('has_message') ) {
        Session.set('message', undefined );
    }
}