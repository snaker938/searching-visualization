const sortingArr = ["diamond", "heart", "spade", "club"];
let lastMiddle = null;

export function binarySearch(
  arraySplit,
  arrayWhole,
  target,
  targetSuit,
  targetNumber
) {
  targetNumber = Number(targetNumber);
  // Define Start and End Index
  let startIndex = 0;
  let endIndex = arrayWhole.length - 1;
  // While Start Index is less than or equal to End Index
  let process = [];
  let indexesChecked = [];
  while (startIndex <= endIndex) {
    // Define Middle Index (This will change when comparing )
    let middleIndex = Math.floor((startIndex + endIndex) / 2);
    lastMiddle = middleIndex;
    // console.log(
    //   targetNumber,
    //   target,
    //   arraySplit[middleIndex][1],
    //   startIndex,
    //   endIndex
    // );
    if (target === arrayWhole[middleIndex]) {
      //   console.log("Found");
      process.push(
        `Binary Search ----- The target card was found at index: ${middleIndex}. It took ${
          indexesChecked.length + 1
        } tries to get to this conclusion.`
      );
      indexesChecked.push(middleIndex);
      return [process, indexesChecked];
    }
    // Search Right Side Of Array
    else if (
      targetNumber > arraySplit[middleIndex][1] ||
      (sortingArr.indexOf(targetSuit) >
        sortingArr.indexOf(arraySplit[middleIndex][0]) &&
        targetNumber === arraySplit[middleIndex][1])
    ) {
      //   console.log("Checking Right");
      process.push(
        `Searching to the right side of the ${convertCardIntoString(
          arrayWhole[middleIndex]
        )}...`
      );
      indexesChecked.push(middleIndex);
      lastMiddle = middleIndex;

      //   Assign Start Index and increase the Index by 1 to narrow search
      startIndex = middleIndex + 1;
    }

    // Search Left Side Of Array
    else if (
      targetNumber < arraySplit[middleIndex][1] ||
      (sortingArr.indexOf(targetSuit) <
        sortingArr.indexOf(arraySplit[middleIndex][0]) &&
        targetNumber === arraySplit[middleIndex][1])
    ) {
      //   console.log("Checking left");
      //   Assign End Index and increase the Index by 1 to narrow search
      process.push(
        `Searching to the left side of the ${convertCardIntoString(
          arrayWhole[middleIndex]
        )}...`
      );
      indexesChecked.push(middleIndex);
      lastMiddle = middleIndex;
      endIndex = middleIndex - 1;
    } else {
      //   console.log("Not found this iteration");
      indexesChecked.push(middleIndex);
      lastMiddle = middleIndex;
      process.push(
        `Target was not found in this iteration! Looping through again...`
      );
    }
  }
  // If Target Is Not Found
  //   console.log("Target value not found in array");
  process.push(
    `Binary Search ----- The card being searched for: ${convertCardIntoString(
      target
    )}, is not in the deck!. It took ${
      indexesChecked.length
    } tries to get to this conclusion.`
  );
  indexesChecked.push(lastMiddle);
  return [process, indexesChecked];
}

function convertCardIntoString(card) {
  let cardSuit = card.split(/[0-9]/)[0];
  let length = cardSuit.length;
  let cardNumber = String(card.slice(length, card.length));

  return getFullCard(cardSuit, cardNumber);
}

function getFullNumber(number) {
  if (number === "1") {
    return "Ace";
  } else if (number === "11") {
    return "Jack";
  } else if (number === "12") {
    return "Queen";
  } else if (number === "13") {
    return "King";
  } else return `${number}`;
}

function getFullSuit(suit) {
  if (suit === "diamond") {
    return "Diamonds";
  } else if (suit === "club") {
    return "Clubs";
  } else if (suit === "heart") {
    return "Hearts";
  } else if (suit === "spade") {
    return "Spades";
  }
}

function getFullCard(suit, number) {
  number = getFullNumber(number);
  suit = getFullSuit(suit);
  return `${number} of ${suit}`;
}
