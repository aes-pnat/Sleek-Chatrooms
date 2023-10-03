export const palindrome = (inp: string): string => {
  var reversed = inp.split("").reverse().join("");
  return inp === reversed ? reversed : inp;
};

export const palindromeActualTask = (inp: string): string => {
  return inp;
};
