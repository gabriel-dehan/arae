Template.editor.events = {
    'afterinsert' : function() {
        if ( $("#editor-area") ) {
            $("#editor-area").markItUp(mySettings);
        }
    },
    'keyup #editor-area, change #editor-area' : function (e) {
        // TODO: Server side
        File.update({ tree:Session.get('tree_id'), file_id:parseInt(Session.get('edited_file')) }, { $set : { content : $(e.target).val() }});
    }
};

// TODO : When switching file, the preview should not stay

//Meteor.startup(function(){
//    $("#editor-area").markItUp(mySettings);
//});

Template.textarea.get_file = function(ret) {
    var content   = '';
    if ( Session.get('edited_file') ) {
        var file = File.findOne({ tree:Session.get('tree_id'), file_id:parseInt(Session.get('edited_file')) });
        if ( file && !ret ) {
            $('#editor-area').val(file.content);
        } else if ( file && ret ) {
            return file.content;
        }
    }
};