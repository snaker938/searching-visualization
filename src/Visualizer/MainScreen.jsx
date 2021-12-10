import React, { Component } from "react";
import { displayCard, displayDeck } from "../Cards";
import "./visualizer.css";

export default class MainScreen extends Component {
  constructor() {
    super();
    this.state = {
      wholeDeck: [],
      randomizedDeck: [],
      deckShown: true,
      cardsShown: [],
      currentIndex: 0,
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
      console.log("adding", this.state.cardsShown);
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

  displayCardsShown = () => {
    const cards = [];

    for (let i = 0; i <= this.state.cardsShown.length; i++) {
      cards.push(this.state.cardsShown[i]);
    }

    return cards;
  };

  render() {
    let deck;

    if (this.state.deckShown) {
      deck = displayDeck();
    } else {
      deck = null;
    }
    return (
      <>
        <p className="cool-text-bar"></p>
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
        {deck}
        <div>{this.displayCardsShown()}</div>
      </>
    );
  }
}
