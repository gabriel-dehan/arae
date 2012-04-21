Meteor.message = {};

Meteor.message.set = function(message, type) {
    var m = {
            text  : message,
            class : type
        }
    _Session.insert({key : 'message', value : m});
    Session.set('message', m);
}

Meteor.message.get = function() {
    /* When ever we get a message, we delete it from the Permanent Session */
    _Session.remove({key: 'message'});
    return Session.get('message');
}


Meteor.message.has_one = function() {
    return Session.get('message') !== undefined;
}

Meteor.message.flush = function() {
    session_message = _Session.findOne({key:'message'});
    if ( session_message ) {
        Session.set('message', session_message.value );
    }
}