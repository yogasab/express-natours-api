import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
	try {
		const response = await axios.post(
			"http://127.0.0.1:5000/api/v1/auth/signin",
			{
				email,
				password,
			}
		);
		if (response.data.status === "Success") {
			showAlert("success", "Login successfull");
			setTimeout(() => {
				window.location = "/";
			}, 1500);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
