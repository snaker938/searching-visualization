import React, { Component } from "react";
import { displayCard, displayCardToFindOnDeck, displayDeck } from "../Cards";
import { linearSearch } from "./LinearSearch";
import "./visualizer.css";

let arrowShown = false;
let runningLinearAnimation = false;
let runningActualLinearAnimation = false;

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
      arrowCoords: ["40px", "540px"],
      indexOfCardToFind: null,
    };
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
    console.log("getting whole deck...");
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
    const suits = ["clover", "diamond", "heart", "spade"];

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
      console.log("adding");
      let deck = this.getDeckUsingForLoop();
      let card = deck[0];
      let currentCards = this.state.cardsShown;
      currentCards.push(card);
      this.setState({ cardsShown: currentCards });
      this.setState({ currentIndex: this.state.currentIndex + 1 });
      let id =
        this.state.randomizedDeck[this.state.currentIndex].suit +
        this.state.randomizedDeck[this.state.currentIndex].value;

      // document.getElementById(id).className = "card-final-pos";
      setTimeout(() => {
        card = document.getElementById(id);
        document.getElementById(id).className = "card-final-pos";
      }, 60); // used to be 5
    }
  }

  removeCard() {
    if (this.state.currentIndex !== 0) {
      console.log("removing...");
      this.state.cardsShown.pop();
      this.setState({ cardsShown: this.state.cardsShown });
      this.setState({ currentIndex: this.state.currentIndex - 1 });
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
    const suits = ["clover", "diamond", "heart", "spade"];
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
          top={this.state.arrowCoords[1]}
          left={this.state.arrowCoords[0]}
        />
      );
      return arrow;
    }
  }
  animateArrow() {
    if (!runningActualLinearAnimation) {
      // this.setState({ runningActualLinearAnimation: true });
      runningActualLinearAnimation = true;
      let numberOfRepeatsLess = 0;
      let numberOfRows = Math.round(this.state.cardsShown.length / 17);
      if (numberOfRows <= 1) numberOfRepeatsLess = 0;
      else if (numberOfRows === 2) numberOfRepeatsLess = 1;
      else if (numberOfRows === 3) numberOfRepeatsLess = 2;
      for (
        let i = 0;
        i <= this.state.cardsShown.length - numberOfRepeatsLess;
        i++
      ) {
        console.log("animating...", i, this.state.cardsShown.length);
        setTimeout(() => {
          if (i % 16 === 0 && i !== 0 && i !== 33) {
            let currentY = this.state.arrowCoords[1].split(/[px]/)[0];
            let newPosY = `${Number(currentY) + 256}px`;
            document.getElementById("arrow").style.top = newPosY;
            document.getElementById("arrow").style.left = "40px";
            this.setState({ arrowCoords: ["40px", newPosY] });
          } else {
            let currentX = this.state.arrowCoords[0].split(/[px]/)[0];
            let newPosX = `${Number(currentX) + 106}px`;
            document.getElementById("arrow").style.left = newPosX;
            this.setState({
              arrowCoords: [newPosX, this.state.arrowCoords[1]],
            });
          }
          // this.setState({ arrowPosY: newPosY });
        }, 750 * i);
      }
    }
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
      this.state.arrowCoords,
      runningLinearAnimation,
      runningActualLinearAnimation,
      this.state.indexOfCardToFind
    );
  }

  render() {
    let deck;
    let arrow;

    if (this.state.deckShown) {
      deck = displayDeck();
    } else {
      deck = this.state.cardToFind;
    }

    if (runningLinearAnimation && !arrowShown) {
      arrow = this.displayLinearArrow();
      setTimeout(() => {
        this.animateArrow();
      }, 1000);
    } else {
      arrow = null;
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
        <button className="find" onClick={() => {}}>
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
            this.getData();
          }}
        >
          Get Data
        </button>
        {deck}
        <div>{this.displayCardsShown()}</div>
        {arrow}
      </>
    );
  }
}
