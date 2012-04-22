User = new Meteor.Collection("user");

if ( Meteor.is_server ) {
    Meteor.startup(function() {
        if( User.find().count() === 0 ) {
            var users = [
                {
                    name : 'admin',
                    pass : 'password',
                    tree_id : 'aa3330cd-6823-4c11-87e2-a8c0519df2d0'
                },
                {
                    name : 'nicolas',
                    pass : 'nicolas',
                    tree_id : 'aa3330cd-6823-4c11-87e2-a8c0519df2d0'
                },
                {
                    name : 'gabriel',
                    pass : 'gabriel',
                    tree_id : 'aa3330cd-6823-4c11-87e2-a8c0519df2d0'
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