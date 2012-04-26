User = new Meteor.Collection("user");

if ( Meteor.is_server ) {
    Meteor.startup(function() {

//        User.remove({});
        if( User.find().count() === 0 ) {
            var users = [
                {
                    name : 'admin',
                    pass : 'password',
                    tree_id : DocumentTree.findOne()._id
                },
                {
                    name : 'nicolas',
                    pass : 'nicolas',
                    tree_id : DocumentTree.findOne()._id
                },
                {
                    name : 'gabriel',
                    pass : 'gabriel',
                    tree_id : DocumentTree.findOne()._id
                }
            ];
            _.each(users, function(user) {
                User.insert(
                    {
                        name : user.name,
                        pass : md5(user.pass),
                        tree_id : user.tree_id
                    }
                );
            })
        }
    });
}