import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast, Toaster } from "react-hot-toast";

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

const getHandRank = (hand) => {
	// Implement Teen Patti hand ranking logic here
	// This is a simplified version and might need to be expanded for a full game
	const values = hand.map((card) => card.value);
	const suits = hand.map((card) => card.suit);

	// Check for Trail (three of a kind)
	if (new Set(values).size === 1) return 6;

	// Check for Pure Sequence (straight flush)
	if (
		new Set(suits).size === 1 &&
		VALUES.join("").includes(values.sort().join(""))
	)
		return 5;

	// Check for Sequence (straight)
	if (VALUES.join("").includes(values.sort().join(""))) return 4;

	// Check for Color (flush)
	if (new Set(suits).size === 1) return 3;

	// Check for Pair
	if (new Set(values).size === 2) return 2;

	// High Card
	return 1;
};

const TeenPatti = ({ renderPlayers }) => {
	const { user, setUser } = useContext(AppContext);
	const [deck, setDeck] = useState([]);
	const [players, setPlayers] = useState([
		{
			id: "player",
			hand: [],
			bet: 0,
			folded: false,
			isComputer: false,
			isBlind: true,
		},
		{
			id: "computer1",
			hand: [],
			bet: 0,
			folded: false,
			isComputer: true,
			isBlind: true,
		},
		{
			id: "computer2",
			hand: [],
			bet: 0,
			folded: false,
			isComputer: true,
			isBlind: true,
		},
	]);
	const [pot, setPot] = useState(0);
	const [currentBet, setCurrentBet] = useState(0);
	const [currentPlayer, setCurrentPlayer] = useState(0);
	const [gameState, setGameState] = useState("betting");
	const [showdown, setShowdown] = useState(false);
	const [bootAmount, setBootAmount] = useState(10); // Minimum bet amount

	useEffect(() => {
		startNewRound();
	}, []);

	useEffect(() => {
		if (players[currentPlayer].isComputer) {
			const timer = setTimeout(() => {
				computerAction(players[currentPlayer]);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [currentPlayer, players]);

	const startNewRound = () => {
		const newDeck = shuffleDeck(createDeck());
		setDeck(newDeck);
		setPlayers(
			players.map((player) => ({
				...player,
				hand: [],
				bet: 0,
				folded: false,
				isBlind: true,
			}))
		);
		setPot(0);
		setCurrentBet(bootAmount);
		setCurrentPlayer(0);
		setGameState("betting");
		setShowdown(false);
		dealInitialCards(newDeck);
	};

	const dealInitialCards = (newDeck) => {
		const newPlayers = players.map((player) => ({
			...player,
			hand: [newDeck.pop(), newDeck.pop(), newDeck.pop()],
			bet: bootAmount, // Everyone puts in the boot amount
		}));
		setPlayers(newPlayers);
		setDeck(newDeck);
		setPot(bootAmount * players.length);
	};

	const placeBet = (amount) => {
		const player = players[currentPlayer];
		const actualBet = player.isBlind ? amount / 2 : amount;

		if (actualBet <= user.numberOfChips) {
			setUser({ ...user, numberOfChips: user.numberOfChips - actualBet });
			const newPlayers = [...players];
			newPlayers[currentPlayer].bet += actualBet;
			setPlayers(newPlayers);
			setPot(pot + actualBet);
			setCurrentBet(Math.max(currentBet, actualBet));
			nextTurn();
		} else {
			toast.error("You don't have enough chips!");
		}
	};

	const fold = () => {
		const newPlayers = [...players];
		newPlayers[currentPlayer].folded = true;
		setPlayers(newPlayers);
		nextTurn();
	};

	const seeCards = () => {
		if (players[currentPlayer].isBlind) {
			const newPlayers = [...players];
			newPlayers[currentPlayer].isBlind = false;
			setPlayers(newPlayers);
			toast.success("You've seen your cards. Betting amount will be doubled.");
		}
	};

	const nextTurn = () => {
		let nextPlayer = (currentPlayer + 1) % players.length;
		while (players[nextPlayer].folded && !allFoldedExceptOne()) {
			nextPlayer = (nextPlayer + 1) % players.length;
		}
		setCurrentPlayer(nextPlayer);

		if (allFoldedExceptOne() || allPlayersActed()) {
			determineWinner();
		}
	};

	const allFoldedExceptOne = () => {
		return players.filter((player) => !player.folded).length === 1;
	};

	const allPlayersActed = () => {
		return players.every(
			(player) => player.folded || player.bet === currentBet
		);
	};

	const computerAction = (computer) => {
		const action = Math.random();
		if (action < 0.1 && computer.isBlind) {
			// See cards
			const newPlayers = [...players];
			const computerIndex = players.findIndex((p) => p.id === computer.id);
			newPlayers[computerIndex].isBlind = false;
			setPlayers(newPlayers);
		} else if (action < 0.7) {
			// Call or Chaal
			placeBet(currentBet - computer.bet);
		} else if (action < 0.9) {
			// Raise
			placeBet(currentBet - computer.bet + Math.floor(Math.random() * 50) + 10);
		} else {
			// Fold
			fold();
		}
	};

	const determineWinner = () => {
		setShowdown(true);
		const activePlayers = players.filter((player) => !player.folded);

		if (activePlayers.length === 1) {
			const winner = activePlayers[0];
			if (winner.id === "player") {
				setUser({ ...user, numberOfChips: user.numberOfChips + pot });
			}
			toast.success(
				`${winner.id === "player" ? "You" : winner.id} win${
					winner.id === "player" ? "" : "s"
				} ${pot} chips!`
			);
		} else {
			const handRanks = activePlayers.map((player) => ({
				...player,
				rank: getHandRank(player.hand),
			}));

			const winningRank = Math.max(...handRanks.map((player) => player.rank));
			const winners = handRanks.filter((player) => player.rank === winningRank);

			const winnings = Math.floor(pot / winners.length);
			winners.forEach((winner) => {
				if (winner.id === "player") {
					setUser({ ...user, numberOfChips: user.numberOfChips + winnings });
				}
			});

			const winnerNames = winners
				.map((w) => (w.id === "player" ? "You" : w.id))
				.join(" and ");
			toast.success(
				`${winnerNames} win${
					winners.length > 1 ? "" : "s"
				} ${winnings} chips each!`
			);
		}

		// Delay before starting a new round
		setTimeout(startNewRound, 3000);
	};

	return (
		<div className="w-full h-full relative">
			{renderPlayers(gameState, players, showdown)}
			{/* Pot display */}
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<div className="bg-green-800 text-white p-2 rounded-full">
					<p className="font-bold">Pot: {pot}</p>
				</div>
			</div>
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
				{currentPlayer === 0 && !players[0].folded && !showdown && (
					<div className="mb-4">
						<p className="text-white mb-2">Your chips: {user.numberOfChips}</p>
						<p className="text-white mb-2">Current bet: {currentBet}</p>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={() => placeBet(currentBet - players[0].bet)}
						>
							{players[0].isBlind ? "Blind" : "Chaal"}
						</button>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={() => placeBet(currentBet - players[0].bet + bootAmount)}
						>
							Raise
						</button>
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={seeCards}
							disabled={!players[0].isBlind}
						>
							See
						</button>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={fold}
						>
							Fold
						</button>
					</div>
				)}
			</div>
			<Toaster />
		</div>
	);
};

export default TeenPatti;
