function palindrome(inp: string): string {
  var reversed = inp.split("").reverse().join("");
  if (inp === reversed) {
    return reversed;
  }
  return inp;
}

console.log(palindrome("abba"));
console.log(palindrome("abBa"));
