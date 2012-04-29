/**
 * Retrieve a node tree
 */
Template.node.node = function() {
    /* If tree has not been defined, we get it from the database */
    // See var tree in tree.js
    if ( tree === undefined || tree === null ) {
        tree = DocumentTree.findOne({_id:Session.get('tree_id')});
        /* We wait for tree to be defined ( Database can sometimes take a "while" to answer ) */
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
};

/**
 * Parse a node recursively
 * @param node
 */
Template.node.parse = function(node) {
    if ( node.is_dir ) {
        tree = node.tree;
        return node;
    } else {
        return node;
    }
};

/**
 * Check if a user can edit a node
 */
Template.node.user_can_edit = function() {
    if ( Session.get('user') ) {
        return Session.get('user').tree_id === Session.get('tree_id');
    }
    return false;
};

Template.node.is_not_root = function() {
    if ( !this.root )
        return true;

    return false;
};
