Meteor.publish("all_users", function() {
    return User.find({}, {
        fields: {pass: false}
    });
});

Meteor.publish("server_session", function() {
    return _Session.find();
});

Meteor.publish("document_tree", function(id) {
    return DocumentTree.findOne({_id:id});
});