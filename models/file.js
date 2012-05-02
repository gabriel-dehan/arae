/* files collection */
var File = new Meteor.Collection('file');

if ( Meteor.is_server ) {
    Meteor.startup(function() {
//        File.remove({});
    });
}