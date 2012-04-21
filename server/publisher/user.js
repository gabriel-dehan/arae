Meteor.publish("all_users", function() {
    return User.find({}, {
        fields: {pass: false}
    });
});