import React, { useState, useEffect } from "react";
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

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [postCode, setPostCode] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVal, setPasswordVal] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [emailOk, setEmailok] = useState(false);
	const [passOk, setPassok] = useState(false);
	const [allGood, setAllGood] = useState(false);

  
	const passCheck = () => {
		if (
			password !== passwordVal ||
			password === null ||
			password !== passwordVal ||
			passwordVal === null
		) {
			setPasswordError(true);
		} else {
			setPassok(true);
			setPasswordError(false);
		}
	};

	const emailCheck = () => {
		if (EMAIL_REGEX.test(email)) {
			setEmailok(true);
			setEmailError(false);
		} else {
			setEmailError(true);
		}
  };
  
  const isAllGood = () => {
    if (emailOk === true && passOk === true) {
      setAllGood(true);
    }
  };

	//on press check if email is valid email structure and if both passwords match
  const handleSignUp = () => {
    passCheck(),
    emailCheck(),
    isAllGood();
    if (allGood === true) {
    fetch('https://dog-in-town-backend.vercel.app/users/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, email: email, password: password, postCode: postCode  }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log(data)
          
            navigation.navigate("DogSignUp");
          }
        })
      };
  }

		

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
					value={email}
					style={styles.input}
				/>
				<TextInput
					placeholder="Mot de passe"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					onChangeText={(value) => setPassword(value)}
					value={password}
					style={styles.input}
				/>
				<TextInput
					placeholder="Validation mot de passe"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					onChangeText={(value) => setPasswordVal(value)}
					value={passwordVal}
					style={styles.input}
        />
        <TextInput
					placeholder="Code postal"
					onChangeText={(value) => setPostCode(value)}
					value={postCode}
					style={styles.input}
				/>
				{emailError && <Text style={styles.error}>Invalid email address</Text>}
				{passwordError && (
					<Text style={styles.error}>Passwords don't match</Text>
        )}
        
			</View>
			<TouchableOpacity
				onPress={() => {
				handleSignUp()
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
