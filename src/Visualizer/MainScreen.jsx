import React, { Component } from "react";
import { displayCard, displayCardToFindOnDeck, displayDeck } from "../Cards";
import { linearSearch } from "./LinearSearch";
import { binarySearch } from "./BinarySearch";
import "./visualizer.css";

let arrowShown = false;
let runningLinearAnimation = false;
let runningActualLinearAnimation = false;
let lastCardAdded = null;
let firstCardCoords = [];
///
let allIndexes = [];
let allProcesses = [];
let firstCardBinaryCoords = [];
let binaryArrowShown = false;
let runningBinaryAnimation = false;
let runningActualBinaryAnimation = false;
let firstCardCoordsBinary = [];
let cardsShownInOrder = [];

let savedMessage = "";

export default class MainScreen extends Component {
  constructor() {
    super();
    this.state = {
      wholeDeck: [],
      randomizedDeck: [],
      cardToFind: null,
      deckShown: true,
      cardsShown: [],
      currentIndex: 0,
      indexOfCardToFind: null,
    };
  }

  reset2() {
    arrowShown = false;
    runningLinearAnimation = false;
    runningActualLinearAnimation = false;
    lastCardAdded = null;
    firstCardCoords = [];
    ///
    allIndexes = [];
    allProcesses = [];
    firstCardBinaryCoords = [];
    binaryArrowShown = false;
    runningBinaryAnimation = false;
    runningActualBinaryAnimation = false;
    firstCardCoordsBinary = [];
    cardsShownInOrder = [];

    this.setState({ indexOfCardToFind: null });

    savedMessage = "";
  }

  componentDidMount() {
    const deck = this.getWholeDeck();
    this.setState({ wholeDeck: deck });

    const randomizedDeck = this.randomizeDeck();
    this.setState({ randomizedDeck: randomizedDeck });
  }

  randomizeDeck() {
    let currentDeck = this.getWholeDeck();
    let currentIndex = currentDeck.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [currentDeck[currentIndex], currentDeck[randomIndex]] = [
        currentDeck[randomIndex],
        currentDeck[currentIndex],
      ];
    }

    return currentDeck;
  }

  getWholeDeck() {
    const values = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ];
    const suits = ["club", "diamond", "heart", "spade"];

    const cards = [];
    for (let s = 0; s < suits.length; s++) {
      for (let v = 0; v < values.length; v++) {
        const value = values[v];
        const suit = suits[s];
        cards.push({ value, suit });
      }
    }

    return cards;
  }

  addCard() {
    if (this.state.cardsShown.length !== 52) {
      let deck = this.getDeckUsingForLoop();
      let card = deck[0];
      let currentCards = this.state.cardsShown;
      currentCards.push(card);
      lastCardAdded = card;
      cardsShownInOrder.push(card);
      this.orderCardsShown(cardsShownInOrder);
      this.setState({ cardsShown: currentCards });
      this.setState({ currentIndex: this.state.currentIndex + 1 });
      let id =
        this.state.randomizedDeck[this.state.currentIndex].suit +
        this.state.randomizedDeck[this.state.currentIndex].value;

      setTimeout(() => {
        card = document.getElementById(id);
        document.getElementById(id).className = "card";
      }, 60); // used to be 5
    }
  }

  removeCard() {
    if (this.state.currentIndex !== 0) {
      this.state.cardsShown.pop();
      cardsShownInOrder.pop();
      this.orderCardsShown(cardsShownInOrder);
      this.setState({ cardsShown: this.state.cardsShown });
      this.setState({ currentIndex: this.state.currentIndex - 1 });
      lastCardAdded = this.state.cardsShown[this.state.cardsShown.length - 1];
    }
  }

  getDeckUsingForLoop = () => {
    const deck = [];
    for (let i = this.state.currentIndex; i <= 51; i++) {
      deck.push(
        displayCard(
          this.state.randomizedDeck[i].suit,
          this.state.randomizedDeck[i].value
        )
      );
    }

    return deck;
  };

  preBinarySearch(cardToFind) {
    runningActualLinearAnimation = false;
    runningLinearAnimation = false;
    // if (this.state.indexOfCardToFind !== null) this.reset2();
    const values = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ];
    const suits = ["club", "diamond", "heart", "spade"];
    let cardToFindSuit = cardToFind.split(/[0-9]/)[0];
    let length = cardToFindSuit.length;
    let cardToFindNumber = String(cardToFind.slice(length, cardToFind.length));

    if (
      suits.indexOf(cardToFindSuit) > -1 &&
      values.indexOf(cardToFindNumber) > -1 &&
      this.state.cardsShown.length > 0
    ) {
      this.setState({
        cardToFind: displayCardToFindOnDeck(cardToFindSuit, cardToFindNumber),
      });
      cardToFind = cardToFindSuit + String(cardToFindNumber);
      this.setState({ deckShown: false });

      this.orderCardsShown(this.state.cardsShown);

      let cardsShownReduced = [];
      for (const card of this.state.cardsShown) {
        cardsShownReduced.push([
          this.getSuit(card.key),
          this.getNumber(card.key),
        ]);
      }
      let cardsShown = [];
      for (const card of this.state.cardsShown) {
        cardsShown.push(card.key);
      }

      // console.log(cardToFind, cardsShownReduced);
      let results = binarySearch(
        cardsShownReduced,
        cardsShown,
        cardToFind,
        cardToFindSuit,
        cardToFindNumber
      );
      let indexes = results[1];
      let cardToFindIndex = indexes[indexes.length - 1];
      let processes = results[0];
      allIndexes = indexes;
      allProcesses = processes;

      // this.setState({ cardsShown: this.state.cardsShown });

      if (cardToFindIndex > -1) {
        this.setState({ indexOfCardToFind: cardToFindIndex });
        this.setState({ cardsShown: this.state.cardsShown });
        runningBinaryAnimation = true;
      } else {
        runningBinaryAnimation = true;
        // this.setState({ indexOfCardToFind: allIndexes.length - 1 });
      }
    } else {
      this.setState({ deckShown: true });
      this.setState({ cardToFind: null });
      runningBinaryAnimation = false;
    }
  }

  orderCardsShown(currentDeck) {
    let shownCards = currentDeck;

    let sortingArr = ["diamond", "heart", "spade", "club"];

    shownCards.sort(function (a, b) {
      return (
        sortingArr.indexOf(getSuit(a.key)) - sortingArr.indexOf(getSuit(b.key))
      );
    });

    shownCards.sort(function (a, b) {
      return getNumber(a.key) - getNumber(b.key);
    });
    // console.log(shownCards);
    // this.setState({ shownCards: shownCards });

    function getNumber(card) {
      let cardSuit = card.split(/[0-9]/)[0];
      let length = cardSuit.length;
      let cardNumber = Number(card.slice(length, card.length));
      return cardNumber;
    }

    function getSuit(card) {
      let cardSuit = card.split(/[0-9]/)[0];
      let length = cardSuit.length;
      let cardNumber = Number(card.slice(length, card.length));
      return cardSuit;
    }

    // this.setState({ cardsShown: shownCards });
  }

  getSuit(card) {
    let cardSuit = card.split(/[0-9]/)[0];
    let length = cardSuit.length;
    let cardNumber = Number(card.slice(length, card.length));
    return cardSuit;
  }

  getNumber(card) {
    let cardSuit = card.split(/[0-9]/)[0];
    let length = cardSuit.length;
    let cardNumber = Number(card.slice(length, card.length));
    return cardNumber;
  }

  preLinearSearch(currentDeck, cardToFind) {
    const values = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ];
    const suits = ["club", "diamond", "heart", "spade"];
    let cardToFindSuit = cardToFind.split(/[0-9]/)[0];
    let length = cardToFindSuit.length;
    let cardToFindNumber = String(cardToFind.slice(length, cardToFind.length));
    // (myarr.indexOf("turtles") > -1)
    if (
      suits.indexOf(cardToFindSuit) > -1 &&
      values.indexOf(cardToFindNumber) > -1 &&
      this.state.cardsShown.length > 0
    ) {
      this.setState({
        cardToFind: displayCardToFindOnDeck(cardToFindSuit, cardToFindNumber),
      });
      cardToFind = cardToFindSuit + String(cardToFindNumber);
      this.setState({ deckShown: false });
      let index = linearSearch(currentDeck, cardToFind);
      if (index > -1) {
        this.setState({ indexOfCardToFind: index });
        // this.setState({ runningLinearAnimation: true });
        runningLinearAnimation = true;
      } else {
        this.setState({ indexOfCardToFind: this.state.cardsShown.length - 1 });
        // this.setState({ runningLinearAnimation: true });
        runningLinearAnimation = true;
      }
    } else {
      // this.setState({ runningLinearAnimation: false });
      runningLinearAnimation = false;
      this.setState({
        cardToFind: null,
      });
      this.setState({ deckShown: true });
    }
  }

  displayLinearArrow() {
    if (!arrowShown) {
      let src = require(`./assets/arrow.png`).default;
      let arrow = (
        <img
          className="arrow"
          src={src}
          alt={`arrow`}
          id={`arrow`}
          key={`arrow`}
          height={144}
          width={96}
          style={{
            top: this.getFirstCardCoords()[0][1],
            left: this.getFirstCardCoords()[0][0],
          }}
        />
      );

      this.getLinearSearchMessage(this.state.cardsShown[0].key, false, -1);

      document.getElementById("linearSearchMessage").style.left =
        this.getFirstCardCoords()[0][0];
      document.getElementById("linearSearchMessage").style.top =
        this.getFirstCardCoords()[0][1];
      return arrow;
    }
  }

  displayBinaryArrow() {
    if (!binaryArrowShown && runningBinaryAnimation) {
      let index = allIndexes[0];
      // let index = Math.floor(this.state.cardsShown.length - 1 / 2);
      let top = this.getFirstCardBinaryCoords(index, cardsShownInOrder)[0][1];
      let left = this.getFirstCardBinaryCoords(index, cardsShownInOrder)[0][0];

      let src = require(`./assets/arrow.png`).default;
      let arrow = (
        <img
          className="binaryArrow"
          src={src}
          alt={`binarArrow`}
          id={`binaryArrow`}
          key={`binaryArrow`}
          height={144}
          width={96}
          style={{ display: "none" }}
        />
      );

      // setTimeout(function () {
      //   // this.this.preBinarySearch(
      //   // String(document.getElementById("cardToFind").value)
      //   // );
      // }, 1000);

      // this.getLinearSearchMessage(this.state.cardsShown[0].key, false, -1);

      // document.getElementById("linearSearchMessage").style.left =
      //   this.getFirstCardCoords()[0][0];
      // document.getElementById("linearSearchMessage").style.top =
      //   this.getFirstCardCoords()[0][1];

      return arrow;
    }
  }

  getFirstCardBinaryCoords(index, cardsShown2) {
    let idOfCard = cardsShown2[index].key;
    idOfCard = cloneVariable(idOfCard);
    firstCardBinaryCoords = [];
    firstCardBinaryCoords.push([
      `${document.getElementById(idOfCard).getBoundingClientRect().x}px`,
      `${
        Number(document.getElementById(idOfCard).getBoundingClientRect().y) +
        144 +
        20
      }px`,
    ]);
    return firstCardBinaryCoords;
  }

  getFirstCardCoords() {
    let idOfCard = this.state.cardsShown[0].key;
    firstCardCoords = [];
    firstCardCoords.push([
      `${document.getElementById(idOfCard).getBoundingClientRect().x}px`,
      `${
        Number(document.getElementById(idOfCard).getBoundingClientRect().y) +
        144 +
        20
      }px`,
    ]);
    return firstCardCoords;
  }

  animateArrow() {
    if (!runningActualLinearAnimation) {
      runningActualLinearAnimation = true;

      let shownCardCoords = [];
      for (const card of this.state.cardsShown) {
        let idOfCard = card.key;
        shownCardCoords.push([
          `${document.getElementById(idOfCard).getBoundingClientRect().x}`,
          `${document.getElementById(idOfCard).getBoundingClientRect().y}`,
        ]);
      }
      shownCardCoords.shift();
      for (let i = 0; i <= this.state.indexOfCardToFind; i++) {
        setTimeout(() => {
          if (i !== this.state.indexOfCardToFind) {
            if (
              this.state.cardsShown[i].key !==
              this.convertCardToFindIntoString(true)
            ) {
              this.getLinearSearchMessage(
                this.state.cardsShown[i + 1].key,
                false,
                i
              );
            }

            // let currentX = shownCardCoords[i][0].split(/[px]/)[0];
            // let newPosX = `${Number(currentX) + 106}px`;
            let newPosX = shownCardCoords[i][0];
            document.getElementById("arrow").style.left = `${newPosX}px`;

            // let currentY = this.state.arrowCoords[1].split(/[px]/)[0];
            // let newPosY = `${Number(currentY) + 256}px`;

            let newPosY = Number(shownCardCoords[i][1]) + 144 + 20;
            document.getElementById("arrow").style.top = `${newPosY}px`;

            newPosX = newPosX - 150;
            document.getElementById(
              "linearSearchMessage"
            ).style.left = `${newPosX}px`;
            document.getElementById(
              "linearSearchMessage"
            ).style.top = `${newPosY}px`;
          } else {
            if (
              this.state.cardsShown[i].key ===
              this.convertCardToFindIntoString(true)
            ) {
              this.getLinearSearchMessage(
                this.state.cardsShown[i].key,
                true,
                i
              );
              document.getElementById("linearSearchMessage").classList =
                "search-text-final";
              document
                .getElementById("linearSearchMessage")
                .style.removeProperty("top");
              document
                .getElementById("linearSearchMessage")
                .style.removeProperty("left");
            } else {
              document.getElementById(
                "linearSearchMessage"
              ).textContent = `Linear Search ----- The card being search searched for: ${this.convertCardToFindIntoString()}, is not in the deck! It took ${
                this.state.cardsShown.length
              } tries to get to this conclusion!`;
              document.getElementById("linearSearchMessage").classList =
                "search-text-final";
              document
                .getElementById("linearSearchMessage")
                .style.removeProperty("top");
              document
                .getElementById("linearSearchMessage")
                .style.removeProperty("left");
            }
          }
        }, 1650 * i);
      }
    }
  }

  animateBinaryArrow() {
    if (!runningActualBinaryAnimation) {
      runningActualBinaryAnimation = true;

      let shownCardCoords = [];
      for (const card of this.state.cardsShown) {
        let idOfCard = card.key;
        shownCardCoords.push([
          `${document.getElementById(idOfCard).getBoundingClientRect().x}`,
          `${document.getElementById(idOfCard).getBoundingClientRect().y}`,
        ]);
      }
      let relevantCardCoords = [];
      for (let index of allIndexes) {
        relevantCardCoords.push(shownCardCoords[index]);
      }

      let firstCardCoords2 = shownCardCoords[allIndexes[0]];
      document.getElementById(
        "binaryArrow"
      ).style.left = `${firstCardCoords2[0]}px`;
      document.getElementById("binaryArrow").style.top = `${
        Number(firstCardCoords2[1]) + 144 + 20
      }px`;

      allIndexes.shift();
      let numberOfRepeats = allIndexes.length;

      for (let i = 0; i <= allIndexes.length; i++) {
        setTimeout(() => {
          if (i === numberOfRepeats) {
            this.getBinarySearchMessage(i);
            document.getElementById("binaryArrow").style.display = "none";
            document
              .getElementById("binarySearchMessage")
              .style.removeProperty("top");
            document
              .getElementById("binarySearchMessage")
              .style.removeProperty("left");
            document.getElementById("binarySearchMessage").classList =
              "search-text-final2";
          } else {
            document.getElementById("binaryArrow").style.display = "block";

            let newPosX = relevantCardCoords[i][0];
            document.getElementById("binaryArrow").style.left = `${newPosX}px`;

            let newPosY = Number(relevantCardCoords[i][1]) + 144 + 20;
            document.getElementById("binaryArrow").style.top = `${newPosY}px`;

            newPosX = newPosX - 150;
            document.getElementById(
              "binarySearchMessage"
            ).style.left = `${newPosX}px`;
            document.getElementById(
              "binarySearchMessage"
            ).style.top = `${newPosY}px`;

            this.getBinarySearchMessage(i);
          }
        }, 2500 * i);
      }
    }
  }

  getBinarySearchMessage(i) {
    // let cardString = this.convertCardIntoString(card);
    // let cardToFind = this.convertCardToFindIntoString();

    document.getElementById(
      "binarySearchMessage"
    ).textContent = `${allProcesses[i]}`;

    if (document.getElementById("binaryArrow") !== null)
      document.getElementById("binaryArrow").hidden = true;
  }

  getLinearSearchMessage(card, isCorrectCard, i) {
    let cardToFindTemp = this.convertCardToFindIntoString(true);
    if (!isCorrectCard && card !== cardToFindTemp) {
      let cardString = this.convertCardIntoString(card);
      let cardToFind = this.convertCardToFindIntoString();
      console.log("running...");
      document.getElementById(
        "linearSearchMessage"
      ).textContent = `The current card: ${cardString}, is not equal to the card being searched for: ${cardToFind}`;
    } else {
      let cardString = this.convertCardIntoString(card);
      let cardToFind = this.convertCardToFindIntoString();
      if (document.getElementById("arrow") !== null)
        document.getElementById("arrow").style.display = "none";

      document.getElementById(
        "linearSearchMessage"
      ).textContent = `Linear Search ----- The current card: ${cardString}, is equal to the card being searched for: ${cardToFind}. The card has been found at position ${i}. It took ${
        i + 1
      } tries to get to this card!`;
    }
  }

  convertCardIntoString(card) {
    let cardSuit = card.split(/[0-9]/)[0];
    let length = cardSuit.length;
    let cardNumber = String(card.slice(length, card.length));

    return this.getFullCard(cardSuit, cardNumber);
  }

  convertCardToFindIntoString(yes) {
    let card = this.state.cardToFind.key;

    let reducedCard = card.slice(13, card.length);
    if (yes) return reducedCard;
    let cardSuit = reducedCard.split(/[0-9]/)[0];
    let length = cardSuit.length;
    let cardNumber = String(reducedCard.slice(length, reducedCard.length));

    return this.getFullCard(cardSuit, cardNumber);
  }

  getFullNumber(number) {
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

  getFullSuit(suit) {
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

  getFullCard(suit, number) {
    number = this.getFullNumber(number);
    suit = this.getFullSuit(suit);
    return `${number} of ${suit}`;
  }

  displayCardsShown = () => {
    const cards = [];

    for (let i = 0; i <= this.state.cardsShown.length; i++) {
      cards.push(this.state.cardsShown[i]);
    }

    return cards;
  };

  getData() {
    console.log(
      runningLinearAnimation,
      runningActualLinearAnimation,
      this.state.indexOfCardToFind
    );
  }

  resetData() {
    this.setState({ wholeDeck: [] });
    this.setState({ randomizeDeck: [] });
    this.setState({ cardToFind: null });
    this.setState({ deckShown: true });
    this.setState({ cardsShown: [] });
    this.setState({ currentIndex: 0 });
    this.setState({ indexOfCardToFind: null });
    arrowShown = false;
    runningLinearAnimation = false;
    runningActualLinearAnimation = false;
    lastCardAdded = null;
    firstCardCoords = [];
    ///
    allIndexes = [];
    allProcesses = [];
    firstCardBinaryCoords = [];
    binaryArrowShown = false;
    runningBinaryAnimation = false;
    runningActualBinaryAnimation = false;
    firstCardCoordsBinary = [];
    cardsShownInOrder = [];
    document.getElementById("linearSearchMessage").textContent = "";
    document.getElementById("binarySearchMessage").textContent = "";
    document.getElementById("cardToFind").value = "";

    const deck = this.getWholeDeck();
    this.setState({ wholeDeck: deck });

    const randomizedDeck = this.randomizeDeck();
    this.setState({ randomizedDeck: randomizedDeck });
  }

  render() {
    let deck;
    let arrow;
    let linearSearchMessage;
    let binaryArrow;
    let binarySearchMessage;

    if (this.state.deckShown) {
      deck = displayDeck();
    } else {
      deck = this.state.cardToFind;
    }

    if (runningLinearAnimation && !arrowShown) {
      arrow = this.displayLinearArrow();
      linearSearchMessage = ``;
      setTimeout(() => {
        this.animateArrow();
      }, 1000);
    } else {
      arrow = null;
      linearSearchMessage = savedMessage;
    }

    if (runningBinaryAnimation && !binaryArrowShown) {
      binarySearchMessage = ``;
      binaryArrow = this.displayBinaryArrow();
      setTimeout(() => {
        this.animateBinaryArrow();
      }, 1000);
    } else {
      binaryArrow = null;
      binarySearchMessage = ``;
    }

    return (
      <>
        <p className="cool-text-bar"></p>
        <div className="card-to-find text-info">
          <label for="cardToFind">Card to find:</label>
          <input type="text" id="cardToFind" name="cardToFind"></input>
        </div>
        <button
          className="find"
          onClick={() => {
            this.preLinearSearch(
              this.state.cardsShown,
              String(document.getElementById("cardToFind").value)
            );
          }}
        >
          Linear Search
        </button>
        <button
          className="find"
          onClick={() => {
            this.preBinarySearch(
              String(document.getElementById("cardToFind").value)
            );
          }}
        >
          Binary Search
        </button>
        <button
          className="cool-button"
          onClick={() => {
            this.addCard();
          }}
        >
          Add Card
        </button>
        <button
          className="cool-button"
          onClick={() => {
            this.removeCard();
          }}
        >
          Remove Card
        </button>
        <button
          className="cool-button"
          onClick={() => {
            this.resetData();
          }}
        >
          Reset
        </button>
        {deck}
        <div>{this.displayCardsShown()}</div>
        {arrow}
        {binaryArrow}
        <div className="linearSearchText" id="linearSearchMessage">
          {linearSearchMessage}
        </div>
        <div className="binarySearchText" id="binarySearchMessage">
          {binarySearchMessage}
        </div>
      </>
    );
  }
}

function cloneVariable(variableData) {
  return JSON.parse(JSON.stringify(variableData));
}
