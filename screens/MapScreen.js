import { StatusBar } from "expo-status-bar";
import {
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	TextInput,
	Modal,
	Switch,
	BackHandler
} from "react-native";
import LottieView from 'lottie-react-native';
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { API_GOOGLE_KEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { position } from "../reducers/user";
import { useIsFocused } from "@react-navigation/native";
import PopUpInfoPlace from "../components/PopUpInfoPlace";
import PopUpAddPlace from "../components/PopUpAddPlace";
import PopUpFilterPlace from "../components/PopUpFilterPlace";

const { width, height } = Dimensions.get("window"); //dimension de l'écran

export default function MapScreen({ navigation }) {
	const [modalVisible, setModalVisible] = useState(false); //Modal d'ajout de lieu
	const [currentPosition, setCurrentPosition] = useState({}); //coordonnés de notre position actuelle
	const [places, setPlaces] = useState([]); //lieux trouvés par l'API GOOGLE
	const [friendlies, setFriendlies] = useState([]); //lieux contenu dans notre base de donnée place
	const [searchText, setSearchText] = useState(""); //text compris dans la bar de recherche
	const [addPlaceName, setAddPlaceName] = useState(""); //nom du lieu à ajouter à la bdd
	const [placeToAdd, setPlaceToAdd] = useState(null); //objet du lieu à ajouter à la bdd
	const [friendlyToSee, setFriendlyToSee] = useState(null); //objet du lieu à afficher avec le pop up lieu
	const [refreshShow, setRefreshShow] = useState(false);
	const [modalFriendlyVisible, setModalFriendlyVisible] = useState(false); //Modal détail de lieu
	const user = useSelector((state) => state.user.value); // Reducer pour accéder au username et token
	const dispatch = useDispatch(); // Reducer pour recupérer la position actuelle du user
	const isFocused = useIsFocused();
	const [modalFilterVisible, setModalFilterVisible] = useState(false);
	const [resto, setResto] = useState([false, "restaurant"]);
	const [bars, setBars] = useState([false, "bar"]);
	const [cafe, setCafe] = useState([false, "cafe"]);
	const [dogSizeS, setDogSizeS] = useState([false, "petit"]);
	const [dogSizeM, setDogSizeM] = useState([false, "moyen"]);
	const [dogSizeL, setDogSizeL] = useState([false, "grand"]);
	const [useFilter, setUseFilter] = useState([]);
	const [isGeoloc, setIsGeoloc] = useState(true);
	const [postCodeLat, setPostCodeLat] = useState(45.75);
	const [postCodeLon, setPostCodeLon] = useState(4.85);
	const [isInitialPositionLoaded, setIsInitialPositionLoaded] = useState(false);
  	const animation = useRef(null);



	  const source = Platform.OS === 'android'
	  ? require('../assets/cloudLoading.mp4.lottie.json')  // Source pour Android
	  : require('../assets/cloudLoading.mp4.lottie.lottie'); // Source pour iOS


	// useEffect(() => {
	// 	// Désactiver le retour en arrière
	// 	navigation.setOptions({
	// 	  gestureEnabled: false, // Empêche le geste de retour
	// 	  headerLeft: () => null, // Empêche l'icône du bouton retour dans l'en-tête
	// 	});
	//   }, [navigation]);

	useEffect(() => {
		// Fonction qui sera exécutée lorsque l'utilisateur appuie sur le bouton retour
		const backAction = () => {
		  // Fermer l'application
		  BackHandler.exitApp(); // Ferme l'application sur Android
		  return true; // Indique que l'action est gérée
		};
	
		// Ajouter l'écouteur pour le bouton retour
		BackHandler.addEventListener('hardwareBackPress', backAction);
	
		// Nettoyer l'écouteur lorsque le composant est démonté
		return () => {
		  BackHandler.removeEventListener('hardwareBackPress', backAction);
		};
	  }, []);


	//Use effect fetch des lieux présent dans la bdd
	useEffect(() => {
		if (useFilter.length > 0) {
			return;
		}
		(async () => {
			const response = await fetch(
				"https://dog-in-town-backend-three.vercel.app/places"
			);
			const result = await response.json();
			setFriendlies(result.allPlaces);
			setUseFilter([]);
		})();
	}, [isFocused, modalVisible, refreshShow]);

	// Trouver notre position actuel
	useEffect(() => {
		(async () => {
			const result = await Location.requestForegroundPermissionsAsync();
			const status = result?.status;
			if (status === "denied") {
				setIsGeoloc(false);
			}

			if (isGeoloc && status === "denied") {
				let data;
				try {
					const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${user.postCode}&components=country:FR&key=${API_GOOGLE_KEY}`);
					if (response.ok) {
						data = await response.json();
						const result = data.results[0];
						setPostCodeLat(result.geometry.location.lat);
						setPostCodeLon(result.geometry.location.lng);
						setIsInitialPositionLoaded(true);
					} else {
						console.error('Erreur de récupération des données');
					}
				} catch (error) {
					console.error('Erreur:', error);
				}
				return;
			} else if (isGeoloc === false && status === "granted") {
				return;
			} else if (isGeoloc === true && status === "granted") {
				Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
					setCurrentPosition(location.coords);
					dispatch(
						position({
							positionLat: location.coords.latitude,
							positionLon: location.coords.longitude,
						})
					);
					setPostCodeLat(location.coords.latitude);
					setPostCodeLon(location.coords.longitude);
					setIsInitialPositionLoaded(true);
				});
			}
		})();
	}, [currentPosition, modalVisible, isGeoloc]);

	//filtrer les friendlies par catégories et/ou tailles de chiengs

	const researchFilter = (places) => {
		const selectedPlaceTypes = [];
		if (resto[0]) {
			selectedPlaceTypes.push(resto[1]);
		} //check is resto is thuthfully, then push resto type in filter array
		if (bars[0]) {
			selectedPlaceTypes.push(bars[1]);
		} //check is bar is thuthfully, then push bar type in filter array
		if (cafe[0]) {
			selectedPlaceTypes.push(cafe[1]);
		}

		let selectedDogSize = null;
		if (dogSizeS[0]) {
			selectedDogSize = dogSizeS[1];
		} //check is sizeS is thuthfully, then sets selectedDog is true
		if (dogSizeM[0]) {
			selectedDogSize = dogSizeM[1];
		}
		if (dogSizeL[0]) {
			selectedDogSize = dogSizeL[1];
		}

		const filtered = places.filter((place) => {
			const matchesPlaceType =
				selectedPlaceTypes.length === 0 ||
				selectedPlaceTypes.includes(place.type);
			const matchesDogSize =
				!selectedDogSize || place.sizeAccepted === selectedDogSize;

			return matchesPlaceType && matchesDogSize; // filter returns places matching selected filters
		});

		// Update the state with the filtered results
		setUseFilter(friendlies); // places filtered to display
		setFriendlies(filtered); // useState to stop map from rerendering

		// Reset filter states
		setResto([false, "restaurant"]);
		setBars([false, "bar"]);
		setCafe([false, "cafe"]);
		setDogSizeS([false, "petit"]);
		setDogSizeM([false, "moyen"]);
		setDogSizeL([false, "grand"]);
	};

	// Fonction pour filtrer les friendlies en fonction de la recherche
	const filterFriendlies = () => {
		if (searchText.trim().length === 0) {
			return; // Si rien n'est recherché, retourne tous les friendlies
		}

		if (searchText.toLocaleLowerCase() === 'bar' || searchText.toLocaleLowerCase() === 'cafe' || searchText.toLocaleLowerCase() === 'restaurant') {
			return friendlies.filter(
				(friendly) => {
					return friendly.type === searchText.toLocaleLowerCase();
				}
			);
		}

		// Filtre les friendlies dont le nom contient la recherche
		return friendlies.filter((friendly) => {
			return friendly.name.toLowerCase().includes(searchText.toLowerCase()); // Comparaison insensible à la casse
		});
	};

	// FONCTION POUR TROUVER UN LIEU SUR L'API GOOGLE PLACE ET FILTRER L'AFFICHAGE
	const searchPlace = async () => {
		if (!searchText.trim().length) return;

		const radius = 10000; // 10000 metres = 10 km autour de position utilisateur
		const googleApiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}bars+cafes+restaurants&location=${currentPosition.latitude},${currentPosition.longitude}&radius=${radius}&key=${API_GOOGLE_KEY}`;
		setFriendlies(filterFriendlies());
		try {
			const response = await fetch(googleApiUrl);
			const data = await response.json();

			if (data.status === "OK" && data.results.length > 0) {
				const placeData = data.results;
				setPlaces(placeData); // enregistre la data du lieu recherché dans l'état places
				setSearchText("");
			}
		} catch (error) {
			console.error("Erreur fetch:", error);
		}
	};

	//Fonction pour ourir le pop est sélectionner le lieu à ajouter
	const addNewPlace = (place) => {
		setModalVisible(true);
		setPlaceToAdd(place); //enregistre dans placeToAdd l'objet correspondant au marker selectionné
	};

	// Fonction pour vérifier si un lieu est déjà un friendlie
	const isPlaceInFriendlies = (place) => {
		return friendlies.some(
			(friendly) =>
				friendly.latitude === place.geometry.location.lat &&
				friendly.longitude === place.geometry.location.lng
		);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			{isInitialPositionLoaded ? <MapView
				mapType="standard"
				onPress={() => {
					setPlaces([]), setRefreshShow(!refreshShow), setUseFilter([]);
				}}
				style={styles.map}
				initialRegion={{
					latitude: postCodeLat,
					longitude: postCodeLon,
					latitudeDelta: 1.0,
					longitudeDelta: 1.0,
				}}
			>
				{isGeoloc &&
					currentPosition &&
					currentPosition.latitude &&
					currentPosition.longitude && (
						<Marker
							coordinate={currentPosition}
							pinColor="#fecb2d"
							title="Vous êtes ici"
						/>
					)}
				{places &&
					places.length > 0 &&
					places.map(
						(place, index) =>
							!isPlaceInFriendlies(place) && (
								<Marker
									key={index}
									coordinate={{
										latitude: place.geometry.location.lat,
										longitude: place.geometry.location.lng,
									}}
									title={place.name}
									description={place.formatted_address}
									onPress={() => {
										addNewPlace(place), setAddPlaceName(place.name);
									}}
								/>
							)
					)}
				{friendlies &&
					friendlies.length > 0 &&
					friendlies.map((place, index) => (
						<Marker
							key={index}
							coordinate={{
								latitude: place.latitude,
								longitude: place.longitude,
							}}
							title={place.name}
							description={place.adress}
							style={styles.marker}
							onPress={() => {
								setModalFriendlyVisible(true), setFriendlyToSee(place);
							}}
						>
							<View
								style={styles.markerContainer}
								backgroundColor={
									place.feedback.length < 10 ? "#F1AF5A" : "#53CD2D"
								}
							>
								<Image
									source={require("../assets/Images/patte2.png")}
									style={{
										width: 15,
										height: 15,
										tintColor: "white",
										resizeMode: "contain",
									}}
								/>
							</View>
						</Marker>
					))}
			</MapView> : <LottieView
			  ref={animation}
              style={{
                  width: '100%',
                  height: '100%',
                  }}
                  source={source} autoPlay loop />}
			<View style={styles.toggleBtn}>
					<Switch
						trackColor={{ false: "#767577", true: "#53CD2D" }}
						thumbColor="#f4f3f4"
						onValueChange={(value) => setIsGeoloc(value)}
						value={isGeoloc}
					/>
				</View>
			<View style={styles.blocRecherches}>
				<FontAwesome
					name="sliders"
					color="#525252"
					style={styles.icons}
					onPress={() => setModalFilterVisible(true)}
				/>
				<TextInput
					style={styles.recherches}
					placeholder="Rechercher"
					onChangeText={(value) => setSearchText(value)}
					value={searchText}
				/>
				<FontAwesome
					onPress={searchPlace}
					name="search"
					color="#525252"
					style={styles.icons}
				/>
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.contenuModal}>
					<PopUpAddPlace
						addPlaceName={addPlaceName}
						placeToAdd={placeToAdd}
						setModalVisible={setModalVisible}
						setPlaces={setPlaces}
						userToken={user.token}
					/>
				</View>
			</Modal>
			<Modal // Modal info de lieu
				animationType="slide"
				transparent={true}
				visible={modalFriendlyVisible}
				onRequestClose={() => {
					setModalFriendlyVisible(!modalFriendlyVisible);
				}}
			>
				<View style={styles.contenuModal}>
					{friendlyToSee && (
						<PopUpInfoPlace
							friendlyToSee={friendlyToSee}
							setModalFriendlyVisible={setModalFriendlyVisible}
							userLocation={currentPosition}
							user={user}
							navigation={navigation}
						/>
					)}
				</View>
			</Modal>
			<Modal // Modal Filters
				animationType="slide"
				transparent={true}
				visible={modalFilterVisible}
				onRequestClose={() => {
					setModalFilterVisible(false);
				}}
			>
				<View style={styles.contenuModal}>
					<PopUpFilterPlace
						setModalFilterVisible={setModalFilterVisible}
						setDogSizeS={setDogSizeS}
						setDogSizeM={setDogSizeM}
						setDogSizeL={setDogSizeL}
						setResto={setResto}
						setCafe={setCafe}
						setBars={setBars}
						applyFilter={() => researchFilter(friendlies)}
					/>
				</View>
			</Modal>
			<StatusBar style="auto" />
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#97C7DE",
	},
	map: {
		height: height,
		width: width,
	},
	blocRecherches: {
		top: "10%",
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		borderRadius: 20,
		width: "85%",
		height: 60,
	},
	recherches: {
		width: "70%",
		height: "100%",
		marginLeft: "3%",
		marginRight: "3%",
	},
	markerContainer: {
		height: 28,
		width: 28,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		resizeMode: "contain",
	},
	icons: {
		fontSize: 22,
	},
	zoneBouton: {
		position: "absolute",
		top: "80%",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	boutonPatoune: {
		width: 80,
		height: 80,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	patte: {
		height: 150,
		width: 150,
	},
	contenuModal: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: "10%",
	},
	toggleBtn: {
		position: "absolute",
		justifyContent: 'center',
		alignItems: 'center',
		height: 80,
		width: 80,
		bottom: "0%",
		right: "3%",
	},
});
