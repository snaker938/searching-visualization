import React from "react";
import cardBack from "./Visualizer/assets/card-back.png";
import "./Visualizer/visualizer.css";

function getSRC(suit, num) {
  return require(`./Visualizer/assets/cards/${suit}/card_${num}_${suit}.png`)
    .default;
}

function displayCard(suit, num) {
  let src = getSRC(suit, num);
  return (
    <img
      className="card"
      src={src}
      alt={`${suit + num}`}
      id={`${suit + num}`}
      key={`${suit + num}`}
      height={144}
      width={96}
    />
  );
}

function displayDeck() {
  return (
    <img
      src={cardBack}
      className="card-back"
      alt="card-back"
      key="card-back"
      height={144}
      width={96}
    />
  );
}

export { displayCard, displayDeck };
