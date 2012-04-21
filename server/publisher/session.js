Meteor.publish("server_session", function() {
    return _Session.find();
});