import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
	const [user, setUser] = useState({
		name: "",
		numberOfChips: 1000, // Starting chips
	});
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("userName")) {
			setUser({
				...user,
				name: localStorage.getItem("userName"),
			});
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
				loggedIn,
				setLoggedIn,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
