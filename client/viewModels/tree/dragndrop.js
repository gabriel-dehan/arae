

Template.node.events = {
    /* Triggered after render and DOM insertions */
    'afterinsert': function(e) {
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
};

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

    /* TODO: Remove style when drag end is not reached (if we drag off the documenttree for exemple) */
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

//    try {
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
        var name        = $(dragged_element).find('a').text().trim();

        if ( destination && id ) {
            dragged_element.innerHTML = '';

            var el = document.createElement('div');
            el.innerHTML = e.dataTransfer.getData('text/html');
            /* /!\ We need to take the last element in 'el' because on Chrome the first element is a meta /!\ */
            that.appendChild(el.childNodes[el.childNodes.length - 1]);

            Meteor.call('move_node', Session.get('current_tree'), name, id, destination, Session.get('tree_id'), function(error, result){
                if ( error) {
                    if ( error.reason === 'name_exists' ) {
                        Meteor.message.set('"' + name + '" already exists.', 'warning');
                    } else {
                        Meteor.message.set('Can not move "' + name + '" into its own directory.', 'warning');
                    }
                    Meteor.navigate(Session.get('route'));
                } else {
                    Template.tree.init();
                }
            });
        } else {
            Message.set('You must log in.<br />If you already are, try to log out and then log in again, this issue is due to a server maintenance.', 'important');
            Meteor.navigate(Session.get('route'));
        }
//    } catch(e) {
//        console.log(e);
//    }

    return false;
}

function drag_end(e){
    [].forEach.call(document.querySelectorAll('.dir-name, .dir'), function(dir){
        dir.classList.remove('ondrag');
        dir.classList.remove('file-dragover');
        dir.classList.remove('dir-dragover');
    });
}
