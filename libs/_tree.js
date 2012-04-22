var Tree = Base.extend({
    constructor: function(tree) {
        this.tree = tree;
    },

    insert: function(node_to_insert, node_id, tree){
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node){
            if ( node.is_dir ) {
                if ( node_id === node._id )
                    node.tree.push(node_to_insert);
                else if ( node.is_dir )
                    that.insert(node_to_insert, node_id, node.tree);
            }
        });
    },

    delete: function(node_id, tree){
        var that = this;
        if ( tree === undefined ) tree = that.tree;

        _.each(tree, function(node, i){
            if ( node_id === node._id )
                tree.remove(i);
            if ( node.is_dir )
                that.delete(node_id, node.tree);
        });
    },

    parse: function(depth, tree){
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
    }
});

/*Repository = new Tree;
Repository.insert({
    is_dir: 0,
    name   : 'leaf9.txt',
    _id    : 8
}, 7);
Repository.delete(2);
Repository.parse(0);
*/
