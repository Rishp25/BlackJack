import React from "react";
import image from "../assets/TableBG.webp";
import Player2 from "./Player2";
import TeenPatti from "./TeenPatti";

const Table2 = () => {
	return (
		<div className="relative h-screen w-screen flex justify-center items-center overflow-hidden">
			<img
				src={image}
				className="w-[100%] absolute -z-10"
				alt="Table background"
			/>
			<TeenPatti
				renderPlayers={(gameState, players, showdown) => (
					<>
						{/* Player position */}
						<div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
							<Player2 {...players[0]} showdown={showdown} />
						</div>

						{/* Computer 1 position */}
						<div className="absolute top-[30%] left-[15%] transform -translate-y-1/2">
							<Player2 {...players[1]} showdown={showdown} />
						</div>

						{/* Computer 2 position */}
						<div className="absolute top-[30%] right-[15%] transform -translate-y-1/2">
							<Player2 {...players[2]} showdown={showdown} />
						</div>
					</>
				)}
			/>
		</div>
	);
};

export default Table2;
