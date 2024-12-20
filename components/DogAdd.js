import { StatusBar } from "expo-status-bar";
import { CameraView, Camera } from "expo-camera";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Platform,
	KeyboardAvoidingView,
	Image,
	Pressable,
	Modal,
	SafeAreaView,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../reducers/user";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
// imagepicker expo pour telechargement photos depuis téléphone
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // pour convertir le fichier en format adapté pour Cloudinary
import { useFonts } from 'expo-font'; // FONT


const DOG_SIZE_S = "petit";
const DOG_SIZE_M = "moyen";
const DOG_SIZE_L = "grand";



export const DogAdd = ( {added} ) => {
	// export de la font
	useFonts({
		"LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
		"LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
		"LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
		"LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
		});
		
	// DropDown Picker
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [raceList, setRaceList] = useState([
		{ label: 'Akita Inu', value: 'Akita Inu' },
		{ label: 'Basset Hound', value: 'Basset Hound' },
		{ label: 'Basenji', value: 'Basenji' },
		{ label: 'Beagle', value: 'Beagle' },
		{ label: 'Berger Allemand', value: 'Berger Allemand' },
		{ label: 'Berger Australien', value: 'Berger Australien' },
		{ label: 'Berger Belge Malinois', value: 'Berger Belge Malinois' },
		{ label: 'Berger des Shetland', value: 'Berger des Shetland' },
		{ label: 'Bichon Frisé', value: 'Bichon Frisé' },
		{ label: 'Bouledogue Anglais', value: 'Bouledogue Anglais' },
		{ label: 'Bouledogue Français', value: 'Bouledogue Français' },
		{ label: 'Boxer', value: 'Boxer' },
		{ label: 'Cairn Terrier', value: 'Cairn Terrier' },
		{ label: 'Caniche', value: 'Caniche' },
		{ label: 'Cavalier King Charles', value: 'Cavalier King Charles' },
		{ label: 'Chihuahua', value: 'Chihuahua' },
		{ label: 'Chow-Chow', value: 'Chow-Chow' },
		{ label: 'Colley à poil long', value: 'Colley à poil long' },
		{ label: 'Cocker Spaniel Anglais', value: 'Cocker Spaniel Anglais' },
		{ label: 'Dalmatien', value: 'Dalmatien' },
		{ label: 'Dobermann', value: 'Dobermann' },
		{ label: 'Dogue Allemand', value: 'Dogue Allemand' },
		{ label: 'Epagneul Breton', value: 'Epagneul Breton' },
		{ label: 'Epagneul Japonais', value: 'Epagneul Japonais' },
		{ label: 'Epagneul Papillon', value: 'Epagneul Papillon' },
		{ label: 'Fox Terrier', value: 'Fox Terrier' },
		{ label: 'Golden Retriever', value: 'Golden Retriever' },
		{ label: 'Grand Caniche', value: 'Grand Caniche' },
		{ label: 'Griffon Bruxellois', value: 'Griffon Bruxellois' },
		{ label: 'Hovawart', value: 'Hovawart' },
		{ label: 'Husky Sibérien', value: 'Husky Sibérien' },
		{ label: 'Jack Russell Terrier', value: 'Jack Russell Terrier' },
		{ label: 'Kangal', value: 'Kangal' },
		{ label: 'Labrador Retriever', value: 'Labrador Retriever' },
		{ label: 'Lévrier Afghan', value: 'Lévrier Afghan' },
		{ label: 'Mastiff', value: 'Mastiff' },
		{ label: 'Petit Lévrier Italien', value: 'Petit Lévrier Italien' },
		{ label: 'Pinscher Nain', value: 'Pinscher Nain' },
		{ label: 'Rottweiler', value: 'Rottweiler' },
		{ label: 'Saint-Bernard', value: 'Saint-Bernard' },
		{ label: 'Samoyède', value: 'Samoyède' },
		{ label: 'Schipperke', value: 'Schipperke' },
		{ label: 'Setter Irlandais', value: 'Setter Irlandais' },
		{ label: 'Shar Pei', value: 'Shar Pei' },
		{ label: 'Shiba Inu', value: 'Shiba Inu' },
		{ label: 'Shih Tzu', value: 'Shih Tzu' },
		{ label: 'Spitz Nain', value: 'Spitz Nain' },
		{ label: 'Teckel', value: 'Teckel' },
		{ label: 'Terre-Neuve', value: 'Terre-Neuve' },
		{ label: 'West Highland White Terrier', value: 'West Highland White Terrier' },
		{ label: 'Whippet', value: 'Whippet' },
		{ label: 'Yorkshire Terrier', value: 'Yorkshire Terrier' }
	  ]);

	// LOADER CHECK
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));

	// Etat image pour affichage écran
	const [image, setImage] = useState(null);

	const photo = "photo.png";
	// Reference to the camera
	const cameraRef = useRef(null);
	const isFocused = useIsFocused();

	// Permission hooks
	const [hasPermission, setHasPermission] = useState(false);
	const [facing, setFacing] = useState("back");
	const [flashStatus, setFlashStatus] = useState(false);
	const [isImageUploading, setIsImageUploading] = useState(false);

	const handlePhoto = () => {
		setModalIsVisible(true);
	};

	// Functions to toggle camera facing and flash status
	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"));
	};

	const toggleFlashStatus = () => {
		setFlashStatus((current) => (current === false ? true : false));
	};

	// Function to take a picture and save it to the reducer store
	const takePicture = async () => {
		setIsImageUploading(true);

		const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
		console.log("Photo:", photo);

		if (!photo?.uri) {
			console.error("No photo URI available");
			setIsImageUploading(false);
			return;
		}

		const formData = new FormData();
		formData.append("photoFromFront", {
			uri: photo.uri,
			name: "photo.jpg",
			type: "image/jpeg",
		});

		try {
			fetch("https://dog-in-town-backend.vercel.app/users/upload", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Response Data:", data);
					if (data.result) {
						setImage(data.url);
					} else {
						console.error("Upload failed:", data.error);
					}
				})
				.catch((error) => {
					console.error("An error occurred:", error);
				});
		} catch (error) {
			console.error("Unexpected error:", error);
		} finally {
			setIsImageUploading(false);
			setModalIsVisible(false);
		}
	};

	const [dogName, setDogName] = useState("");
	const [dogSize, setDogSize] = useState("");
	const [selectedRace, setSelectedRace] = useState();
	const [modalIsVisible, setModalIsVisible] = useState(false);

	//REDUCER
	const user = useSelector((state) => state.user.value);
	const userToken = user.token;
	const dispatch = useDispatch();

	//PICKER telechargement d'images depuis téléphone ***********************************************
	const pickImage = async () => {
		setIsImageUploading(true);

		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.3,
		});

		if (!result.canceled) {
			const imageUri = result.assets[0].uri;
			setImage(imageUri); // On enregistre l'URI dans l'état

			// Conversion de l'image en base64, uniquement si l'URI est valide
			try {
				if (imageUri) {
					const fileInfo = await FileSystem.readAsStringAsync(imageUri, {
						encoding: FileSystem.EncodingType.Base64,
					});

					const formData = new FormData();
					formData.append("photoFromFront", {
						uri: imageUri, // Utilisation de l'URI de l'image
						name: "photo.jpg", // Le nom du fichier
						type: "image/jpeg", // Le type MIME du fichier
						base64: fileInfo, // Ajout du fichier encodé en base64
					});

					fetch("https://dog-in-town-backend.vercel.app/users/upload", {
						method: "POST",
						body: formData,
					})
						.then((response) => response.json())
						.then((data) => {
							console.log("Response Data:", data);
							if (data.result) {
								console.log("Data URL:", data.url);
								setImage(data.url); // Mise à jour de l'URL de l'image après l'upload
							} else {
								console.error("Upload failed:", data.error);
							}
						})
						.catch((error) => {
							console.error("An error occurred:", error);
						});
				} else {
					console.error("No valid image URI provided");
				}
			} catch (error) {
				console.error("Unexpected error:", error);
			} finally {
				setIsImageUploading(false);
			}
		} else {
			setIsImageUploading(false);
		}
	};

	// Fonction pour naviguer vers le Tab menu
	const handleDogSignup = async (dogRegister) => {
		if (!dogRegister) {
			return;
		}

		await fetch(`https://dog-in-town-backend.vercel.app/users/dog`, {
		// await fetch(`http://192.168.1.60:3000/users/dog`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userToken: user.token,
				name: dogName,
				race: selectedRace,
				photo: image,
				size: dogSize,
			}),
		});
		setIsLoading(true);
		await delay(1500);
		setIsLoading(false);
		setModalIsVisible(false)
    
	};

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
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 30 : 0 }}>
				<View style={styles.upperContent}>
					<Modal
						animationType="fade"
						transparent={true}
						visible={modalIsVisible}
						onRequestClose={() => {
							setModalIsVisible(!modalIsVisible);
						}}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<CameraView
									style={styles.camera}
									facing={facing}
									enableTorch={flashStatus}
									ref={(ref) => (cameraRef.current = ref)}
								>
									<SafeAreaView style={styles.settingContainer}>
										<TouchableOpacity
											style={styles.settingButton}
											onPress={toggleFlashStatus}
										>
											<FontAwesome
												name="flash"
												size={25}
												color={flashStatus === true ? "#e8be4b" : "white"}
											/>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.settingButton}
											onPress={toggleCameraFacing}
										>
											<FontAwesome
												name="rotate-right"
												size={25}
												color="white"
											/>
										</TouchableOpacity>
									</SafeAreaView>
								</CameraView>
								{/* Bottom container with the snap button */}
								<View style={styles.snapContainer}>
									<View style={styles.espace}></View>
									<TouchableOpacity
										style={styles.snapButton}
										onPress={takePicture}
									>
										<FontAwesome name="circle-thin" size={80} color="gray" />
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.closeModal}
										onPress={() => setModalIsVisible(false)}
									>
										<FontAwesome
											name="times"
											size={35}
											color="gray"
											opacity={0.8}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				</View>
				<View style={styles.dogsInfo}>
					<View style={styles.textInputContainer} elevation={5}>
						<TextInput
							style={styles.textInput}
							placeholder="Nom"
							onChangeText={(value) => setDogName(value.trim())}
							value={dogName}
						/>
					</View>
					<View style={styles.pickerContainer}>
						<DropDownPicker
							style={styles.picker}
							open={open}
							value={value}
							items={raceList}
							setOpen={setOpen}
							setValue={setValue}
							onChangeValue={(value) => {
								setSelectedRace(value);
							}}
							textStyle={{
								fontSize: 18,
							}}
							setItems={setRaceList}
							placeholder={"Race"}
						/>
					</View>
				</View>
				<View style={styles.dogSize}>
					<View style={styles.sizeTextContainer}>
						<Text style={styles.dogSizeText}>Taille:</Text>
					</View>
					<View style={styles.dogSizeCardContainer}>
						<Pressable
							style={styles.dogSizeCard}
							onPress={() => setDogSize(DOG_SIZE_S)}
						>
							<View style={styles.dogSizeCard}>
								<Image
									style={{
										maxHeight: 40,
										marginTop: 8,
										maxWidth: 40,
										tintColor: dogSize === DOG_SIZE_S ? "#F1AF5A" : "#5B1A10",
									}}
									source={require("../assets/Images/petit.png")}
								/>
								<Text>Petit</Text>
							</View>
						</Pressable>
						<Pressable
							style={styles.dogSizeCard}
							onPress={() => setDogSize(DOG_SIZE_M)}
						>
							<View style={styles.dogSizeCard}>
								<Image
									style={{
										maxHeight: 50,
										maxWidth: 50,
										tintColor: dogSize === DOG_SIZE_M ? "#F1AF5A" : "#5B1A10",
										transform: [{ scaleX: -1 }],
									}}
									source={require("../assets/Images/moyen.png")}
								/>
								<Text>Moyen</Text>
							</View>
						</Pressable>
						<Pressable
							style={styles.dogSizeCard}
							onPress={() => setDogSize(DOG_SIZE_L)}
						>
							<View style={styles.dogSizeCard}>
								<Image
									style={{
										maxHeight: 100,
										maxWidth: 100,
										tintColor: dogSize === DOG_SIZE_L ? "#F1AF5A" : "#5B1A10",
									}}
									source={require("../assets/Images/grand.png")}
								/>
								<Text>Grand</Text>
							</View>
						</Pressable>
					</View>
				</View>
				<View style={styles.dogPicture}>
					<Text style={styles.dogPictureText}>
						Souhaitez-vous rajouter sa photo ?
					</Text>
					<View style={styles.pictureConteneur}>
						<TouchableOpacity onPress={() => handlePhoto()}>
							<FontAwesome name="camera" size={38} color="#A23D42" />
						</TouchableOpacity>
						<Image style={styles.avatar} source={{ uri: image }} />
						<TouchableOpacity onPress={pickImage}>
							<FontAwesome name="download" size={40} color="#A23D42" />
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPressIn={() => handleDogSignup(true)}
						onPressOut={added}
					>
						{isLoading ? (
							<ActivityIndicator style={{ size: "large", color: "#F1AF5A" }} />
						) : (
							<Text style={styles.clickableBtn}>Ajouter</Text>
						)}
					</TouchableOpacity>
				</View>
				<StatusBar style="auto" />
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
  upperContent: {
    marginTop:'10%',
		width: "100%",
	},
	leaveContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	textContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "end",
		width: "100%",
		marginRight: "1%",
	},
	titleContainer: {
		width: "100%",
	},
	title: {
		fontSize: 25,
		color: "#5B1A10",
		textAlign: "center",
		lineHeight: 28,
		marginLeft: "2%",
		marginRight: "2%",
		marginTop: "2%",
	},
	dogsInfo: {
		width: "100%",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingVertical: 20,
	},
	textInputContainer: {
		width: "80%",
		height: 60,
		borderWidth: 1,
		backgroundColor: "#F5F5F5",
		borderRadius: 12,
		marginBottom: 20,
	},
	textInput: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
		fontSize: 18,
		paddingHorizontal: 15,
	},
	pickerContainer: {
		width: "80%",
		height: 60,
		justifyContent: "center",
		borderRadius: 12,
	},
	picker: {
		width: "100%",
		height: 60,
		borderRadius: 12,
		fontSize: 18,
		backgroundColor: "#F5F5F5",
	},
	dogSize: {
		height: "15%",
		marginLeft: "2%",
		marginRight: "2%",
	},
	dogSizeText: {
		marginLeft: 8,
		fontSize: 20,
		color: "#5B1A10",
	},
  dogPicture: {
		padding: "4%",
		height: "50%",
		alignItems: "center",
		justifyContent: "space-around",
		marginTop: "10%",
	},
	sizeTextContainer: {
		height: 50,
		width: "100%",
		backgroundColor: "puprle",
	},
	dogSizeCardContainer: {
		height: "40%",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-evenly",
		flexDirection: "row",
	},
	dogSizeCard: {
		alignItems: "center",
	},
	dogPictureText: {
		fontSize: 20,
		color: "#5B1A10",
		marginBottom: "2%",
	},
	clickableBtn: {
		color: "#fff",
		fontWeight: 700,
		fontSize: 20,
	},
	buttonText: {
		textAlign: "center",
		fontSize: 20,
		color: "white",
		fontWeight: 700,
	},
	leaveText: {
		color: "#5B1A10",
		fontSize: 18,
		// fontWeight: 600,
	},
	// bouton ajouter photo
	pictureConteneur: {
		height: "15%",
		width: "80%",
		alignItems: "center",
		justifyContent: "center",
		gap: 20,
		flex: 1,
		flexDirection: "row",
		marginBottom: "2%",
	},
	avatar: {
		height: 130,
		width: 130,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: "#A23D42",
		backgroundColor: "white",
	},
	option: {
		alignSelf: "left",
		color: "#525252",
		marginLeft: "12%",
	},
	// MODAL STYLE
	centeredView: {
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		paddingBottom: 25,
		borderColor: "rgba(255, 255, 255, 1)",
		borderRadius: 20,
		height: "70%",
		width: "90%",
		alignItems: "center",
		justifyContent: "space-between",
		shadowColor: "#000",
		overflow: "hidden",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		flex: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#A23D42",
		width: "90%",
		height: 50,
		borderRadius: 20,
		shadowColor: "black",
		shadowOpacity: 0.4,
		elevation: 2,
		shadowRadius: 1,
		shadowOffset: { width: 1, height: 4 },
		borderWidth: 0,
	},
	// Camera
	camera: {
		width: "120%",
		height: "85%",
		aspectRatio: 1 / 1,
		paddingTop: 5,
		justifyContent: "space-between",
		overflow: "hidden",
	},
	settingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: "15%",
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
		aspectRatio: 1 / 1,
		alignItems: "center",
		justifyContent: "center",
		opacity: 0.8,
	},
	espace: {
		width: "10%",
	},
});

export default DogAdd;
