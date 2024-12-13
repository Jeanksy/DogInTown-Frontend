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
} from "react-native";
import { useSelector } from "react-redux";
import { login, AddPhotoChien } from "../reducers/user";
import { upDateUser } from "../reducers/user";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function DogsInfoScreen() {
	const user = useSelector((state) => state.user.value);
	const navigation = useNavigation();
	const [nombreDoggies, setNombreDoggies] = useState("");
	const [mainDog, setMainDog] = useState({});
  const [doggies, setDoggies] = useState([]);
 
    
  //   [
	// 	{
	// 		id: 1,
	// 		name: "Jeannine",
	// 		size: "petit",
	// 		race: "Pincher",
	// 		photo:
	// 			"https://media.istockphoto.com/id/147694372/fr/photo/blaireau-chien.jpg?s=2048x2048&w=is&k=20&c=ZsCjVEsof4woo215avT_7IfHF1MHijLEWMdD93uJXTU=",
	// 	},
	// 	{
	// 		id: 2,
	// 		name: "Mireille",
	// 		size: "moyen",
	// 		race: "Saint Bernard",
	// 		photo:
	// 			"https://i.pinimg.com/736x/e5/b9/81/e5b98110fcd62d6ebe0e636262170175.jpg",
	// 	},
	// 	{
	// 		id: 3,
	// 		name: "Chriseutine",
	// 		size: "grand",
	// 		race: "Shiba Inu",
	// 		photo:
	// 			"https://i.pinimg.com/736x/af/23/0d/af230dc0fda2e962661e1c1239230eac.jpg",
  //   },
	// ];

	const handleRetour = () => {
		navigation.navigate("TabNavigator", { screen: "Options" });
	};

	const handleDogPress = (key) => {
		console.log(key);
		setMainDog(doggies[key]);
		console.log(mainDog);
	};

	// affiche un text différent dans le JSX selon le nombre de chiens
  useEffect(() => {
      fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            console.log(data.dogs.shift())
            setDoggies(data.dogs)
            console.log(doggies)
          }
        })
  }, []);
  
  useEffect(() => {
		if (doggies.length === 1) {
			setNombreDoggies(<Text style={styles.dogsTitle}>Mon chien</Text>);
		} else if (doggies.length >= 2) {
			setNombreDoggies(<Text style={styles.dogsTitle}>Mes chiens</Text>);
		} else {
			setNombreDoggies(<Text style={styles.dogsTitle}>Ajouter un chien</Text>);
		}
  }, []);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<SafeAreaView style={styles.safeArea}>
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
						{doggies &&
							doggies.length > 0 &&
							doggies.map((dog, index) => (
								<View style={{ alignItems: "center", gap: "5%" }}>
									<TouchableOpacity
										key={index}
										style={[styles.dogListCircle, styles.shadow]}
										onPress={() => handleDogPress(index)}
									>
										<Image
											key={index}
											style={{ height: "100%", borderRadius: 100 }}
											source={{ uri: dog.photo }}
										/>
									</TouchableOpacity>
									<Text style={styles.textsDogs}>
										{dog.name}
									</Text>
								</View>
							))}

						{doggies && doggies.length < 4 && (
							<View style={{ alignItems: "center", gap: "5%" }}>
								<TouchableOpacity style={[styles.dogListAdd, styles.shadow]}>
									<Text
										style={{ fontSize: 40, fontWeight: 600, color: "white" }}
									>
										+
									</Text>
								</TouchableOpacity>
								<Text style={styles.textsDogs}>Add a dog</Text>
							</View>
						)}
          </View>
          <View style={styles.mainDogInfo}>
					<View style={styles.photoPincipale}>
						<Image
							style={{ height: "100%", borderRadius: 100 }}
							source={{ uri: mainDog.photo }}
						/>
          </View>
         
            <Text style={[styles.name, styles.textsDogs]}>Nom</Text>
            <TouchableOpacity style={styles.cadre}>
					    <Text>{mainDog.name}</Text>
            </TouchableOpacity>
            <Text style={[styles.race, styles.textsDogs]}>Race</Text>
            <TouchableOpacity style={styles.cadre}>
					    <Text>{mainDog.race}</Text>
            </TouchableOpacity>
            <Text style={[styles.size, styles.textsDogs]}>Taille</Text>
            <TouchableOpacity style={styles.cadre}>
					    <Text>{mainDog.size}</Text>  
            </TouchableOpacity>
          </View>
					<StatusBar style="auto" />
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
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
		backgroundColor: "gray",
		width: 140,
		height: 140,
		borderRadius: 100,
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
    height: '60%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  cadre: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    width:  '60%',
  },
});
