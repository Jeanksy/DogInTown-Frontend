import { StatusBar } from "expo-status-bar";
import {
	Image,
	StyleSheet,
	Text,
	View,
	Platform,
	SafeAreaView,
	KeyboardAvoidingView,
	TouchableOpacity,
	Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { login, AddPhotoChien } from "../reducers/user";
import { upDateUser } from "../reducers/user";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { CarouselDog } from "../components/CarouselDog";
import { DogAdd } from "../components/DogAdd";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from "react-native-reanimated";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ModalAdd} from '../components/ModalAdd'

// This is the default configuration
configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false, // Reanimated runs in strict mode by default
});


export default function DogsInfoScreen() {
	const user = useSelector((state) => state.user.value);
	const navigation = useNavigation();
	const [nombreDoggies, setNombreDoggies] = useState("");
	const [mainDog, setMainDog] = useState({});
	const [doggies, setDoggies] = useState([]);
	const [update, setUpdate] = useState(0);
	// Etat de la modal
		const [addModalIsVisible, setAddModalIsVisible] = useState(false);

	// LOADER CHECK
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));

	const handleAdd = async () => {
		setAddModalIsVisible(true);

	}

	const handleCloseModal = () => {
		setAddModalIsVisible(false)
		setUpdate((previousUpdate) => previousUpdate + 1 );
	}

	
	const handleDogPress = (key) => {
		setMainDog(doggies[key]);
	};

	const updateDoggies = () => {
		setUpdate((previousUpdate) => previousUpdate + 1 );

	}

	// JE SAIS PLUS A QUOI OU SI CA SERT ENCORE VVVVV
	useEffect(() => {
		console.log("Updated Main Dog:", mainDog);
	}, [mainDog]);

	const handleRetour = () => {
		navigation.navigate("TabNavigator", { screen: "Options" });
	};

	useEffect(() => {
		fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`)    //  <<<<< Token dynamique
			.then((response) => response.json())
			.then( (data) => {
				if (data) {
					setDoggies(data.dogs);
				}
			});
	}, [update]);

	// affiche un text différent dans le JSX selon le nombre de chiens
	useEffect(() => {
		if (doggies.length === 1) {
			setNombreDoggies(<Text style={styles.dogsTitle}>Mon chien</Text>);
		} else if (doggies.length >= 2) {
			setNombreDoggies(<Text style={styles.dogsTitle}>Mes chiens</Text>);
		} else {
			setNombreDoggies(<Text style={styles.dogsTitle}>Ajouter un chien</Text>);
		}
	}, [doggies]);

	return (
		<GestureHandlerRootView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<SafeAreaView style={styles.safeArea}>
			<View style={{ width: "100%", height: "100%", position: "absolute"}}>
				<ModalAdd visible={addModalIsVisible} onClose={() => handleCloseModal()} >
				</ModalAdd>	
			</View>
				<View style={styles.retourContainer}>
					<TouchableOpacity
						style={styles.retourBtn}
						onPress={() => handleRetour()}
					>
						<Text style={{ fontSize: 17, fontWeight: 700 }}>Retour</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.mainContainer}>
					<View>{nombreDoggies}</View>
					<View style={styles.dogListCont}>
						{doggies && doggies.length > 0 ? (
							doggies.map((dog, index) => (
								<View key={dog.id} style={{ alignItems: "center", gap: "5%" }}>
									<TouchableOpacity
										key={`tO${dog.id}`}
										style={[styles.dogListCircle, styles.shadow]}
										onPress={() => handleDogPress(index)}
									>
										<Image
											key={`img${dog.id}`}
											style={{ height: "100%", borderRadius: 100 }}
											source={{ uri: dog.photo }}
										/>
									</TouchableOpacity>
									<Text key={`name${dog.id}`} style={styles.textsDogs}>
										{dog.name}
									</Text>
								</View>
							))
						) : (
							<View></View>
						)}

						{doggies && doggies.length < 4 ? (
							<View style={{ alignItems: "center", gap: "5%" }}>
								<TouchableOpacity style={[styles.dogListAdd, styles.shadow]} onPress={() => handleAdd()}>
									<Text
										style={{ fontSize: 40, fontWeight: 600, color: "white" }}
									>
										+
									</Text>
								</TouchableOpacity>
								<Text style={styles.textsDogs}>Add a dog</Text>
							</View>
						) : (
							<View></View>
						)}
					</View>
					<View style={styles.mainDogInfo}>
						<View style={styles.photoPincipale}>
							{doggies && doggies.length > 0 ? (
								<CarouselDog doggies={doggies} updateDoggiesCallBack={updateDoggies} />
							) : (
								<View></View>
							)}
						</View>
					</View>
					<StatusBar style="auto" />
				</View>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		paddingTop: Platform.OS === "android" ? 30 : 0,
	},
	textsDogs: {
		fontSize: 14,
		fontWeight: 600,
	},
	shadow: {
		shadowColor: "black",
		shadowOpacity: 0.5,
		elevation: 2,
		shadowRadius: 1,
		shadowOffset: { width: 1, height: 4 },
		borderWidth: 0,
	},
	mainContainer: {
		height: "90%",
		alignItems: "center",
		justifyContent: "space-around",
	},
	photoPincipale: {
		alignSelf: "left",
		width: 140,
		height: 140,
		borderRadius: 100,
		marginBottom: 400,
	},
	retourBtn: {
		flex: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F7CC99",
		width: "30%",
		height: 50,
		borderRadius: 10,
		shadowColor: "black",
		shadowOpacity: 0.4,
		elevation: 2,
		shadowRadius: 1,
		shadowOffset: { width: 1, height: 4 },
		borderWidth: 0,
	},
	retourContainer: {
		flex: 0,
		alignItems: "flex-end",
		marginRight: "3%",
	},
	dogsTitle: {
		color: "black",
		fontSize: 22,
		fontWeight: 700,
	},

	// AFFICHAGE DOGS
	dogListCont: {
		justifyContent: "center",
		flexDirection: "row",
		height: "20%",
		width: "100%",
		gap: "3%",
		overflow: "clip",
	},
	dogListCircle: {
		height: "60%",
		aspectRatio: 1 / 1,
		backgroundColor: "red",
		borderRadius: 100,
	},
	dogListAdd: {
		justifyContent: "center",
		alignItems: "center",
		height: "60%",
		aspectRatio: 1 / 1,
		backgroundColor: "#F7CC99",
		borderRadius: 100,
	},
	//AFFICHAGE MAIN DOG
	mainDogInfo: {
		height: "60%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	cadre: {
		// backgroundColor: 'red',
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 10,
		height: 40,
		width: "60%",
	},
	// ADD DOG MODAL
	modal: {
	
	},
	contenuModal: {
		backgroundColor: "white",
		borderRadius: 20,
		width: "80%",
		height: "90%",
		margin: "10%",
		justifyContent: "center",
		alignItems: "center",
	},
	close: {
		// backgroundColor: 'red',
		height: 30,
		width: 30,
		borderRadius: 100,
		position: "absolute",
		top: 10,
		right: 5,
	},
});
