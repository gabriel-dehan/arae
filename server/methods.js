Meteor.methods({
    /**
     * Allows user connexion through Meteor.call
     * @param {string} name User name
     * @param {string} pass User password (MD5 hash)
     */
    login: function( name, pass ) {
        var user = User.findOne({name:name});

        if ( user ) {
            if ( user.pass === pass ) {
                return user;
            } else {
                throw new Meteor.Error( 401, 'Wrong password.' );
            }
        } else {
            throw new Meteor.Error( 404, 'User ' + name + ' not found' );
        }
    },

    insert_in_dir: function(tree, name, dir_id, tree_id, is_dir) {
        var t       = new Tree(tree),
        file_id     = DocumentTree.findOne({_id:tree_id});
        file_id     = file_id.count;
        var node    = {
                            _id    : file_id,
                            is_dir : is_dir,
                            name   : name
                      };

        if ( is_dir ) {
            node.tree = [];
        }

        t.insert(node, dir_id);
        DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}, $inc : {count:1}});
        return true;
    },

    remove_in_dir: function(tree, node_id, tree_id) {
        var t = new Tree(tree);

        t.delete(node_id);

        DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});
        return true;
    },

    move_node: function(tree, node_id, to, tree_id) {
        var t = new Tree(tree);

        t.move(node_id, to);
        DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});

        return t.tree;
    }
});