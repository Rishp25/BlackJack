import axios from "axios";
import "./App.css";

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
			<button onClick={sendRequest}>click</button>
		</>
	);
}

export default App;
