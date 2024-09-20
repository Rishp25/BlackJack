import React from "react";
import Card1 from "./Card1";

const Player1 = ({ name, hand, bet, folded, isComputer, showdown }) => {
	console.log(name);
	console.log(hand);
	return (
		<div className="player-container text-center p-4 border border-gray-600 rounded-lg bg-gray-800">
			<h3 className="text-lg font-semibold mb-2 text-white">{name}</h3>
			<div className="flex flex-wrap justify-center">
				{hand.map((card, index) => (
					<Card1
						key={index}
						value={card.value}
						suit={card.suit}
						isHidden={isComputer && !showdown}
					/>
				))}
			</div>
			<p className="text-white mt-2">Bet: {bet}</p>
			{folded && <p className="text-red-500 mt-2">Folded</p>}
		</div>
	);
};

export default Player1;
