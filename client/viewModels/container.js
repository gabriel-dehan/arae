/**
 * Check if there is a message waiting to be displayed
 * @return {boolean}
 */
Template.container.has_message = function() {
    return Meteor.message.has_one();
}

//Template.container.events = {
//    'afterinsert' : function() {
//        console.log($("#editor-area"));
//        $("#editor-area").markItUp(mySettings);
//        console.log('penis2');
//    }
//};