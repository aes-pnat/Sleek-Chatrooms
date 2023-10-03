"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function palindrome(inp) {
    var reversed = inp.split("").reverse().join("");
    return inp === reversed;
}
console.log(palindrome("abba"));
console.log(palindrome("abBa"));
