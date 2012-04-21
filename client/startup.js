Meteor.startup(function(){
     _Session = new Meteor.Collection("server_session");
     Meteor.subscribe("server_session");
 });