import React, { useState, useEffect, useContext } from "react";
import { useUser } from "./UserContext.jsx";
import { AppContext } from "../context/AppContext.jsx";

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

const calculateHandValue = (hand) => {
	let value = 0;
	let aceCount = 0;

	for (const card of hand) {
		if (card.value === "A") {
			aceCount++;
			value += 11;
		} else if (["J", "Q", "K"].includes(card.value)) {
			value += 10;
		} else {
			value += parseInt(card.value);
		}
	}

	while (value > 21 && aceCount > 0) {
		value -= 10;
		aceCount--;
	}

	return value;
};

const BlackjackGame = ({ renderPlayers }) => {
	const { user, setUser } = useContext(AppContext);
	const [deck, setDeck] = useState([]);
	const [dealer, setDealer] = useState({ hand: [], score: 0 });
	const [player, setPlayer] = useState({ hand: [], score: 0 });
	const [computer1, setComputer1] = useState({ hand: [], score: 0 });
	const [computer2, setComputer2] = useState({ hand: [], score: 0 });
	const [currentTurn, setCurrentTurn] = useState(0);
	const [gameState, setGameState] = useState("betting");
	const [currentBet, setCurrentBet] = useState(0);
	const [determined, setDetermined] = useState(false);
	const [winnerMessage, setWinnerMessage] = useState("");

	useEffect(() => {
		startNewRound();
	}, []);

	const startNewRound = () => {
		const newDeck = shuffleDeck(createDeck());
		setDeck(newDeck);
		setDealer({ hand: [], score: 0 });
		setPlayer({ hand: [], score: 0 });
		setComputer1({ hand: [], score: 0 });
		setComputer2({ hand: [], score: 0 });
		setCurrentTurn(0);
		setGameState("betting");
		setCurrentBet(0);
		setDetermined(false);
	};

	const placeBet = (amount) => {
		if (amount <= user.numberOfChips) {
			setCurrentBet(amount);
			setUser({
				...user,
				numberOfChips: user.numberOfChips - amount,
			});
			setGameState("dealing");
			dealInitialCards();
		} else {
			alert("You don't have enough chips!");
		}
	};

	const dealInitialCards = () => {
		const updatedDeck = [...deck];
		const dealerHand = [updatedDeck.pop(), updatedDeck.pop()];
		const playerHand = [updatedDeck.pop(), updatedDeck.pop()];
		const computer1Hand = [updatedDeck.pop(), updatedDeck.pop()];
		const computer2Hand = [updatedDeck.pop(), updatedDeck.pop()];

		setDealer({ hand: dealerHand, score: calculateHandValue(dealerHand) });
		setPlayer({ hand: playerHand, score: calculateHandValue(playerHand) });
		setComputer1({
			hand: computer1Hand,
			score: calculateHandValue(computer1Hand),
		});
		setComputer2({
			hand: computer2Hand,
			score: calculateHandValue(computer2Hand),
		});
		setDeck(updatedDeck);
		setGameState("playerTurn");
	};

	const hit = () => {
		if (gameState !== "playerTurn") return;

		const updatedDeck = [...deck];
		const newCard = updatedDeck.pop();
		const updatedHand = [...player.hand, newCard];
		const newScore = calculateHandValue(updatedHand);

		setPlayer({ hand: updatedHand, score: newScore });
		setDeck(updatedDeck);

		if (newScore > 21) {
			setGameState("computerTurn");
			setCurrentTurn(1);
		}
	};

	const stand = () => {
		if (gameState !== "playerTurn") return;
		setGameState("computerTurn");
		setCurrentTurn(1);
	};

	const computerTurn = (computer, setComputer, nextTurn) => {
		const updatedDeck = [...deck];
		let updatedHand = [...computer.hand];
		let newScore = calculateHandValue(updatedHand);

		while (newScore < 17) {
			const newCard = updatedDeck.pop();
			updatedHand.push(newCard);
			newScore = calculateHandValue(updatedHand);
		}

		setComputer({ hand: updatedHand, score: newScore });
		setDeck(updatedDeck);
		setCurrentTurn(nextTurn);
	};

	useEffect(() => {
		if (gameState === "computerTurn") {
			if (currentTurn === 1) {
				computerTurn(computer1, setComputer1, 2);
			} else if (currentTurn === 2) {
				computerTurn(computer2, setComputer2, 3);
			} else if (currentTurn === 3) {
				dealerTurn();
			}
		}
	}, [gameState, currentTurn]);

	const dealerTurn = () => {
		const updatedDeck = [...deck];
		let updatedHand = [...dealer.hand];
		let newScore = calculateHandValue(updatedHand);

		while (newScore < 17) {
			const newCard = updatedDeck.pop();
			updatedHand.push(newCard);
			newScore = calculateHandValue(updatedHand);
		}

		setDealer({ hand: updatedHand, score: newScore });
		setDeck(updatedDeck);
		setGameState("gameOver");
	};

	useEffect(() => {
		startNewRound();
	}, []);

	useEffect(() => {
		if (gameState === "gameOver" && !determined) {
			determineWinner();
		}
	}, [gameState, determined]);

	const determineWinner = () => {
		if (determined) return;
		setDetermined(true);

		const playerScore = player.score;
		const dealerScore = dealer.score;
		const computer1Score = computer1.score;
		const computer2Score = computer2.score;

		let updatedChips = user.numberOfChips;

		if (playerScore > 21) {
			// Player busts
			updatedChips -= 0;
		} else if (dealerScore > 21 || playerScore > dealerScore) {
			// Dealer busts or player has a higher score
			updatedChips += currentBet * 2;
		} else if (playerScore < dealerScore) {
			// Dealer wins
			updatedChips -= 0;
		} else {
			// Tie
			updatedChips += currentBet;
		}

		setUser((prevUser) => ({
			...prevUser,
			numberOfChips: updatedChips,
		}));
	};

	return (
		<div className="w-full h-full relative">
			{renderPlayers(gameState, player, computer1, computer2, dealer)}
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
				{gameState === "betting" && (
					<div className="mb-4">
						<p className="text-white mb-2">Your chips: {user.numberOfChips}</p>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={() => placeBet(10)}
						>
							Bet 10
						</button>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={() => placeBet(50)}
						>
							Bet 50
						</button>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => placeBet(100)}
						>
							Bet 100
						</button>
					</div>
				)}
				{gameState === "playerTurn" && (
					<div className="mb-4">
						<p className="text-white mb-2">Current bet: {currentBet}</p>
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={hit}
						>
							Hit
						</button>
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
							onClick={stand}
						>
							Stand
						</button>
					</div>
				)}
				{gameState === "gameOver" && (
					<div>
						<h3 className="text-xl font-semibold mb-2 text-white">
							{winnerMessage}
						</h3>
						<p className="text-white mb-2">Your chips: {user.numberOfChips}</p>
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

export default BlackjackGame;
