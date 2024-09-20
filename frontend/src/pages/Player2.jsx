import React from "react";
import Card2 from "./Card2";

const Player2 = ({ id, hand, bet, folded, isComputer, isBlind, showdown }) => {
	return (
		<div className="player-container text-center p-4 border border-gray-600 rounded-lg bg-gray-800">
			<h3 className="text-lg font-semibold mb-2 text-white">
				{id === "player" ? "You" : id}
			</h3>
			<div className="flex flex-wrap justify-center">
				{hand.map((card, index) => (
					<Card2
						key={index}
						value={card.value}
						suit={card.suit}
						isHidden={
							(isComputer && !showdown && isBlind) || (!isComputer && isBlind)
						}
					/>
				))}
			</div>
			<p className="text-white mt-2">Bet: {bet}</p>
			{folded && <p className="text-red-500 mt-2">Folded</p>}
		</div>
	);
};

export default Player2;
