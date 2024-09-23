import axios from "axios";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import CreateTable from "./pages/CreateTable";
import Table from "./pages/Table";
import { Toaster } from "react-hot-toast";

function App() {
	const BACKEND_URL = import.meta.env.VITE_DATABASE_URL;

	async function sendRequest() {
		try {
			const res = await axios.get(`${BACKEND_URL}/api/v1/hello`);
			if (res) {
				alert(res.data.message);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/signin" element={<Signin />} />
					<Route path="/createTable" element={<CreateTable />} />
					<Route path="/play" element={<Table />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
