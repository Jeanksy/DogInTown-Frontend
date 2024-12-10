import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	KeyboardAvoidingView,
	TextInput,
} from "react-native";

// Regex email only for input email
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const POST_CODE_REGEX = /^[0-9]{5}$/;

//To set password with different status/values
const PASSWORD_UNSET = -1;
const PASSWORD_EMPTY = 0;
const PASSWORD_MISMATCH = 1;
const PASSWORD_MATCH = 2;

export default function SignUpScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [username, setUserName] = useState("");
	const [postCode, setPostCode] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVal, setPasswordVal] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [postCodeError, setPostCodeError] = useState(false);
	const [passwordStatus, setpasswordStatus] = useState(PASSWORD_UNSET);


	// check if passwords are empty, doesn't match or match
	const passwordCheck = () => {
		if (password === "" || passwordVal === "") {
			setpasswordStatus(PASSWORD_EMPTY);
		} else if (password !== passwordVal) {
			setpasswordStatus(PASSWORD_MISMATCH);
		} else {
			setpasswordStatus(PASSWORD_MATCH);
		}
	};

	//check if postCode is 5 digits
	const postCodeCheck = () => {
		setPostCodeError(!POST_CODE_REGEX.test(postCode));
	};

	//check is email format is valid
	const emailCheck = () => {
		setEmailError(!EMAIL_REGEX.test(email));
	};

	// check if all conditions above are validated
	const isFormValid = () => {
		passwordCheck();
		emailCheck();
		postCodeCheck();
		return emailError === false && passwordStatus === PASSWORD_MATCH && postCodeError === false;
	};

	//on press check if email is valid email structure, if both passwords match and post code is valid
	const handleSignUp = () => {
		if (isFormValid()) {
			fetch("http://192.168.1.60:3000/users/inscription", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					email: email,
					password: password,
					postCode: postCode,
				}),
			})
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					console.log(data);
					navigation.navigate("DogSignUp");
				}
			});
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container}>
			<Text style={styles.head}>Inscrivez-vous</Text>
			<View style={styles.connexionCont}>
				<TextInput
					placeholder="Username"
					onChangeText={(value) => setUserName(value)}
					value={username}
					style={styles.input}
				/>
				<TextInput
					placeholder="Email"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					keyboardType="email-address" // https://reactnative.dev/docs/textinput#keyboardtype
					textContentType="emailAddress" // https://reactnative.dev/docs/textinput#textcontenttype-ios
					autoComplete="email" // https://reactnative.dev/docs/textinput#autocomplete-android
					onChangeText={(value) => setEmail(value)}
					onBlur={() => emailCheck()}
					value={email}
					style={styles.input}
				/>
				<TextInput
					placeholder="Mot de passe"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					onChangeText={(value) => setPassword(value)}
					onBlur={() => passwordCheck()}
					value={password}
					style={styles.input}
				/>
				<TextInput
					placeholder="Validation mot de passe"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					onChangeText={(value) => setPasswordVal(value)}
					onBlur={() => passwordCheck()}
					value={passwordVal}
					style={styles.input}
				/>
				<TextInput
					placeholder="Code postal"
					onChangeText={(value) => setPostCode(value)}
					onBlur={() => postCodeCheck()}
					value={postCode}
					style={styles.input}
				/>
				{emailError && <Text style={styles.error}>Invalid email address</Text>}
				{passwordStatus === PASSWORD_MISMATCH && (
					<Text style={styles.error}>Passwords don't match</Text>
				)}
				{passwordStatus === PASSWORD_EMPTY && (
					<Text style={styles.error}>Passwords required</Text>
				)}
				{postCodeError && <Text style={styles.error}>Invalid postal code</Text>}
			</View>
			<TouchableOpacity
				onPress={() => {
					handleSignUp();
				}}
				style={styles.signUpBtn}
				activeOpacity={0.8}
			>
				<Text style={styles.clickableBtn}>Let's Go !</Text>
			</TouchableOpacity>
			<StatusBar style="auto" />
		</KeyboardAvoidingView>
	);
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#97C7DE",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	head: {
		color: "#fff",
		fontSize: 40,
	},
	connexionCont: {
		marginTop: "-15%",
		flex: 0,
		gap: 10,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	clickableBtn: {
		color: "#fff",
		fontWeight: 700,
		fontSize: 20,
	},
	title: {
		fontSize: 40,
		fontWeight: "600",
		fontFamily: "Futura",
		marginBottom: 20,
	},
	input: {
		color: "#000",
		flex: 0,
		textAlign: "center",
		width: "80%",
		backgroundColor: "#fff",
		height: 50,
		borderRadius: 20,
		fontSize: 16,
	},
	signInBtn: {
		flex: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#A23D42",
		width: "80%",
		height: 50,
		borderRadius: 20,
		shadowColor: "black",
		shadowOpacity: 0.4,
		elevation: 1,
		shadowRadius: 1,
		shadowOffset: { width: 1, height: 4 },
		borderWidth: 0,
	},
	signUpBtn: {
		flex: 0,
		flexDirection: "row",
		marginTop: "-15%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#A23D42",
		width: "80%",
		height: 50,
		borderRadius: 20,
		shadowColor: "black",
		shadowOpacity: 0.4,
		elevation: 1,
		shadowRadius: 1,
		shadowOffset: { width: 1, height: 4 },
		borderWidth: 0,
	},
	textButton: {
		fontFamily: "Futura",
		height: 30,
		fontWeight: "600",
		fontSize: 16,
	},
	error: {
		marginTop: 10,
		color: "red",
	},
});
