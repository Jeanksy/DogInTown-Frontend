import React from "react";
import {
	Linking,
	StyleSheet,
	Pressable,
	Text,
	View,
	TouchableOpacity,
	Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import { useFonts } from 'expo-font'; // FONT

const DOG_SIZE_S = "petit";
const DOG_SIZE_M = "moyen";
const DOG_SIZE_L = "grand";

const PopUpFilterPlace = ({
	setModalFilterVisible,
	setDogSizeS,
	setDogSizeM,
	setDogSizeL,
	setBars,
	setResto,
    setCafe,
    applyFilter,
}) => {
	// Sélectionner la taille du chien
	const [dogSize, setDogSize] = useState("");
	const [selectedResto, setSelectedResto] = useState(false);
	const [selectedBars, setSelectedBars] = useState(false);
	const [selectedCafe, setSelectedCafe] = useState(false);

	// export de la font
			useFonts({
			"LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
			"LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
			"LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
			"LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
			});

	// const getComments = async () => {
	//     const response = await fetch(`https://dog-in-town-backend.vercel.app/places/comments/${friendlyToSee.name}`) //appelle la route avec le nom du lieu en parametre
	//     const result = await response.json()
	//     setComments(result.comments)
	// }

	// Fonction pour obtenir l'utilisateur d'un commentaire

	return (
		<View style={styles.fenetreInfo}>
			<View style={styles.topContent}>
				<Pressable style={styles.leaveContainer}>
					<FontAwesome
						name="times-circle"
						size={30}
						color="#A23D42"
						onPress={() => setModalFilterVisible(false)}
					/>
				</Pressable>
			</View>
			<View style={styles.modalBodyContainer}>
				<Text
					style={{
						textAlign: "center",
						fontSize: 30,
						color: "#A23D42",
						height: "10%",
						fontFamily: 'LeagueSpartan-Bold',
					}}
				>
					Filtres
				</Text>
				<View style={styles.modalOptions}>
					<Pressable
						style={selectedBars ? [styles.encadreTextSelected] : [styles.encadreText]}
                        onPress={() => setSelectedBars(!selectedBars)}
                        onPressOut={() => setBars([true, 'bar'])}
					>
						<Text style={styles.texts}>Bars</Text>
					</Pressable>
					<Pressable
						style={selectedResto ? [styles.encadreTextSelected] : [styles.encadreText]}
                        onPressIn={() => setSelectedResto(!selectedResto)}
                        onPressOut={()=> setResto([true, 'restaurant'])}
					>
						<Text style={styles.texts}>Restaurants</Text>
					</Pressable>
					<Pressable
						style={selectedCafe ? [styles.encadreTextSelected] : [styles.encadreText]}
                        onPressIn={() => setSelectedCafe(!selectedCafe)}
                        onPressOut={() => setCafe([true, 'cafe'])}
					>
						<Text style={styles.texts}>Cafés</Text>
					</Pressable>
				</View>
				<View style={styles.dogSize}>
					<View style={styles.dogSizeCardContainer}>
						<Pressable
							style={styles.dogSizeCard}
                            onPressIn={() => setDogSize(DOG_SIZE_S)}
                            onPressOut={() => setDogSizeS([true, "petit"]) }     
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
								<Text style={styles.texts}>Petit</Text>
							</View>
						</Pressable>
						<Pressable
							style={styles.dogSizeCard}
                            onPressIn={() => setDogSize(DOG_SIZE_M)}
                            onPressOut={() => setDogSizeM([true, "moyen"]) }
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
								<Text style={styles.texts}>Moyen</Text>
							</View>
						</Pressable>
						<Pressable
							style={styles.dogSizeCard}
                            onPressIn={() => setDogSize(DOG_SIZE_L)}
                            onPressOut={() => setDogSizeL([true, "grand"]) }
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
								<Text style={styles.texts}>Grand</Text>
							</View>
						</Pressable>
					</View>
				</View>
				<View style={styles.downButtonsContainer}>
					<TouchableOpacity
                        onPressIn={() => applyFilter()}
                        onPressOut={() => setModalFilterVisible(false)}
						style={styles.buttonApplyFilter}
					>
						<View>
							<Text style={styles.textButtonDown}>Appliquer filtres</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

//STYLE MODAL INFOS DE LIEU
const styles = StyleSheet.create({
	fenetreInfo: {
		backgroundColor: "#FCE9D8",
		width: "90%",
		height: "75%",
		minHeight: "75%",
		borderRadius: 20,
		alignItems: "center",
	},
	topContent: {
		// backgroundColor: 'orange',
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		height: "10%",
		width: "100%",
		marginBottom: "10%",
	},
	leaveContainer: {
		height: 60,
		width: 60,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 100,
	},
	type: {
		marginTop: "3%",
		fontSize: 16,
		fontFamily: 'LeagueSpartan-Light',
		color: "#525252",
	},
	modalBodyContainer: {
		// backgroundColor: 'green',
		height: "60%",
		justifyContent: "space-between",
		marginBottom: "10%",
	},
	modalOptions: {
		height: "40%",
		// backgroundColor: 'red',
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	texts: {
		textAlign: "center",
		fontSize: 16,
		fontFamily: 'LeagueSpartan-Medium',
	},
	encadreText: {
		justifyContent: "center",
		textAlign: "center",
		padding: 5,
		backgroundColor: "#f5f5f5",
		borderWidth: 1,
		borderRadius: 10,
		width: "32%",
		height: 40,
	},
	encadreTextSelected: {
		justifyContent: "center",
		textAlign: "center",
		padding: 5,
		backgroundColor: "#A23D42",
		borderWidth: 1,
		borderRadius: 10,
		width: "32%",
		height: 40,
	},
	dogSize: {
		justifyContent: "flex-end",
	},
	dogSizeCardContainer: {
		marginBottom: "20%",
		height: "40%",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-evenly",
		flexDirection: "row",
		// backgroundColor: 'blue',
	},
	dogSizeCard: {
		alignItems: "center",
	},
	dogPictureText: {
		fontSize: 20,
		fontFamily: 'LeagueSpartan-Medium',
		color: "#5B1A10",
		marginBottom: "2%",
	},
	downButtonsContainer: {
		// backgroundColor: 'white',
		width: "100%",
		height: "20%",
        flexDirection: "row",
        justifyContent: 'center',
		alignItems: "center",
	},
	buttonApplyFilter: {
		width: "70%",
		backgroundColor: "#A23D42",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
	},
	textButtonDown: {
		fontFamily: 'LeagueSpartan-Bold',
		fontSize: 20,
		color: "white",
	},
});

export default PopUpFilterPlace;
