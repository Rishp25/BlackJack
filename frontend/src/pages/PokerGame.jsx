import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast, Toaster } from "react-hot-toast";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = [
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
	"A",
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
	// Define the order of values including Ace as both high and low
	const valueOrder = "23456789TJQKA";
	const lowAceOrder = "A23456789TJQK"; // For sequences where Ace can be low
	const valueMap = {
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,
		T: 10,
		J: 11,
		Q: 12,
		K: 13,
		A: 14,
	};

	// Map the values to numeric ranks
	const values = hand.map((card) => valueMap[card.value]);
	const suits = hand.map((card) => card.suit);

	// Sort values for easier processing of straights and flushes
	values.sort((a, b) => a - b);

	// Check for flush
	const isFlush = new Set(suits).size === 1;

	// Check for straight
	// Convert values back to a string sequence for easy pattern matching
	const valuesString = values
		.map((val) => Object.keys(valueMap).find((key) => valueMap[key] === val))
		.join("");

	const isStraight =
		valueOrder.includes(valuesString) || lowAceOrder.includes(valuesString);

	// Count occurrences of each value
	const valueCounts = values.reduce((acc, val) => {
		acc[val] = (acc[val] || 0) + 1;
		return acc;
	}, {});

	// Get the counts sorted in descending order
	const counts = Object.values(valueCounts).sort((a, b) => b - a);

	// Determine hand rank based on poker rules
	if (isFlush && isStraight && values.includes(14) && values.includes(10))
		return 10; // Royal Flush
	if (isFlush && isStraight) return 9; // Straight Flush
	if (counts[0] === 4) return 8; // Four of a Kind
	if (counts[0] === 3 && counts[1] === 2) return 7; // Full House
	if (isFlush) return 6; // Flush
	if (isStraight) return 5; // Straight
	if (counts[0] === 3) return 4; // Three of a Kind
	if (counts[0] === 2 && counts[1] === 2) return 3; // Two Pair
	if (counts[0] === 2) return 2; // One Pair
	return 1; // High Card
};

const getHandName = (rank) => {
	switch (rank) {
		case 10:
			return "Royal Flush";
		case 9:
			return "Straight Flush";
		case 8:
			return "Four of a Kind";
		case 7:
			return "Full House";
		case 6:
			return "Flush";
		case 5:
			return "Straight";
		case 4:
			return "Three of a Kind";
		case 3:
			return "Two Pair";
		case 2:
			return "One Pair";
		default:
			return "High Card";
	}
};

const PokerGame = ({ renderPlayers }) => {
	const { user, setUser } = useContext(AppContext);
	const [deck, setDeck] = useState([]);
	const [player, setPlayer] = useState({ hand: [], bet: 0, folded: false });
	const [computer1, setComputer1] = useState({
		hand: [],
		bet: 0,
		folded: false,
	});
	const [computer2, setComputer2] = useState({
		hand: [],
		bet: 0,
		folded: false,
	});
	const [communityCards, setCommunityCards] = useState([]);
	const [pot, setPot] = useState(0);
	const [currentBet, setCurrentBet] = useState(0);
	const [currentPlayer, setCurrentPlayer] = useState("player");
	const [gameState, setGameState] = useState("betting");
	const [showdown, setShowdown] = useState(false);
	const [roundOver, setRoundOver] = useState(false);

	useEffect(() => {
		startNewRound();
	}, []);

	useEffect(() => {
		if (currentPlayer !== "player") {
			const timer = setTimeout(() => {
				computerAction(
					currentPlayer === "computer1" ? computer1 : computer2,
					currentPlayer === "computer1" ? setComputer1 : setComputer2
				);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [currentPlayer]);

	const startNewRound = () => {
		const newDeck = shuffleDeck(createDeck());
		setDeck(newDeck);
		setPlayer({ hand: [], bet: 0, folded: false });
		setComputer1({ hand: [], bet: 0, folded: false });
		setComputer2({ hand: [], bet: 0, folded: false });
		setCommunityCards([]);
		setPot(0);
		setCurrentBet(0);
		setCurrentPlayer("player");
		setGameState("betting");
		setShowdown(false);
		setRoundOver(false);
		dealInitialCards(newDeck);
	};

	const dealInitialCards = (newDeck) => {
		const playerHand = [newDeck.pop(), newDeck.pop()];
		const computer1Hand = [newDeck.pop(), newDeck.pop()];
		const computer2Hand = [newDeck.pop(), newDeck.pop()];

		setPlayer({ ...player, hand: playerHand });
		setComputer1({ ...computer1, hand: computer1Hand });
		setComputer2({ ...computer2, hand: computer2Hand });
		setDeck(newDeck);
	};

	const placeBet = (amount) => {
		if (amount <= user.numberOfChips) {
			setUser({ ...user, numberOfChips: user.numberOfChips - amount });
			setPlayer({ ...player, bet: player.bet + amount });
			setPot(pot + amount);
			setCurrentBet(Math.max(currentBet, amount));
			nextTurn();
		} else {
			toast.error("You don't have enough chips!");
		}
	};

	const fold = () => {
		setPlayer({ ...player, folded: true });
		nextTurn();
	};

	const nextTurn = () => {
		if (currentPlayer === "player") {
			setCurrentPlayer("computer1");
		} else if (currentPlayer === "computer1") {
			setCurrentPlayer("computer2");
		} else {
			if (gameState === "betting") {
				dealCommunityCards();
			} else if (gameState === "flop") {
				dealTurn();
			} else if (gameState === "turn") {
				dealRiver();
			} else {
				determineWinner();
			}
		}
	};

	const computerAction = (computer, setComputer) => {
		// Simple AI: 70% chance to call, 20% chance to raise, 10% chance to fold
		const action = Math.random();
		if (action < 0.7) {
			// Call
			const callAmount = currentBet - computer.bet;
			setComputer({ ...computer, bet: computer.bet + callAmount });
			setPot(pot + callAmount);
		} else if (action < 0.9) {
			// Raise
			const raiseAmount = currentBet + Math.floor(Math.random() * 50) + 10;
			setComputer({ ...computer, bet: computer.bet + raiseAmount });
			setPot(pot + raiseAmount);
			setCurrentBet(raiseAmount);
		}
		nextTurn();
	};

	const dealCommunityCards = () => {
		const flop = [deck.pop(), deck.pop(), deck.pop()];
		setCommunityCards(flop);
		setGameState("flop");
		setCurrentPlayer("player");
	};

	const dealTurn = () => {
		const turn = deck.pop();
		setCommunityCards([...communityCards, turn]);
		setGameState("turn");
		setCurrentPlayer("player");
	};

	const dealRiver = () => {
		const river = deck.pop();
		setCommunityCards([...communityCards, river]);
		setGameState("river");
		setCurrentPlayer("player");
	};

	const determineWinner = () => {
		setShowdown(true);
		const playerHand = [...player.hand, ...communityCards];
		const computer1Hand = [...computer1.hand, ...communityCards];
		const computer2Hand = [...computer2.hand, ...communityCards];

		const playerRank = player.folded ? -1 : getHandRank(playerHand);
		const computer1Rank = computer1.folded ? -1 : getHandRank(computer1Hand);
		const computer2Rank = computer2.folded ? -1 : getHandRank(computer2Hand);

		let winner, winningHand;

		if (computer1.folded && computer2.folded) {
			winner = "Player";
			winningHand = "Both computers folded";
			setUser({ ...user, numberOfChips: user.numberOfChips + pot });
		} else if (
			!player.folded &&
			playerRank > computer1Rank &&
			playerRank > computer2Rank
		) {
			winner = "Player";
			winningHand = getHandName(playerRank);
			setUser({ ...user, numberOfChips: user.numberOfChips + pot });
		} else if (
			!computer1.folded &&
			computer1Rank > playerRank &&
			computer1Rank > computer2Rank
		) {
			winner = "Computer 1";
			winningHand = getHandName(computer1Rank);
		} else if (
			!computer2.folded &&
			computer2Rank > playerRank &&
			computer2Rank > computer1Rank
		) {
			winner = "Computer 2";
			winningHand = getHandName(computer2Rank);
		} else if (
			!player.folded &&
			!computer1.folded &&
			!computer2.folded &&
			playerRank === computer1Rank &&
			playerRank === computer2Rank
		) {
			winner = "Tie";
			winningHand = "Equal hands";
			setUser({ ...user, numberOfChips: user.numberOfChips + pot / 3 });
		} else if (
			!player.folded &&
			!computer1.folded &&
			playerRank === computer1Rank &&
			(computer2.folded || playerRank > computer2Rank)
		) {
			winner = "Tie between Player and Computer 1";
			winningHand = getHandName(playerRank);
			setUser({ ...user, numberOfChips: user.numberOfChips + pot / 2 });
		} else if (
			!player.folded &&
			!computer2.folded &&
			playerRank === computer2Rank &&
			(computer1.folded || playerRank > computer1Rank)
		) {
			winner = "Tie between Player and Computer 2";
			winningHand = getHandName(playerRank);
			setUser({ ...user, numberOfChips: user.numberOfChips + pot / 2 });
		} else if (
			!computer1.folded &&
			!computer2.folded &&
			computer1Rank === computer2Rank &&
			(player.folded || computer1Rank > playerRank)
		) {
			winner = "Tie between Computer 1 and Computer 2";
			winningHand = getHandName(computer1Rank);
		} else {
			// This case should not happen, but we'll include it for completeness
			winner = "Undetermined";
			winningHand = "Error in hand comparison";
		}

		toast.success(`${winner} wins with ${winningHand}! Pot: ${pot} chips`);
		setRoundOver(true);
	};

	const renderCard = (card, isComputer) => {
		if (isComputer && !showdown) {
			return { value: "?", suit: "?" };
		}
		return card;
	};

	return (
		<div className="w-full h-full relative">
			{renderPlayers(
				gameState,
				{ ...player, hand: player.hand.map((card) => renderCard(card, false)) },
				{
					...computer1,
					hand: computer1.hand.map((card) => renderCard(card, true)),
				},
				{
					...computer2,
					hand: computer2.hand.map((card) => renderCard(card, true)),
				},
				communityCards.map((card) => renderCard(card, false)),
				showdown
			)}
			{/* Pot display */}
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<div className="bg-green-800 text-white p-2 rounded-full">
					<p className="font-bold">Pot: {pot}</p>
				</div>
			</div>
			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
				{currentPlayer === "player" && !player.folded && !roundOver && (
					<div className="mb-4">
						<p className="text-white mb-2">Your chips: {user.numberOfChips}</p>
						<p className="text-white mb-2">Current bet: {currentBet}</p>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={() => placeBet(currentBet - player.bet)}
						>
							Call
						</button>
						<button
							className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={() => placeBet(currentBet - player.bet + 20)}
						>
							Raise
						</button>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={fold}
						>
							Fold
						</button>
					</div>
				)}
				{roundOver && (
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => {
							startNewRound();
							window.location.reload();
						}}
					>
						New Round
					</button>
				)}
			</div>
			<Toaster />
		</div>
	);
};

export default PokerGame;
