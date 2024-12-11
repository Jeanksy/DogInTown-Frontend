import { useState, useEffect, useRef } from 'react';
import { CameraView, Camera } from 'expo-camera';
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { login, addPhoto } from '../reducers/user';
import { StatusBar } from "expo-status-bar";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	KeyboardAvoidingView,
	TextInput,
	Image,
	Modal,
	SafeAreaView,
} from "react-native";
// picker pour telechargement photos depuis téléphone
import * as ImagePicker from 'expo-image-picker';


cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
  });

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

//////CAMERA///////
const photo = 'photo.png';
// Reference to the camera
const cameraRef = useRef(null);
const isFocused = useIsFocused();

  // Permission hooks Camera
const [hasPermission, setHasPermission] = useState(false);
const [facing, setFacing] = useState("front");
const [flashStatus, setFlashStatus] = useState(false);
// Modal ouverture photo
const [modalIsVisible, setModalIsVisible] = useState(false);


const handlePhoto = () => {
    setModalIsVisible(true)

};

  // Functions to toggle camera facing and flash status
const toggleCameraFacing = () => {
	setFacing((current) => (current === "front" ? "back" : "front"));
};

const toggleFlashStatus = () => {
	setFlashStatus((current) => (current === false ? true : false));
};

// Function to take a picture and save it to the reducer store
	const takePicture = async () => {
		const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5 });
		(photo)
		const formData = new FormData();
		const uri = photo?.uri;
		setImage(uri);

		formData.append("photoFromFront", {
			uri: uri,
			name: "photo.jpg",
			type: "image/jpg",
		});

		fetch('https://dog-in-town-backend.vercel.app/users/upload', {
			method: "POST",
			body: formData,
		}).then((response) => response.json())
			.then((data) => {
				console.log(data.url)
				data.result && dispatch(addPhoto(data.url));
			});
		setModalIsVisible(false)
	
	};

	// REDUCER
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	//PICKER telechargement d'images depuis téléphone
	const [image, setImage] = useState(null);
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
	
		console.log(result);
	
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

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
			fetch("https://dog-in-town-backend.vercel.app/users/inscription", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					email: email,
					password: password,
					avatar: image,
					postCode: postCode,
				}),
			})
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					navigation.navigate("DogSignUp");
					dispatch(login({username: username, token: data.token}));
				}
			});
		}
	};

// Hook pour prise de photo
useEffect(() => {
		(async () => {
			const result = await Camera.requestCameraPermissionsAsync();
			setHasPermission(result && result?.status === "granted");
		})();
	    }, []);
// Conditions to prevent more than 1 camera component to run in the bg
		if (!hasPermission || !isFocused) {
		return <View />;
		}

	return (
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.connexionCont}>
			<Modal
			animationType="fade"
			transparent={true}
			visible={modalIsVisible}
			onRequestClose={() => {
				setModalIsVisible(!modalIsVisible);
				}}>
            	<View style={styles.centeredView}>
                	<View style={styles.modalView}>
                    	<CameraView style={styles.camera} facing={facing} enableTorch={flashStatus} ref={(ref) => (cameraRef.current = ref)}>
	                   	<SafeAreaView style={styles.settingContainer}>
	                   		<TouchableOpacity style={styles.settingButton} onPress={toggleFlashStatus}>
	                   			<FontAwesome name="flash" size={25} color={flashStatus === true ? "#e8be4b" : "white"} />
	                   		</TouchableOpacity>
	                   		<TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
	                   			<FontAwesome name="rotate-right" size={25} color="white" />
	                   		</TouchableOpacity>
	                   	</SafeAreaView>
	                   </CameraView>
					    {/* Bottom container with the snap button */}
						<View style={styles.snapContainer}>
							<View style={styles.espace}></View>
								<TouchableOpacity style={styles.snapButton} onPress={takePicture}>
									<FontAwesome name="circle-thin" size={80} color="gray" />
								</TouchableOpacity>
								<TouchableOpacity style={styles.closeModal} onPress={() => setModalIsVisible(false)}>
								<FontAwesome name='times' size={35} color="gray"  opacity={0.8}/>
								</TouchableOpacity>
					    	</View>
                    </View>
                </View>
        	</Modal>
				<Text style={styles.head}>Inscrivez-vous</Text>
				<TextInput
					placeholder="Username"
					autoFocus = {true}
					onChangeText={(value) => setUserName(value.trim())}
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
					secureTextEntry={true}
					textContentType="oneTimeCode"
					placeholder="Mot de passe"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					onChangeText={(value) => setPassword(value)}
					onBlur={() => passwordCheck()}
					value={password}
					style={styles.input}
				/>
				<TextInput
					secureTextEntry={true}
					textContentType="oneTimeCode"
					placeholder="Validation mot de passe"
					autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
					onChangeText={(value) => setPasswordVal(value)}
					onBlur={() => passwordCheck()}
					value={passwordVal}
					style={styles.input}
				/>
				<TextInput
					placeholder="Code postal"
					maxLength={5}
					keyboardType="numeric"
					returnKeyType="done"
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
			<View style={styles.pictureConteneur}>
				<TouchableOpacity onPress={() => handlePhoto()}>
					<FontAwesome name='camera' size={38} color='#A23D42' />
				</TouchableOpacity>
 				<Image style={styles.avatar} source={{uri : image}}/>
				<TouchableOpacity onPress={pickImage}>
					<FontAwesome name='download' size={40} color='#A23D42'/>
				</TouchableOpacity>
			</View>
			<Text style={styles.option}>(photo optionnelle)</Text>
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


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#97C7DE",
		alignItems: "center",
		justifyContent: 'center',
	},
	head: {
		color: "#fff",
		fontSize: 40,
		marginBottom: '2%',
	},
	connexionCont: {
		flex: 4,
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
		marginBottom: '10%',
		marginTop: '5%',
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
// bouton ajouter photo
	pictureConteneur: {
		height: '15%',
		width: '80%',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 20,
		flex: 1,
		flexDirection: 'row',
		marginBottom: '2%',
	},
	avatar: {
		height: 130,
		width: 130,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 3,
		borderColor: '#A23D42',
		backgroundColor: 'white',
	},
	option: {
		alignSelf: 'left',
		color: '#525252',
		marginLeft: '12%',
		
	},
 // MODAL STYLE
	centeredView: {
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		paddingBottom: 25,
		borderColor: 'rgba(255, 255, 255, 1)',
		borderRadius: 20,
		height: '70%',
		width: '90%',
		alignItems: 'center',
		justifyContent: 'space-between',
		shadowColor: '#000',
		overflow: 'hidden',
		shadowOffset: {
		width: 0,
		height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 10,
		padding: 10,
		elevation: 2,
		width: '100%',
		backgroundColor: '#e66351'
	},
	// Camera 
	camera: {
		width: '120%',
		height: '85%',
		aspectRatio: 1 / 1,
		paddingTop: 5,
		justifyContent: "space-between",
		overflow: 'hidden',
		},
		settingContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginHorizontal: '15%',
		},
		settingButton: {
			width: 40,
			aspectRatio: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		snapContainer: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 20,
			gap: 60,
		},
		snapButton: {
			width: 100,
			aspectRatio: 1 /1,
			alignItems: "center",
			justifyContent: 'center',
			opacity: 0.8,
		},
		espace: {
			width: '10%',
		}
});
