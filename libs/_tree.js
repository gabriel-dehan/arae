var Tree = Base.extend({
    constructor: function(tree) {
        this.tree = tree;
        this.count = this.count_nodes(0);
    },

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

    delete: function(node_id, tree){
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node, i){
            if ( node_id == node._id )
                tree.remove(i);
            if ( node.is_dir )
                that.delete(node_id, node.tree);
        });
    },

    display: function(depth, tree){
        var name = '';
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        if ( depth === 0 )
            console.log('/');

        _.each(tree, function(node){
            name = '';
            if ( depth > 0 )
                name += ' '.times(depth * 4)
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