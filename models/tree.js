/* Document tree collection */
var DocumentTree = new Meteor.Collection('tree');

if ( Meteor.is_server ) {
    Meteor.startup(function() {
//        DocumentTree.remove({});
    });
}