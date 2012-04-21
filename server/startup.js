/*
 * Prevents the client to modify any specified MongoDB collection
 */
Meteor.startup(function() {
  _.each(['user'], function(collection) {
    _.each(['insert', 'update', 'remove'], function(method) {
      Meteor.default_server.method_handlers['/' + collection + '/' + method] = function() {};
    });
  });
});