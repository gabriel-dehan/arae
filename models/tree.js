/* Document tree collection */
var DocumentTree = new Meteor.Collection('tree');

if ( Meteor.is_server ) {
    Meteor.startup(function() {
//        var my_tree = DocumentTree.findOne();
//        var repository = new Tree(my_tree.root);
    //    repository.delete(4);
    //    repository.parse(0);
    //    console.log(my_tree._id);

        if( DocumentTree.find().count() === 0 ) {
            var t = [
                {
                    is_dir : 0,
                    name   : 'file.txt',
                    _id    : 0
                },
                {
                    is_dir  : 1,
                    name    : 'foo',
                    _id     : 1,
                    tree    : [
                        {
                            is_dir : 0,
                            _id    : 2,
                            name   : 'leaf.txt'
                        }
                    ]
                },
                {
                    is_dir  : 1,
                    name    : 'bar',
                    _id     : 3,
                    tree    : [
                        {
                            is_dir: 0,
                            _id     : 4,
                            name   : 'leaf1.txt'
                        },
                        {
                            is_dir: 0,
                            _id     : 5,
                            name   : 'leaf2.txt'
                        },
                        {
                            is_dir  : 1,
                            name    : 'bar',
                            _id     : 6,
                            tree    : []
                        }
                    ]
                }
            ];

            DocumentTree.insert({root: t});
        }
    });
}