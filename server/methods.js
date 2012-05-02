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

    /**
     * Allows user registration through Meteor.call, and creates a new tree for the user
     * @param {string} name User name
     * @param {string} pass User password (MD5 hash)
     */
    register: function( name, pass ) {
        var user = User.findOne({name:name});

        if ( !user ) {
            var now  = Date.now(),
                t    = null,
                t_id = null,
                name = name.capitalize();

            /* Creates a new tree with a root directory */
            t = new Tree([{
                root          : true,
                is_dir        : 1,
                name          : name,
                owner         : name,
                users         : [name],
                _id           : 0,
                created_at    : now,
                last_modified : now,
                tree          : []
            }]);
            t_id = DocumentTree.insert({root: t.tree, count: t.count});

            if ( t_id ) {
                /* Creates a new user */
                if( User.insert({
                    name          : name,
                    pass          : pass,
                    tree_id       : t_id,
                    created_at    : now,
                    last_modified : now
                }) ) {
                    return true;
                } else {
                    /* XXX a bit too vague */
                    throw new Meteor.Error( 400, 'An error happened, not able to create user ' + name + '.' );
                }
            } else {
                throw new Meteor.error ( 400, 'Could not create tree for user ' + name + '.' );
            }
            return true;
        } else {
            throw new Meteor.Error( 400, 'User ' + name + ' already exists' );
        }
    },

    /**
     * Insert a node in a directory, checking for names duplication and updating the corresponding DocumentTree in mongoDB
     * @param tree
     * @param name
     * @param dir_id
     * @param tree_id
     * @param is_dir
     * @return {Boolean} Always true if it returns
     */
    insert_in_dir: function(tree, name, dir_id, tree_id, is_dir) {
        var t       = new Tree(tree),
        file_id     = DocumentTree.findOne({_id:tree_id}),
        owner       = t.get_owner(),
        users       = t.fetch_node(dir_id).users,
        now         = Date.now();

        file_id     = file_id.count;

        var node    = {
                            _id           : file_id,
                            is_dir        : is_dir,
                            name          : name,
                            owner         : owner,
                            users         : users,
                            created_at    : now,
                            last_modified : now
                      };

        if ( is_dir ) {
            node.tree = [];
        } else {
            File.insert({tree:tree_id, file_id:file_id, content:''});
        }

        if ( t.name_exists(node, dir_id) ) {
            throw new Meteor.Error(200, 'name_exists');
        } else {
            t.insert(node, dir_id);
            DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}, $inc : {count:1}});
        }
        return true;
    },

    /**
     * Remove a node from directory, updating the corresponding DocumentTree in mongoDB
     * @param tree
     * @param node_id
     * @param tree_id
     * @return {Boolean}
     */
    remove_in_dir: function(tree, node_id, tree_id) {
        var t    = new Tree(tree),
            node =  t.fetch_node(node_id);

        /* TODO: Test this feature */
        if ( node.root ) {
            throw new Meteor.Error(200, 'Can\'t delete root directory');
        } else {
            if ( ! node.is_dir ) {
                File.remove({tree:tree_id, file_id:node_id});
            }
        }

        t.delete(node_id);
        DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});

        return true;
    },

    /**
     * Move a node from a directory to another, checking if the node already exists in directory and checking for duplicate names,
     * updating the corresponding DocumentTree in mongoDB
     * @param tree
     * @param name
     * @param node_id
     * @param to
     * @param tree_id
     * @return {object}
     */
    move_node: function(tree, name, node_id, to, tree_id) {
        var t = new Tree(tree);

        if ( t.node_exists(node_id, to) ) {
            throw new Meteor.Error(200, 'node_exists');
        } else if ( t.name_exists(node_id, to) ) {
            throw new Meteor.Error(200, 'name_exists');
        } else {
            if ( t.move(node_id, to) )
                DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});
            else
                throw new Meteor.Error(200, 'directory_in_directory');
        }

        return t.tree;
    },

    /**
     * Delete all nodes in the tree, except for root
     * @param tree
     * @param tree_id
     */
    delete_all_in_tree: function(tree, tree_id) {
        var t = new Tree(tree);
        t.delete_all();

        DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});
    },

    /**
     * Add or remove a user from a node and each subdirectories if it's a directory
     * @param {Boolean} true for add, false for remove
     * @param tree The current tree
     * @param user_name The username
     * @param node_id Node into which will start adding or removing user names
     * @param tree_id Tree into which will be done DB insertion
     */
    toggle_user_for_node: function(add, tree, user_name, node_id, tree_id) {
        var t = new Tree(tree);

        if ( user_name === t.get_owner() ) {
            throw new Meteor.Error(200, "Can't remove or add owner");
        }

        t.toggle_user(add, user_name, node_id);
        DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});
        return true;
    },

    change_node_name: function(tree, name, node_id, tree_id) {
        var t           = new Tree(tree),
            name_exists = false,
            node        = t.fetch_node(node_id);

        _.each(t.fetch_parent(node_id).tree, function(_node){
            // We check if the node name and the node type match ( File and directory can have the same name )
            if ( _node.name === name && _node.is_dir === node.is_dir )
                name_exists = true;
        });

        if ( !name_exists ) {
            node.name = name;
            DocumentTree.update({_id:tree_id}, {$set : {root:t.tree}});
        } else {
            // We do nothing if we are renaming a node with it's own name
            if ( node.name === name )
                throw new Meteor.Error('200', null);
            else
                throw new Meteor.Error('200', "A file or directory with this name already exists in the current directory.");
        }
    }
});