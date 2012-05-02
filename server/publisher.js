Meteor.publish("all_users", function() {
    return User.find({}, {
        fields: {pass: false}
    });
});

Meteor.publish("_session", function() {
    return _Session.find();
});

Meteor.publish("document_tree", function() {
    return DocumentTree.find();
});

Meteor.publish("file", function() {
    return File.find();
});