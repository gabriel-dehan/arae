/**
 * Tree class, a tree shall be constructed with an array of objects like this :
 * TODO: Give details
 * [{
         root          : true,
         is_dir        : 1,
         owner         : name.capitalize(),
         users         : [name.capitalize()],
         _id           : 1,
         created_at    : `timestamp`,
         last_modified : `timestamp`,
         tree          : [
                             {
                                 is_dir        : 0,
                                 _id           : 2,
                                 name          : 'leaf1',
                                 created_at    : `timestamp`,
                                 last_modified : `timestamp`,
                             },
                             {
                                 is_dir        : 1,
                                 _id           : 3,
                                 name          : 'branch1',
                                 created_at    : `timestamp`,
                                 last_modified : `timestamp`,
                                 tree          : [ { ... } ]
                             },
                             { ... }
                         ]
    }]
 * @type {*}
 */
var Tree = Base.extend({
    constructor: function(tree) {
        this.tree = tree;
        this.count = this.count_nodes(0);
    },

    /**
     * Get tree owner
     * @param tree
     */
    get_owner: function() {
        var first = this.tree[0];
        // If first element of tree is root (we are on a regular DocumentTree)
        if ( first.root ) {
            return first.owner;
        // Else there is no real owner
        } else {
            return 'Anonymous';
        }
    },

    /**
     * Delete all nodes of root
     * @return {Boolean}
     */
    delete_all: function() {
        var first = this.tree[0];
        if ( first.root ) {
            first.tree = [];
            return true;
        } else {
            return false;
        }
    },

    /**
     * Count recursively the nodes of a tree
     * @param {number} count
     * @param {object} tree
     */
    count_nodes: function(count, tree) {
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node){
            if ( node.is_dir ) {
                count = that.count_nodes( count, node.tree );
            }
            count++;
        });
        return count;
    },

    /**
     * Insert a node into the tree
     * @param node_to_insert
     * @param node_id
     * @param tree
     */
    insert: function(node_to_insert, node_id, tree){
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node){
            if ( node.is_dir ) {
                /* No strict equality as node_id can be a string */
                if ( node_id == node._id ) {
                    node.tree.push( node_to_insert );
                } else if ( node.is_dir ) {
                    that.insert( node_to_insert, node_id, node.tree );
                }
            }
        });
    },

    /**
     * Delete a node from the tree
     * @param node_id
     * @param tree
     * @return {object} deleted The deleted node
     */
    delete: function(node_id, tree){
        var that = this;
        var deleted = null;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node, i){
            /* No strict equality as node_id can be a string */
            if ( node_id == node._id ) {
                tree.remove(i);
                deleted = node;
            }
            if ( node.is_dir ) {
                /* If deleted has already been defined, we stop the recursion and return the result */
                deleted = deleted ? deleted : that.delete( node_id, node.tree );
            }
        });

        return deleted;
    },

    /**
     * Move a node
     * @param node_id
     * @param destination_id
     * @return {Boolean}
     */
    move: function(node_id, destination_id){
        /* We check if the node is the same as the destination node,
         * and if we are trying to move a node inside one of it's own directories
         */
        if ( node_id !== destination_id && !this.tree_contains(node_id, destination_id) ) {
            this.insert( this.delete(node_id), destination_id );
            return true;
        } else {
            return false;
        }
    },

    /**
     * Check if a node is inside a tree
     * @param container_id
     * @param node_id
     * @return {Boolean}
     */
    tree_contains: function(container_id, node_id){
        var container = this.fetch_node(container_id);
        // If the container has a tree (is a directory)
        if ( container.tree ) {
            // If we find the node in the container tree
            if( this.fetch_node( node_id, container.tree ) )
                return true
        }
        return false;
    },

    /**
     * Fetch a node
     * @param node_id
     * @param tree
     */
    fetch_node: function(node_id, tree) {
        var that = this;
        var _node = null;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node){

            /* No strict equality as node_id can be a string */
            if ( node_id == node._id ) {
                _node = node;
            }
            if ( node.is_dir ) {
                /* If deleted has already been defined, we stop the recursion and return the result */
                _node = _node ? _node : that.fetch_node( node_id, node.tree );
            }
        });

        return _node;
    },

    /**
     * Checks if node name already exists in the chosen node
     * @param name
     * @param node_id
     */
    name_exists: function(node_or_id, parent_id){
        var _node;
        if ( typeof node_or_id === 'object' )
            _node = node_or_id;
        else
            _node = this.fetch_node( node_or_id );

        var name  = _node.name,
        is_dir    = _node.is_dir,
        directory = this.fetch_node( parent_id ),
        exists    = false;

        if ( directory.is_dir ) {
            _.each(directory.tree, function(node){
                if( ( name === node.name) && ( is_dir == node.is_dir )) {
                    exists = true;
                    return;
                }
            });
        }
        return exists;
    },

    node_exists: function(node_id, parent_id){
        var directory = this.fetch_node( parent_id );
        var exists    = false;
        if ( directory.is_dir ) {
            _.each(directory.tree, function(node){
                if( node._id == node_id ) {
                    exists = true;
                    return;
                }
            });
        }
        return exists;
    },

    /**
     * Text display for a tree
     * @param depth
     * @param tree
     */
    text_display: function(depth, tree){
        var name = '';
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        if ( depth === 0 )
            console.log('/');

        _.each(tree, function(node){
            name = '';
            if ( depth > 0 )
                name += ' '.times( depth * 4 );
            name += node.name;
            if ( node.is_dir ) {
                name += '/';
            }
            console.log(name);
            if ( node.is_dir ) {
                that.text_display( depth + 1, node.tree );
            }
        });
    },

    /**
     * Returns a HTML string representing the tree
     * @param depth
     * @param tree
     * @param result
     * @return {string} result HTML Representation of tree
     */
    to_html: function(depth, tree, result){
        var name = '';
        var that = this;
        if ( tree   === undefined ) tree = that.tree;
        if ( result === undefined ) result = '<ul id="root">';

        _.each(tree, function(node){
            result += '<li>';

            if ( node.is_dir ) {
                result += '<span class="dir-name">' + node.name + '/</span>';
                result += '<ul class="dir">';
                result = that.to_html( depth + 1, node.tree, result );
                result += '</ul>';
            } else {
                result += '<span class="file-name">' + node.name + '</span>';
            }
            result += '</li>';
        });

        return result + '</ul>';
    }
});