User = new Meteor.Collection("user");

if ( Meteor.is_server ) {
    Meteor.startup(function() {
        if( User.find().count() === 0 ) {
            var users = [
                {
                    name : 'admin',
                    pass : 'password',
                    tree_id : 'b821420a-a139-4fe8-8ea2-761b1c0338ec'
                },
                {
                    name : 'nicolas',
                    pass : 'nicolas',
                    tree_id : 'b821420a-a139-4fe8-8ea2-761b1c0338ec'
                },
                {
                    name : 'gabriel',
                    pass : 'gabriel',
                    tree_id : 'b821420a-a139-4fe8-8ea2-761b1c0338ec'
                }
            ]
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