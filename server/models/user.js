User = new Meteor.Collection("user");

if ( Meteor.is_server ) {

    Meteor.startup(function() {

        if( User.find().count() === 0 ) {
            var users = [
                {
                    name : 'admin',
                    pass : 'password',
                    document_id : 1
                },
                {
                    name : 'nicolas',
                    pass : 'nicolas',
                    document_id : 2
                },
                {
                    name : 'gabriel',
                    pass : 'gabriel',
                    document_id : 3
                }
            ]
            _.each(users, function(user) {
                User.insert(
                    {
                        name : user.name,
                        pass : md5(user.pass),
                        document_id : user.document_id
                    }
                );
            })
        }
    });
}