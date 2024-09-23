import React from "react";
import image from "../assets/blackjack_t.jpg";
import Player from "./Player";
import BlackjackGame from "./BlackJackGame";
import { UserProvider } from "./UserContext.jsx";

const Table = () => {
	return (
		<div className="relative h-screen w-screen flex justify-center items-center overflow-hidden">
			<img
				src={image}
				className="w-[100%] absolute -z-10"
				alt="Table background"
			/>
			<BlackjackGame
				renderPlayers={(gameState, player, computer1, computer2, dealer) => (
					<>
						{/* dealer position */}
						<div className="absolute top-[10%] left-[49%] transform -translate-x-1/2">
							<Player
								name="Dealer"
								hand={dealer.hand}
								score={dealer.score}
								isDealer={true}
							/>
						</div>

						{/* player position */}
						<div className="absolute bottom-[10%] left-[49%] transform -translate-x-1/2">
							<Player name="Player" hand={player.hand} score={player.score} />
						</div>

						{/* computer 1 position */}
						<div className="absolute top-[49%] left-[15%] transform -translate-y-1/2">
							<Player
								name="Computer 1"
								hand={computer1.hand}
								score={computer1.score}
							/>
						</div>

						{/* computer 2 position */}
						<div className="absolute top-[49%] right-[15%] transform -translate-y-1/2">
							<Player
								name="Computer 2"
								hand={computer2.hand}
								score={computer2.score}
							/>
						</div>
					</>
				)}
			/>
		</div>
	);
};

export default Table;
