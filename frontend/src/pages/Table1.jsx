import React from "react";
import image from "../assets/TableBG.webp";
import Player1 from "./Player1";
import PokerGame from "./PokerGame";

const Table1 = () => {
	return (
		<div className="relative h-screen w-screen flex justify-center items-center overflow-hidden">
			<img
				src={image}
				className="w-[100%] absolute -z-10"
				alt="Table background"
			/>
			<PokerGame
				renderPlayers={(
					gameState,
					player,
					computer1,
					computer2,
					communityCards,
					showdown
				) => (
					<>
						{/* Dealer position */}
						<div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
							<Player1
								name="Community Cards"
								hand={communityCards}
								bet={0}
								folded={false}
								isComputer={false}
								showdown={true}
							/>
						</div>

						{/* Player position */}
						<div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
							<Player1
								name="Player"
								hand={player.hand}
								bet={player.bet}
								folded={player.folded}
								isComputer={false}
								showdown={showdown}
							/>
						</div>

						{/* Computer 1 position */}
						<div className="absolute top-[50%] left-[15%] transform -translate-y-1/2">
							<Player1
								name="Computer 1"
								hand={computer1.hand}
								bet={computer1.bet}
								folded={computer1.folded}
								isComputer={true}
								showdown={showdown}
							/>
						</div>

						{/* Computer 2 position */}
						<div className="absolute top-[50%] right-[15%] transform -translate-y-1/2">
							<Player1
								name="Computer 2"
								hand={computer2.hand}
								bet={computer2.bet}
								folded={computer2.folded}
								isComputer={true}
								showdown={showdown}
							/>
						</div>
					</>
				)}
			/>
		</div>
	);
};

export default Table1;
