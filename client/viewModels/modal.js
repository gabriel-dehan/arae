Template.modal.user = function() {
    return User.find( { name : { $ne : 'admin' } } ).fetch();
};