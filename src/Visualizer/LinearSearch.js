export function linearSearch(currentDeck, cardToFind) {
  for (let i = 0; i < currentDeck.length; i++) {
    if (currentDeck[i].key === cardToFind) {
      //   console.log(i);
      return i;
    }
  }
  //   console.log(-1);
  return -1;
}
