import React from "react";
import Card from "./Card";

const Player = ({ name, hand, score, isDealer = false }) => {
	return (
		<div className="player-container text-center p-4 border border-gray-600 rounded-lg bg-gray-800">
			<h3 className="text-lg font-semibold mb-2 text-white">
				{name}: {score}
			</h3>
			<div className="flex flex-wrap justify-center">
				{hand.map((card, index) => (
					<Card key={index} value={card.value} suit={card.suit} />
				))}
				{isDealer && hand.length === 2 && (
					<div className="mt-2">
						<Card value="?" suit="?" />
					</div>
				)}
			</div>
		</div>
	);
};

export default Player;
