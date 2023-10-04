function palindrome(inp: string): string {
  var reversed = inp.split("").reverse().join("");
  return inp === reversed ? reversed : inp;
}

function palindromeActualTask(inp: string): string {
  return inp;
}

console.log(palindrome("abba"));
console.log(palindrome("abBa"));
