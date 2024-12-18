import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Modal,
	Image,
	Pressable,
	SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../reducers/user'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Camera } from "expo-camera";
import { CameraCompo } from "../components/CameraCompo";

export default function UserScreen({ navigation }) {
	// Etat des modals
	const [modalIsVisibleU, setModalIsVisibleU] = useState(false); //Username
	const [modalIsVisibleM, setModalIsVisibleM] = useState(false); // Mail
	const [modalIsVisibleP, setModalIsVisibleP] = useState(false); // Password
	const [deleteModalIsVisbile, setDeleteModalIsVisbile] = useState(false);
	// INPUTS -----> Etat changement de pseudo/ email/ mdp/ photo
	const [newUser, setnewUser] = useState("");
	const [newmail, setNewmail] = useState("");
	const [newpassword, setNewpassword] = useState("");
	const [newPhoto, setNewPhoto] = useState("");
	const [modalCamIsVisible, setModalCamIsVisible] = useState(false);
	const [imageTaken, setImageTaken] = useState("")
	// REDUCER
	const user = useSelector((state) => state.user.value);
	const dispatch = useDispatch();

	//INFO USER ----->Reccupération des infos du user avec le fetch de la route get
	useEffect(() => {
		fetch(`https://dog-in-town-backend.vercel.app/users/${user.token}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setnewUser(data.profilUser[0].username)
					setNewmail(data.profilUser[0].email)
					setNewpassword(data.profilUser[0].password)
					setNewPhoto(data.profilUser[0].avatar)
				}
			});
	}, []);

	useEffect(() => {
		if (imageTaken) {
			setNewPhoto(imageTaken)
			handleUpdate("avatar");
		}
	  }, [imageTaken]);


	//Fonction pour supprimer compte
	const handleDelete = async () => {
		const result = await fetch(`https://dog-in-town-backend.vercel.app/users/${user.token}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const response = await result.json()
		console.log(response);
		dispatch(logout()); //Enlever le token du reducer et se déconnecter
		navigation.navigate('SignIn'); //retourner à la page signIn
	}

	const handleChangePhoto = () => {
		setModalCamIsVisible(true)
	}


	const handleReturn = () => {
		navigation.navigate('Options');
	}

	// Envoyer la mise à jour au backend
	const handleUpdate = async (type) => {
		const token = user.token; // token du reducer
		let updatedData = {};
		console.log(newPhoto)

		// Définir les données à envoyer en fonction de (type)
		if (type === "username") {
			updatedData = { username: newUser };
		} else if (type === "email") {
			updatedData = { email: newmail };
		} else if (type === "password") {
			updatedData = { password: newpassword };
		} else if (type === "avatar") {
			updatedData = { avatar : newPhoto}
		}

		// Envoyer les données au backend
		try {
			const response = await fetch(`https://dog-in-town-backend.vercel.app/users/profil/${user.token}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			});

			const data = await response.json();
			console.log("Sending to backend:", updatedData);

			if (response.ok) {
				// Réinitialiser les champs et fermer la modal
				setModalIsVisibleU(false);
				setModalIsVisibleM(false);
				setModalIsVisibleP(false);
				// Rajouter message de succès 
			} else {
				// Géstion des erreurs
				alert("Erreur lors de la mise à jour.");
			}
		} catch (error) {
			alert("Erreur de connexion.");
		}
	};


	return (
		<SafeAreaView style={styles.background}>
			<Pressable style={styles.fleche} onPress={() => handleReturn()}><FontAwesome name="arrow-left" size={30} color="#A23D42" textAlign='right'></FontAwesome></Pressable>
			{/* Zone d'affichage standard page */}
			<View style={styles.container}>
				<TouchableOpacity onPress={() => handleChangePhoto()}>
					<Image style={styles.photoPincipale} source={{ uri: newPhoto }} />
				</TouchableOpacity>
				<Text style={styles.nom}>Modifiez votre profil ici !</Text>
				<TouchableOpacity
					style={styles.bouton}
					onPress={() => setModalIsVisibleU(true)}>
					<Text style={styles.texteBouton}>Modifier mon pseudo :</Text>
					<Text style={styles.texteBoutonB}>{newUser}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.bouton}
					onPress={() => setModalIsVisibleM(true)}>
					<Text style={styles.texteBouton}>Modifier mon email :</Text>
					<Text style={styles.texteBoutonB}>{newmail}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.bouton}
					onPress={() => setModalIsVisibleP(true)}>
					<Text style={styles.texteBouton}>Modifier mon mot de passe :</Text>
					<Text style={styles.texteBoutonB}>******</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.bouton}
					onPress={() => setDeleteModalIsVisbile(true)}
				>
					<Text style={[styles.texteBouton, { fontWeight: 600 }]}>Supprimer votre compte</Text>
				</TouchableOpacity>
			</View>

			{/* Zone des modales */}
			<CameraCompo setModalCamIsVisible={setModalCamIsVisible} modalCamIsVisible={modalCamIsVisible} setImageTaken={setImageTaken}/>
			{/* MODALE PSEUDO */}
			<Modal style={styles.modal} animationType="fade" transparent={true} visible={modalIsVisibleU} onRequestClose={() => setModalIsVisibleU(false)}>
				<View style={styles.contenuModal}>
					<View style={styles.close} onPress={() => setModalIsVisibleU(false)}>
						<FontAwesome name="close" size={20} color="gray" onPress={() => setModalIsVisibleU(false)} />
					</View>
					<Text style={styles.petitTexte}>Modifiez votre pseudo ci-dessous</Text>
					<TextInput
						placeholder="Nouveau Pseudo"
						autoFocus={true}
						onChangeText={(value) => setnewUser(value.trim())}
						value={newUser}
						style={styles.encadreBlanc}
					/>
					<TouchableOpacity onPress={() => handleUpdate("username")} style={styles.bouton}>
						<Text style={styles.texteBoutonB}>Mettre à jour</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* MODALE Email */}
			<Modal style={styles.modal} animationType="fade" transparent={true} visible={modalIsVisibleM} onRequestClose={() => setModalIsVisibleM(false)}>
				<View style={styles.contenuModal}>
					<View style={styles.close} onPress={() => setModalIsVisibleM(false)}>
						<FontAwesome name="close" size={20} color="gray" onPress={() => setModalIsVisibleM(false)} />
					</View>
					<Text style={styles.petitTexte}>Modifiez votre mail ci-dessous</Text>
					<TextInput
						placeholder="Nouveau mail"
						autoCapitalize="none"
						keyboardType="email-address"
						textContentType="emailAddress"
						autoComplete="email"
						onChangeText={(value) => setNewmail(value)}
						value={newmail}
						style={styles.encadreBlanc}
					/>
					<TouchableOpacity onPress={() => handleUpdate("email")} style={styles.bouton}>
						<Text style={styles.texteBoutonB}>Mettre à jour</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* MODALE Mot de Passe */}
			<Modal style={styles.modal} animationType="fade" transparent={true} visible={modalIsVisibleP} onRequestClose={() => setModalIsVisibleP(false)}>
				<View style={styles.contenuModal}>
					<View style={styles.close} onPress={() => setModalIsVisibleP(false)}>
						<FontAwesome name="close" size={20} color="gray" onPress={() => setModalIsVisibleP(false)} />
					</View>
					<Text style={styles.petitTexte}>Modifiez votre mot de passe ci-dessous</Text>
					<TextInput
						placeholder="Nouveau mot de passe"
						secureTextEntry
						onChangeText={(value) => setNewpassword(value)}
						value={newpassword}
						style={styles.encadreBlanc}
					/>
					<TouchableOpacity onPress={() => handleUpdate("password")} style={styles.bouton}>
						<Text style={styles.texteBoutonB}>Mettre à jour</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* MODALE Suppression de compte */}
			<Modal style={styles.modal} animationType="fade" transparent={true} visible={deleteModalIsVisbile} onRequestClose={() => setModalIsVisibleP(false)}>
				<View style={styles.contenuModal}>
					<Text style={styles.petitTexte}>Etes vous sûr de vouloir supprimer votre comptes ?</Text>
					<View style={styles.buttonRow}>
						<TouchableOpacity onPress={() => handleDelete()} style={styles.boutonDelete}>
							<Text style={styles.texteBoutonB}>Oui</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setDeleteModalIsVisbile(false)} style={styles.boutonDelete}>
							<Text style={styles.texteBoutonB}>Non</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
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
		height: "10%",
		justifyContent: 'center',
		borderRadius: 20,
		marginBottom: "3%",
	},
	texteBouton: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
		fontWeight: 300,
	},
	texteBoutonB: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
		fontWeight: 600,
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
		margin: '5%',
	},
	close: {
	},
	petitTexte: {
		marginTop: 10,
		fontSize: 16,
		textAlign: "center",
	},
	buttonRow: {
		flexDirection: 'row',
		width: '100%',
		height: 200,
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	boutonDelete: {
		backgroundColor: "#A23D42",
		width: "40%",
		height: "30%",
		justifyContent: 'center',
		borderRadius: 20,
		marginBottom: "3%",
	}
});
