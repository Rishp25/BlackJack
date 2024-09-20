import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import Player from "./Player.jsx";
import Table from "./Table.jsx";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = [
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"J",
	"Q",
	"K",
];

const createDeck = () => {
	return SUITS.flatMap((suit) => VALUES.map((value) => ({ suit, value })));
};

const shuffleDeck = (deck) => {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
};

const TeenPattiGame = () => {
	const { user, setUser } = useContext(AppContext);
	const [deck, setDeck] = useState([]);
	const [players, setPlayers] = useState([
		{ id: 1, hand: [], score: 0, chips: 1000 },
		{ id: 2, hand: [], score: 0, chips: 1000 },
		{ id: 3, hand: [], score: 0, chips: 1000 },
		{ id: 4, hand: [], score: 0, chips: 1000 },
	]);
	const [currentBet, setCurrentBet] = useState(0);
	const [pot, setPot] = useState(0);
	const [gameState, setGameState] = useState("betting");

	useEffect(() => {
		startNewRound();
	}, []);

	const startNewRound = () => {
		const newDeck = shuffleDeck(createDeck());
		setDeck(newDeck);
		setPlayers(players.map((player) => ({ ...player, hand: [], score: 0 })));
		setCurrentBet(0);
		setPot(0);
		setGameState("betting");
	};

	const placeBet = (playerId, amount) => {
		const updatedPlayers = players.map((player) => {
			if (player.id === playerId && player.chips >= amount) {
				return { ...player, chips: player.chips - amount };
			}
			return player;
		});

		setPlayers(updatedPlayers);
		setPot(pot + amount);
		setCurrentBet(amount);
		setGameState("playing");
	};

	const dealCards = () => {
		const updatedDeck = [...deck];
		const updatedPlayers = players.map((player) => {
			const playerHand = [
				updatedDeck.pop(),
				updatedDeck.pop(),
				updatedDeck.pop(),
			];
			return { ...player, hand: playerHand };
		});

		setPlayers(updatedPlayers);
		setDeck(updatedDeck);
	};

	const determineWinner = () => {
		// Simplified winner determination logic
		// (implement hand ranking logic based on Teen Patti rules)
		const winner = players[Math.floor(Math.random() * players.length)];
		setUser({
			...user,
			numberOfChips: user.numberOfChips + pot,
		});
		setPot(0);
		return winner;
	};

	return (
		<div className="w-full h-full relative">
			<Table>
				{players.map((player) => (
					<Player key={player.id} player={player} />
				))}
			</Table>
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
				{gameState === "betting" && (
					<div className="mb-4">
						{players.map((player) => (
							<button
								key={player.id}
								className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
								onClick={() => placeBet(player.id, 50)} // Simplified betting
							>
								Player {player.id} Bet 50
							</button>
						))}
					</div>
				)}
				{gameState === "playing" && (
					<div className="mb-4">
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
							onClick={dealCards}
						>
							Deal Cards
						</button>
					</div>
				)}
				{gameState === "gameOver" && (
					<div>
						<h3 className="text-xl font-semibold mb-2 text-white">
							{determineWinner()} Wins!
						</h3>
						<button
							className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
							onClick={startNewRound}
						>
							New Round
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default TeenPattiGame;
