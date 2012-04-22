var tree = null;

Template.node.node = function() {
    if ( tree === undefined || tree === null ) {
        tree = DocumentTree.findOne({_id:Session.get('tree_id')});
        if ( tree ) {
            tree = tree.root;
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