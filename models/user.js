User = new Meteor.Collection("user");

if ( Meteor.is_server ) {
    Meteor.startup(function() {
//        User.remove({});
       if ( User.find().count() === 0 ) {
           User.insert({name : 'admin', pass : md5('password')});
       }
    });
}