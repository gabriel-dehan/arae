/**
 * Get the message to be displayed
 * @return {Object} message
 */
Template.message.message = function() {
    return Meteor.message.get();
}

Template.message.events = {
    'click .close' : function(e) {
        $(e.delegateTarget).fadeOut();
    }
}