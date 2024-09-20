import React from "react";

// Import all cards
import card1c from "../assets/1c.png"; // Ace of Clubs
import card2c from "../assets/2c.png"; // 2 of Clubs
import card3c from "../assets/3c.png";
import card4c from "../assets/4c.png";
import card5c from "../assets/5c.png";
import card6c from "../assets/6c.png";
import card7c from "../assets/7c.png";
import card8c from "../assets/8c.png";
import card9c from "../assets/9c.png";
import card10c from "../assets/10c.png";
import card11c from "../assets/11c.png"; // Jack of Clubs
import card12c from "../assets/12c.png"; // Queen of Clubs
import card13c from "../assets/13c.png"; // King of Clubs

import card1d from "../assets/1d.png"; // Ace of Diamonds
import card2d from "../assets/2d.png";
import card3d from "../assets/3d.png";
import card4d from "../assets/4d.png";
import card5d from "../assets/5d.png";
import card6d from "../assets/6d.png";
import card7d from "../assets/7d.png";
import card8d from "../assets/8d.png";
import card9d from "../assets/9d.png";
import card10d from "../assets/10d.png";
import card11d from "../assets/11d.png"; // Jack of Diamonds
import card12d from "../assets/12d.png"; // Queen of Diamonds
import card13d from "../assets/13d.png"; // King of Diamonds

import card1h from "../assets/1h.png"; // Ace of Hearts
import card2h from "../assets/2h.png";
import card3h from "../assets/3h.png";
import card4h from "../assets/4h.png";
import card5h from "../assets/5h.png";
import card6h from "../assets/6h.png";
import card7h from "../assets/7h.png";
import card8h from "../assets/8h.png";
import card9h from "../assets/9h.png";
import card10h from "../assets/10h.png";
import card11h from "../assets/11h.png"; // Jack of Hearts
import card12h from "../assets/12h.png"; // Queen of Hearts
import card13h from "../assets/13h.png"; // King of Hearts

import card1s from "../assets/1s.png"; // Ace of Spades
import card2s from "../assets/2s.png";
import card3s from "../assets/3s.png";
import card4s from "../assets/4s.png";
import card5s from "../assets/5s.png";
import card6s from "../assets/6s.png";
import card7s from "../assets/7s.png";
import card8s from "../assets/8s.png";
import card9s from "../assets/9s.png";
import card10s from "../assets/10s.png";
import card11s from "../assets/11s.png"; // Jack of Spades
import card12s from "../assets/12s.png"; // Queen of Spades
import card13s from "../assets/13s.png"; // King of Spades
import back from "../assets/back.jpg"; // Back of the card

const cardImages = {
	"1c": card1c,
	"2c": card2c,
	"3c": card3c,
	"4c": card4c,
	"5c": card5c,
	"6c": card6c,
	"7c": card7c,
	"8c": card8c,
	"9c": card9c,
	"10c": card10c,
	"11c": card11c,
	"12c": card12c,
	"13c": card13c, // Clubs

	"1d": card1d,
	"2d": card2d,
	"3d": card3d,
	"4d": card4d,
	"5d": card5d,
	"6d": card6d,
	"7d": card7d,
	"8d": card8d,
	"9d": card9d,
	"10d": card10d,
	"11d": card11d,
	"12d": card12d,
	"13d": card13d, // Diamonds

	"1h": card1h,
	"2h": card2h,
	"3h": card3h,
	"4h": card4h,
	"5h": card5h,
	"6h": card6h,
	"7h": card7h,
	"8h": card8h,
	"9h": card9h,
	"10h": card10h,
	"11h": card11h,
	"12h": card12h,
	"13h": card13h, // Hearts

	"1s": card1s,
	"2s": card2s,
	"3s": card3s,
	"4s": card4s,
	"5s": card5s,
	"6s": card6s,
	"7s": card7s,
	"8s": card8s,
	"9s": card9s,
	"10s": card10s,
	"11s": card11s,
	"12s": card12s,
	"13s": card13s, // Spades
	back: back, // Back of the card
};

const Card2 = ({ value, suit, isHidden }) => {
	const getCardFileName = () => {
		if (isHidden) return "back";

		const suitMap = {
			"♣": "c",
			"♦": "d",
			"♥": "h",
			"♠": "s",
		};

		const valueMap = {
			A: "1",
			J: "11",
			Q: "12",
			K: "13",
		};

		const cardValue = valueMap[value] || value;
		const cardSuit = suitMap[suit];

		return `${cardValue}${cardSuit}`;
	};

	const cardFileName = getCardFileName();
	const imagePath = cardImages[cardFileName];

	return (
		<div className="card inline-block mr-2 mb-2">
			{imagePath ? (
				<img
					src={imagePath}
					alt={isHidden ? "Hidden card" : `${value} of ${suit}`}
					className="w-16 h-24 object-contain rounded-lg shadow-md"
				/>
			) : (
				<p>Card image not found</p>
			)}
		</div>
	);
};

export default Card2;
