var tree = null;

Template.node.node = function() {
    if ( tree === undefined || tree === null ) {
        tree = DocumentTree.findOne({_id:Session.get('tree_id')});
        if ( tree ) {
            tree = tree.root;
            Session.set('current_tree', tree);
            return tree;
        } else {
            return [];
        }
    } else {
        return tree;
    }
}

Template.node.parse = function(node) {
    if ( node.is_dir ) {
        tree = node.tree;
        return node;
    } else {
        return node;
    }
}

Template.node.user_can_edit = function(node) {
    if ( Session.get('user') ) {
        return Session.get('user').tree_id === Session.get('tree_id');
    } else {
        return false;
    }
}

Template.tree.init = function(){
    tree = null;
}

Template.tree.events = {
    'click .add-file, click .add-dir' : function(e){
        var parent_id = $(e.target).parent('ul.edit').attr('data-id');
        var is_dir    = $(e.target).hasClass('add-dir');

        if ( is_dir ) {
            var name = prompt('Directory name', 'New Directory');
            is_dir = 1;
        } else {
            var name = prompt('File name', 'New file');
            is_dir = 0;
        }

        Meteor.call('insert_in_dir', Session.get('current_tree'), name, parent_id, Session.get('tree_id'), is_dir, function(error, result){
            if ( error ) {
                console.log(error);
            } else {
                Template.tree.init();
            }
        });
    },
 
    'click .rm-file, click .rm-dir' : function(e){
        var node_id = $(e.target).parent('ul.edit').attr('data-id');

        Meteor.call('remove_in_dir', Session.get('current_tree'), node_id, Session.get('tree_id'), function(error, result){
            if ( error ) {
                console.log(error);
            } else {
                Template.tree.init();
            }
        });
    }
}