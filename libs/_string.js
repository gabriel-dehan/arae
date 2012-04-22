/**
 * Trim a character from the begining and the end of a string
 * @param [Object String] c Character to be removed
 * @return [Object String] Trimmed string
 */
String.prototype.trim = function(c) {
    var r = new RegExp('(^' + c + ')|(' + c + '$)', 'g');
    return this.replace(r, "");
}

/**
 * Uppercase the first character of a string
 * @return [Object String] Capitalized string
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Add the string to itself n times
 * @param {number} n
 * @return {string} New String
 */
String.prototype.times = function(n) { return (new Array(n+1)).join(this);};
