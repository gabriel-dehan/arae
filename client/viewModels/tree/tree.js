// Used in node.js file, reset the current tree on application loading
var tree = null;

/**
 * Reset the parsed tree
 */
Template.tree.init = function(){
    tree = null;
};

Template.tree.events = {
    /*
     * Add a file or directory
     */
    'click .add-file, click .add-dir' : function(e){
        var parent_id = $(e.target).parent('ul.edit').attr('data-id'),
        is_dir        = $(e.target).hasClass('add-dir'),
        name          = '';

        if ( is_dir ) {
            name = prompt('Directory name (30 characters max)', 'New Directory');
            is_dir = 1;
        } else {
            name = prompt('File name (30 characters max)', 'New file');
            is_dir = 0;
        }

        if ( name ) {
            Meteor.call('insert_in_dir', Session.get('current_tree'), name, parent_id, Session.get('tree_id'), is_dir, function(error, result){
                if ( error && (error.reason === 'name_exists') ) {
                    Meteor.message.set('"' + name + '" already exists.', 'warning');
                    Meteor.navigate(Session.get('route'));
                } else {
                    Template.tree.init();
                }
            });
        }
    },

    'click .add-user, click .remove-user' : function(e){
        var parent    = $(e.target).closest('.dir-name, .file-name'),
            parent_id = $(e.target).parent('ul.edit').attr('data-id'),
            user_name = prompt('User name', ''),
            add_user  = true;

        /* If we clicked on remove user, we set add_user to false */
        if( $(e.target).hasClass('remove-user') ) {
            add_user = false;
        }

        if ( User.findOne({name:user_name}) ) {
            if ( parent && parent_id ) {
                Meteor.call('toggle_user_for_node', add_user, Session.get('current_tree'), user_name, parent_id, Session.get('tree_id'), function(error, result){
                    console.log(error, result);
                });

            }
        } else {
            Meteor.message.set('User "' + user_name + '" does not exist.', 'warning');
            Meteor.navigate(Session.get('route'));
        }
    },

    /* TODO: Remove user */

    /*
     * Remove a file or directory
     */
    'click .rm-file, click .rm-dir' : function(e){
        var node_id = $(e.target).parent('ul.edit').attr('data-id');

        Meteor.call('remove_in_dir', Session.get('current_tree'), node_id, Session.get('tree_id'), function(error, result){
            if ( error ) {
                console.log(error);
            } else {
                /* As we just deleted a node, we want to make sure it is not selected anymore, so we reset the selection */
                Session.set('selected_file', 0);
                Template.tree.init();
            }
        });
    },

    /*
     * Select a file and add it's id to the session
     */
    'click .file-name, click .dir-name' : function(e) {
        /* Even if we clicked on the <A> tag inside a li.file-name or li.dir-name we want to act on the li */
        var target = $(e.target);

        if ( target.hasClass('file-name') || target.hasClass('dir-name') ) {
            var self = target,
            id       = target.children('a').attr('href');
        } else {
            var self = target.parent(),
            id       = target.attr('href');
        }
        $('.file-name.selected, .dir-name.selected').removeClass('selected');
        self.addClass('selected');

        if ( id )
            Session.set('selected_file', id.replace('#', ''));
    },

    /*
     * Remove all files in the current tree
     */
    'click #delete-all' : function(e) {
        Meteor.call('delete_all_in_tree', Session.get('current_tree'), Session.get('tree_id'), function(error, result){
            if ( error ) {
                console.log(error);
            } else {
                /* As we just deleted a node, we want to make sure it is not selected anymore, so we reset the selection */
                Session.set('selected_file', 0);
                Template.tree.init();
            }
        });
    }
};
