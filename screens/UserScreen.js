import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Modal,
	Image,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { login } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function UserScreen({navigation}) {
	// Etat de la modal
	const [modalIsVisible, setModalIsVisible] = useState(false);
	// Etat changement de pseudo/ email/ mdp/ photo
	const [newUser, setnewUser] = useState("");
	const [newmail, setNewmail] = useState("");
	const [newpassword, setNewpassword] = useState("");
	const [newphoto, setNewPhoto] = useState("");
	// REDUCER
	const user = useSelector((state) => state.user.value);

	//Reccupération des infos du user avec le fetch de la route get
	useEffect(() => {	
	fetch(`https://dog-in-town-backend.vercel.app/users/${user.token}`)
		  .then((response) => response.json())
		  .then((data) => {
			if(data.result) {
				setnewUser(data.profilUser[0].username)
				setNewmail(data.profilUser[0].email)
				setNewpassword(data.profilUser[0].password)
				setNewPhoto(data.profilUser[0].avatar)
			}
		  });
	  }, []);

	  console.log(newphoto)

	  const handleReturn = () => {
		navigation.navigate('Options');
	  }

	return (
		<View style={styles.background}>
			<Pressable style={styles.fleche} onPress={() => handleReturn()}><FontAwesome name="arrow-left" size={30} color="#A23D42" textAlign='right'></FontAwesome></Pressable>
			{/* Zone d'affichage standard page */}
			<View style={styles.container}>
				<Image style={styles.photoPincipale} source={{ uri: newphoto }} />
				<Text style={styles.nom}>Modifiez votre profil ici !</Text>
				<TouchableOpacity
					style={styles.bouton}
					onPress={() => setModalIsVisible(true)}
				>
					<Text style={styles.texteBouton}>Modifier mon pseudo</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.bouton}>
					<Text style={styles.texteBouton}>Modifier mon email</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.bouton}>
					<Text style={styles.texteBouton}>Modifier mon mot de passe</Text>
				</TouchableOpacity>
			</View>

			{/* Zone des modales */}
			{/* ****** MODALE PSEUDO - USERNAME ************/}
			<Modal
				style={styles.modal}
				animationType="fade"
				transparent={true}
				visible={modalIsVisible}
			>
				<View style={styles.contenuModal}>
					<View style={styles.close} onPress={() => setModalIsVisible(false)}>
						<FontAwesome name="close" size={20} color="gray" onPress={() => setModalIsVisible(false)}/>
					</View>
					<Text style={styles.petitTexte}>Pseudo actuel : {newUser}</Text>
					<TextInput
						placeholder="Nouveau Pseudo"
						autoFocus = {true}
						onChangeText={(value) => setnewUser(value.trim())}
						value={newUser}
						style={styles.encadreBlanc}/>
				</View>
			</Modal>
			{/* *********** MODALE Email ************/}
			<Modal
				style={styles.modal}
				animationType="fade"
				transparent={true}
				visible={modalIsVisible}
			>
				<View style={styles.contenuModal}>
					<View style={styles.close} onPress={() => setModalIsVisible(false)}>
						<FontAwesome name="close" size={20} color="gray" onPress={() => setModalIsVisible(false)}/>
					</View>
					<Text style={styles.petitTexte}>Mail actuel : {newmail}</Text>
					<TextInput
						placeholder="Nouveau mail"
						autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
						keyboardType="email-address" // https://reactnative.dev/docs/textinput#keyboardtype
						textContentType="emailAddress" // https://reactnative.dev/docs/textinput#textcontenttype-ios
						autoComplete="email" // https://reactnative.dev/docs/textinput#autocomplete-android
						onChangeText={(value) => setNewmail(value)}
						value={newmail}
						style={styles.encadreBlanc}/>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		width: "100%",
		height: "100%",
		backgroundColor: "#F7CC99",
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	fleche: {
		marginTop: '5%',
		marginLeft: '5%',
	},
	photoPincipale: {
		backgroundColor: "gray",
		width: 180,
		height: 180,
		borderRadius: 100,
	},
	nom: {
		color: "#A23D42",
		fontSize: 20,
		marginTop: "5%",
		marginBottom: "8%",
	},
	bouton: {
		backgroundColor: "#A23D42",
		width: "80%",
		height: "8%",
		borderRadius: 20,
		marginBottom: "3%",
	},
	texteBouton: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
		marginTop: "4%",
	},
	// MODAL
	contenuModal: {
		backgroundColor: "white",
		borderRadius: 20,
		width: "80%",
		height: "80%",
		margin: "10%",
		marginTop: "18%",
		justifyContent: "center",
		alignItems: "center",
	},
	encadreBlanc: {
		borderWidth: 1,
		borderRadius: 20,
		width: "70%",
		height: "10%",
	},
	close: {
		position: "absolute",
		top: 10,
		right: 10,
	},
	petitTexte: {
		marginTop: 10,
		fontSize: 16,
		textAlign: "center",
	},
});
