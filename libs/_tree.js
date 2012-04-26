var Tree = Base.extend({
    constructor: function(tree) {
        this.tree = tree;
        this.count = this.count_nodes(0);
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
                count = that.count_nodes(count, node.tree);
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
                    node.tree.push(node_to_insert);
                } else if ( node.is_dir ) {
                    that.insert(node_to_insert, node_id, node.tree);
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
                deleted = deleted ? deleted : that.delete(node_id, node.tree);
            }
        });

        return deleted;
    },

    /**
     * Move a node
     * @param node_id
     * @param destination_id
     * @param tree
     */
    move: function(node_id, destination_id, tree){
        this.insert( this.delete(node_id), destination_id );
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
                name += ' '.times(depth * 4);
            name += node.name;
            if ( node.is_dir ) {
                name += '/';
            }
            console.log(name);
            if ( node.is_dir ) {
                that.parse(depth + 1, node.tree);
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
                result = that.parse(depth + 1, node.tree, result);
                result += '</ul>';
            } else {
                result += '<span class="file-name">' + node.name + '</span>';
            }
            result += '</li>';
        });

        return result + '</ul>';
    }
});