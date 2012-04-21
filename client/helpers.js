/**
 * Get the page title
 */
Handlebars.registerHelper('page_title', function() {
    return Meteor.view.replace('_', ' ').capitalize();
});

/**
 *  Loads the template according to the route
 */
Handlebars.registerHelper('content', function(){
    /* This does nothing but triggers the Meteor.ui.chunk HTML automatic update on route change */
    Session.get('route');

    return Meteor.ui.chunk(Template[Meteor.get_template()]);
});

/**
 *  Checks if the required Template exists, and if not, get the error template
 */
Meteor.get_template = function() {
    Meteor.view = Meteor.request.controller;
    Meteor.view += Meteor.request.action ? '_' + Meteor.request.action : '' ;

    try {
        if ( !_.has(Template, Meteor.view) )
            throw new Meteor.Error(404, "Not found", "The page does not exists.");
    } catch (e) {
        Template.error.informations = function () {
            return e;
        }
        return 'error';
    }

    return Meteor.view;
}