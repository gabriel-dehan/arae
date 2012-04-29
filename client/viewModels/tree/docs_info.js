/**
 * Retrieve document informations from database for a selected file or directory
 * @return {Object}
 */
Template.doc_infos.selected = function() {
    if (! Session.get('selected_file') )
        Session.set('selected_file', 0);

    var t         = new Tree(Session.get('current_tree')),
        node          = t.fetch_node(Session.get('selected_file')),
        created_at    = new Date(node.created_at),
        last_modified = new Date(node.last_modified);

    return {
        owner         : node.owner,
        created_on    : created_at.format("mm/dd/yyyy"),
        created_at    : created_at.format("H:MM:ss"),
        last_modified : last_modified.format("mm/dd/yyyy, H:MM:ss")
    };
};
