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
    }
});