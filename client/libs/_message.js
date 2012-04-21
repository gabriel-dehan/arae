/**
 * Messenger
 * Provides an API for using flash messages throughout a Meteor application
 */

if (typeof Meteor.message === 'undefined')
    Meteor.message = {};

/**
 * Set a message
 * @param [Object String] message   Message content
 * @param [Object String] type      Message Type (warning, info, important, default, success, inverse)
 */
Meteor.message.set = function(message, type) {
    Session.set('message', {
                text  : message,
                class : type
            });
    Session.set('has_message', true);
}

/**
 * Get a message
 * @return [Object] The message (@see Meteor.message.set)
 */
Meteor.message.get = function() {
    Session.set('has_message', false);
    return Session.get('message');
}

/**
 * Checks if a message has been set
 * @return [boolean]
 */
Meteor.message.has_one = function() {
    return Session.get('message') !== undefined;
}

/**
 * Delete a message if there is any
 * @return [boolean] true if a message has been deleted
 */
Meteor.message.flush = function() {
    if ( !Session.get('has_message') ) {
        Session.set('message', undefined );
        return true;
    }
    return false;
}