import React, { useState } from "react";
import axios from "axios";

const CreateTable = () => {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;
	const [createdBy, setCreatedBy] = useState("");
	const [numberOfPlayers, setNumberOfPlayers] = useState("");
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		// Define the payload for the POST request
		const payload = {
			createdBy, // This should be the player ID, assuming the player is already created
			numberOfPlayers,
		};

		try {
			const response = await axios.post(
				`${BACKEND_URL}/api/v1/user/signin`,
				payload
			);

			if (response.data.status === 200) {
				setSuccessMessage(response.data.message);
			} else {
				setError(response.data.message);
			}
		} catch (err) {
			setError("An error occurred while creating the table.");
		}
	};

	return (
		<div>
			<h2>Create Table</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="createdBy">Created By (Player ID):</label>
					<input
						type="text"
						id="createdBy"
						value={createdBy}
						onChange={(e) => setCreatedBy(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="numberOfPlayers">Number of Players:</label>
					<input
						type="text"
						id="numberOfPlayers"
						value={numberOfPlayers}
						onChange={(e) => setNumberOfPlayers(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Create Table</button>
			</form>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
		</div>
	);
};

export default CreateTable;
