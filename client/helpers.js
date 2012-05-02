/**
 * Get the page title
 * @return {string} formated string
 */
Handlebars.registerHelper('page_title', function() {
    return Meteor.view.replace('_', ' ').capitalize();
});

/**
 *  Loads the template according to the route
 *  @return {string} HTML String
 */
Handlebars.registerHelper('content', function(){
    /* This does nothing but triggers the Meteor.ui.chunk HTML automatic update on route change */
    Session.get('route');
    return Meteor.ui.chunk(Template[Meteor.get_template()]);
});

Handlebars.registerHelper('is_user', function(){
    return Session.get('user') !== undefined;
});

Handlebars.registerHelper('is_admin', function() {
    var user = Session.get('user');
    if ( user ) {
        return user.name === 'admin';
    }
    return false;
});

/**
 * Checks if the user is logged in
 * @return {boolean}
 */
Handlebars.registerHelper('is_logged', function() {
    return Session.get('user') !== undefined;
});

Handlebars.registerHelper('editor_mode', function() {
    if ( Session.get('editor_mode') )
        return Session.get('editor_mode');
    return false;
});

Handlebars.registerHelper('textarea', function(){
    return Meteor.ui.chunk(function() {
        Meteor.subscribe('file');
        return Template['textarea']();
    });
});


/**
 * Check if the user is the tree owner or the admin
 * @return {Boolean}
 */
Handlebars.registerHelper('is_owner', function () {
    var current_tree = DocumentTree.findOne({_id:Session.get('tree_id')});
//    /* We wait for current_tree to be defined */
    if ( current_tree ) {
        var t = new Tree(current_tree.root),
            owner = t.get_owner(),
            user  = Session.get('user');

        if ( user && ( user.name === 'admin' || owner === user.name ) )
            return true;
    }
    return false;
});

/**
 *  Checks if the required Template exists, and if not, get the error template
 *  @return {string} Template name
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