String.prototype.trim = function(c) {
    var r = new RegExp('(^' + c + ')|(' + c + '$)', 'g');
    return this.replace(r, "");
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}