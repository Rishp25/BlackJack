import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		numberOfChips: 1000, // Starting chips
	});

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
