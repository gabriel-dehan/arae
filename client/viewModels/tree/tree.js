var tree = null;

/**
 * Retrieve a node tree
 */
Template.node.node = function() {
    /* If tree has not been defined, we get it from the database */
    if ( tree === undefined || tree === null ) {
        tree = DocumentTree.findOne({_id:Session.get('tree_id')});
        /* We wait for tree to be defined ( Database can sometimes take a "while" to answer ) */
        if ( tree ) {
            tree = tree.root;
            Session.set('current_tree', tree);
            return tree;
        } else {
            return [];
        }
    } else {
        return tree;
    }
}

/**
 * Parse a node recursively
 * @param node
 */
Template.node.parse = function(node) {
    if ( node.is_dir ) {
        tree = node.tree;
        return node;
    } else {
        return node;
    }
}

/**
 * Check if a user can edit a node
 */
Template.node.user_can_edit = function() {
    if ( Session.get('user') ) {
        return Session.get('user').tree_id === Session.get('tree_id');
    } else {
        return false;
    }
}

/**
 * Reset the parsed tree
 */
Template.tree.init = function(){
    tree = null;
}

Template.tree.events = {
    /*
     * Add a file or directory
     */
    'click .add-file, click .add-dir' : function(e){
        var parent_id = $(e.target).parent('ul.edit').attr('data-id');
        var is_dir    = $(e.target).hasClass('add-dir');

        if ( is_dir ) {
            var name = prompt('Directory name', 'New Directory');
            is_dir = 1;
        } else {
            var name = prompt('File name', 'New file');
            is_dir = 0;
        }

        Meteor.call('insert_in_dir', Session.get('current_tree'), name, parent_id, Session.get('tree_id'), is_dir, function(error, result){
            if ( error ) {
                console.log(error);
            } else {
                Template.tree.init();
            }
        });
    },

    /*
     * Remove a file or directory
     */
    'click .rm-file, click .rm-dir' : function(e){
        var node_id = $(e.target).parent('ul.edit').attr('data-id');

        Meteor.call('remove_in_dir', Session.get('current_tree'), node_id, Session.get('tree_id'), function(error, result){
            if ( error ) {
                console.log(error);
            } else {
                Template.tree.init();
            }
        });
    }
}

Template.node.callback = function(){
    if ( Template.node.user_can_edit() ) {
        $('.file-name, .dir-name').each(function() {
            /* We extract the DOM Object from jQuery */
            var node = $(this).find('a')[0];
            var parent = $(this)[0];

            if (node && parent) {
                node.addEventListener('dragstart', drag_start, false);

                /* We want to be able to match the drag[enter|over|leave] & drop events on the File name itself but also on the whole line */
                node.addEventListener('dragenter',   drag_enter, false);
                parent.addEventListener('dragenter', drag_enter, false);

                node.addEventListener('dragover',    drag_over, false);
                parent.addEventListener('dragover',  drag_over, false);

                node.addEventListener('dragleave',   drag_leave, false);
                parent.addEventListener('dragleave', drag_leave, false);

                node.addEventListener('drop', drop, false);
                parent.addEventListener('drop', drop, false);

                node.addEventListener('dragend', drag_end, false);
            }
        });
    }
}

var dragged_element = null;

function drag_start(e){
    this.classList.add('ondrag');
    this.parentNode.classList.add('ondrag');

    dragged_element = this.parentNode;
    e.dataTransfer.effectAllowed = 'move';

    /* outerHTML : @see libs/_DOMnode.js */
    e.dataTransfer.setData('text/html', this.parentNode.outerHTML);

    /* TODO: SET AN ICON FOR DRAG N DROP <3 */
    // var dragIcon = document.createElement('img');
    // dragIcon.src = 'logo.png';
    // dragIcon.width = 100;
    // e.dataTransfer.setDragImage(dragIcon, -10, -10);
}

function drag_enter(e){
    var that = (this.classList.contains('file-name') || this.classList.contains('dir-name')) ? this : this.parentNode ;

    if ( that.classList.contains('dir-name') ) {
        that.classList.add('dir-dragover');
    } else {
        that.parentNode.classList.add('file-dragover');
    }
}

function drag_leave(e){
    var that = (this.classList.contains('file-name') || this.classList.contains('dir-name')) ? this : this.parentNode ;

    if ( that.classList.contains('dir-name') ) {
        that.classList.remove('dir-dragover');
    } else {
        that.parentNode.classList.remove('file-dragover');
    }
}

function drag_over(e){
    if( e.preventDefault )
        e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
    return false;
}

function drop(e){
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;

    try {
        var that;
        /* <A> */
        if ( !( this.classList.contains('file-name') || this.classList.contains('dir-name') ) ) {
            that = this.parentNode;
        } else {
            that = this;
        }

        that = (that.classList.contains('file-name')) ? that.parentNode : that.nextElementSibling ;

        var destination = that.id;
        var id          = $(dragged_element).find('.edit').attr('data-id');

        if ( destination && id ) {
            dragged_element.innerHTML = '';

            var el = document.createElement('div');
            el.innerHTML = e.dataTransfer.getData('text/html');
            /* /!\ We need to take the last element in 'el' because on Chrome the first element is a meta /!\ */
            that.appendChild(el.childNodes[el.childNodes.length - 1]);

            Meteor.call('move_node', Session.get('current_tree'), id, destination, Session.get('tree_id'), function(error, result){
                if ( error ) {
                    console.log(error);
                } else {
                    Template.tree.init();
                }
            });
        } else {
            Message.set('You must log in.<br />If you already are, try to log out and then log in again, this issue is due to a server maintenance.', 'important');
            Meteor.navigate(Session.get('route'));
        }
    } catch(e) {
        console.log(e);
    }

    return false;
}

function drag_end(e){
    [].forEach.call(document.querySelectorAll('.dir-name, .dir'), function(dir){
        dir.classList.remove('ondrag');
        dir.classList.remove('file-dragover');
        dir.classList.remove('dir-dragover');
    });
}
