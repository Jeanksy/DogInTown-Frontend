import React, { useState, useEffect, memo } from "react";
import {
	View,
	Platform,
	Text,
	TouchableOpacity,
	Modal,
	StyleSheet,
	TextInput,
	Pressable,
	Image,
	Keyboard,
} from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";

import { ElementsText, window } from "../constants/sizes";
import { withAnchorPoint } from "../utils/anchor-point";

const colors = ["#F1AF5A", "#FCE9D8", "#F7CC99"];

const DOG_SIZE_S = "Petit";
const DOG_SIZE_M = "Moyen";
const DOG_SIZE_L = "Grand";
const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.width * 1.1;

export const CarouselDog = ({ doggies, updateDoggiesCallBack }) => {
	const user = useSelector((state) => state.user.value);
	const [selectedDog, setSelectedDog] = useState(null);
	const [newName, setNewName] = useState("");
	const [newSize, setNewSize] = useState("");
	const [newRace, setNewRace] = useState("");
	const [dogSize, setDogSize] = useState("");
	const [selectedRace, setSelectedRace] = useState();

	// DropDown Picker
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [raceList, setRaceList] = useState([
		{ label: "Pincher", value: "Pincher" },
		{ label: "Labrador", value: "Labrador" },
		{ label: "Caniche", value: "Caniche" },
		{ label: "Berger Allemand", value: "Berger Allemand" },
		{ label: "Saint Bernard", value: "Saint Bernard" },
		{ label: "Golden Retriver", value: "Golden Retriver" },
		{ label: "Bulldog Français", value: "Bulldog Français" },
		{ label: "Chihuahua", value: "Chihuahua" },
		{ label: "Beagle", value: "Beagle" },
	]);

	// Etat de la modal
	const [modalNameIsVisible, setModalNameIsVisible] = useState(false);
	const [modalSizeIsVisible, setModalSizeIsVisible] = useState(false);
	const [modalRaceIsVisible, setModalRaceIsVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [modalDeleteIsVisible, setModalDeleteIsVisible] = useState(false);
	
	const baseOptions = {
		vertical: false,
		width: PAGE_WIDTH,
		height: PAGE_HEIGHT,
	};

	// Handlers for modals of editing fields(name, size, race)
	const openModalName = (dog) => {
		setSelectedDog(dog);
		setModalNameIsVisible(true);
	};
	const openModalSize = (dog) => {
		setSelectedDog(dog);
		setModalSizeIsVisible(true);
	};
	const openModalRace = (dog) => {
		setSelectedDog(dog);
		setModalRaceIsVisible(true);
	};
	const openModalDelete = (dog) => {
		setSelectedDog(dog);
		setModalDeleteIsVisible(true);
	};


	const handleChangeName = () => {
		setModalNameIsVisible(true);

		fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`, {
		// fetch(`http://192.168.1.60:3000/users/dog/wqUJx2Hd86ZP0nffCdC3HlouzkCnAdEj`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ dogId: selectedDog._id, name: newName }),
		})
			.then((res) => res.json())
			.then((data) => {

				if (data.result) {
					alert("Dog name updated!");
					setNewName("");
					setModalNameIsVisible(false);
					updateDoggiesCallBack();

				} else {
					alert("WAF");
					setNewName("")
				}
			});
	};


	const handleChangeSize = (dogSize) => {
		setNewSize(dogSize);		
		setModalSizeIsVisible(true);
		console.log('SelectedDog:', selectedDog._id);
	

		fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`, {
		// fetch(`http://192.168.1.60:3000/users/dog/wqUJx2Hd86ZP0nffCdC3HlouzkCnAdEj`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ dogId: selectedDog._id, size: dogSize }),
		})
			.then((res) => res.json())
			.then((data) => {

				if (data.result) {
					alert("Dog size updated!");
					setNewSize("");
					setModalSizeIsVisible(false);
					updateDoggiesCallBack();

				} else {
					alert("WAF");
					setNewSize("")
				}
			});
	};

	const handleChangeRace = (dogRace) => {
		setNewRace(dogRace)
		setModalRaceIsVisible(true)

		fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`, {
		// fetch(`http://192.168.1.60:3000/users/dog/wqUJx2Hd86ZP0nffCdC3HlouzkCnAdEj`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ dogId: selectedDog._id, race: dogRace }),
		})
			.then((res) => res.json())
			.then((data) => {

				if (data.result) {
					alert("Dog Race updated!");
					setNewRace("");
					setModalRaceIsVisible(false);
					updateDoggiesCallBack();

				} else {
					alert("WAF");
					setNewRace("")
				}
			});
	};

	const handleDelete = (dog) => {
		console.log(dog._id)
		fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`, {
	
			// fetch(`http://172.20.10.6:3000/users/dog/${user.token}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ _id: dog._id }),
			})
				.then((res) => res.json())
				.then((data) => {
	
					if (data.result) {
						alert("Dog deleted");
						setModalDeleteIsVisible(false);
						updateDoggiesCallBack();
						console.log("Dog list updated");
	
					} else {
						alert("WAF");

					}
			});
	};
		
	

	const Card = memo(({ index, animationValue, dog }) => {
		const WIDTH = PAGE_WIDTH;
		const HEIGHT = PAGE_HEIGHT / 1.6

		const cardStyle = useAnimatedStyle(() => {
			const scale = interpolate(
				animationValue.value,
				[-0.1, 0, 1],
				[0.95, 1, 1],
				Extrapolation.CLAMP
			);

			const translateX = interpolate(
				animationValue.value,
				[-1, -0.2, 0, 1],
				[0, WIDTH * 0.3, 0, 0]
			);

			const transform = {
				transform: [
					{ scale },
					{ translateX },
					{ perspective: 200 },
					{
						rotateY: `${interpolate(
							animationValue.value,
							[-1, 0, 0.4, 1],
							[30, 0, -25, -25],
							Extrapolation.CLAMP
						)}deg`,
					},
				],
			};

			return {
				//will have to check and use PLateform to activate for android and not for iOS
				// because it causes pictures to flicker at the end of animation
				// ...withAnchorPoint(transform, { x: 0.5, y: 0.5 }, { width: WIDTH, height: HEIGHT }),
			};
		}, [index]);

		const blockDetails = useAnimatedStyle(() => {
			// change offset value in second array to recenter picture in the floating view horizontal
			const translateX = interpolate(
				animationValue.value,
				[-1, 0, 1],
				[0, 90, 90]
			);

			// change offset value in second array to recenter picture in the floating view vertical
			const translateY = interpolate(
				animationValue.value,
				[-1, 0, 1],
				[0, -80, -40]
			);

			// change value for rotation of image when coming fromt the right (0 no rotat 360 to -360 )
			const rotateZ = interpolate(
				animationValue.value,
				[-1, 0, 1],
				[0, 0, -30]
			);

			return {
				transform: [
					{ translateX },
					{ translateY },
					{ rotateZ: `${rotateZ}deg` },
				],
			};
		}, [index]);

		return (
			<Animated.View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					// backgroundColor: "red",
				}}
			>
				<Animated.View
					style={[
						{
							backgroundColor:
								colors[Math.floor(Math.random() * colors.length)],
							alignSelf: "center",
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 20,
							width: WIDTH * 0.8,
							height: HEIGHT,
							...Platform.select({
								ios: {
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 8 },
									shadowOpacity: 0.44,
									shadowRadius: 10.32,
								},
								android: {
									elevation: 5,
								},
							}),
						},
						cardStyle,
					]}
				>
					<View
						style={{
							width: "100%",
							height: "100%",
							padding: "4%",
							justifyContent: "space-evenly",
						}}
					>
						<Text style={styles.dogDetails}>Nom:</Text>
						{isEditing ? <TouchableOpacity
							style={styles.encadreTextCarousel}
							onPress={() => openModalName(dog)}
						>
							<Text style={styles.dogDetailsInputs}>{dog.name}</Text>
						</TouchableOpacity> : <Text style={styles.dogDetailsLocked}>{dog.name}</Text>}
						<Text style={styles.dogDetails}>Taille:</Text>
						{isEditing ? <TouchableOpacity
							style={styles.encadreTextCarousel}
							onPress={() => openModalSize(dog)}
						>
							<Text style={styles.dogDetailsInputs}>{dog.size}</Text>
						</TouchableOpacity> : <Text style={styles.dogDetailsLocked}>{dog.size}</Text>}
						<Text style={styles.dogDetails}>Race:</Text>
						{isEditing ? <TouchableOpacity
							style={styles.encadreTextCarousel}
							onPress={() => openModalRace(dog)}
						>
							<Text style={styles.dogDetailsInputs}>{dog.race}</Text>
						</TouchableOpacity> : <Text style={styles.dogDetailsLocked}>{dog.race}</Text>}
						<View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
						<TouchableOpacity style={styles.icones}
							onPress={() => setIsEditing(!isEditing)}
						>
						<FontAwesome
							name="pencil"
							size={25}
							color="gray"
							onPress={() => setIsEditing(!isEditing)}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.icones}
							onPress={() => openModalDelete(dog)}
						>
						<FontAwesome
							name="trash-o"
							size={25}
							color="gray"
							onPress={() => openModalDelete(dog)}
							/>
						</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
				{/* Dog Picture Options */}
				<Animated.Image
					source={{ uri: doggies[index]?.photo }}
					style={[
						{
							width: 150,
							height: 150,
							borderRadius: 100,
							justifyContent: "center",
							alignItems: "center",
							position: "absolute",
							zIndex: 9,
						},
						blockDetails,
					]}
					resizeMode={"center"}
				/>
			</Animated.View>
		);
	});

	return (
		<View style={{ flex: 1 }}>
			<Carousel
				{...baseOptions}
				removeClippedSubviews={false}
				loop
				withAnimation={{
					type: "spring",
					config: {
						damping: 10,
					},
				}}
				data={doggies}
				renderItem={({ index, animationValue }) => {
					const dog = doggies[index];
					if (!dog) return null; 
					return <Card animationValue={animationValue} key={`card${index}`} index={index} dog={dog} />;
				}}
				
			/>
			<View style={{ width: "100%", height: "100%", position: "absolute" }}>

				<Modal
					style={styles.modal}
					animationType="fade"
					transparent={true}
					visible={modalNameIsVisible}
				>
					<View style={styles.contenuModal}>
						<View style={styles.close} onPress={() => setModalNameIsVisible(false)}>
							<FontAwesome
								alignSelf="center"
								name="close"
								size={20}
								color="gray"
								onPress={() => setModalNameIsVisible(false)}
							/>
						</View>
						<Text style={styles.petitTexte}>
							Nom actuel : {selectedDog?.name || 'Unknown'}
						</Text>
						<TextInput
							placeholder="Nouveau nom"
							autoFocus={true}
							onChangeText={(value) => setNewName(value)}
							value={newName}
							onSubmitEditing={() => handleChangeName()}
							style={styles.encadreBlanc}
						/>
					</View>
				</Modal>
				<Modal
					style={styles.modal}
					animationType="fade"
					transparent={true}
					visible={modalSizeIsVisible}
				>
					<View style={styles.contenuModal}>
						<View style={styles.close} onPress={() => setModalSizeIsVisible(false)}>
							<FontAwesome
								alignSelf="center"
								name="close"
								size={20}
								color="gray"
								onPress={() => setModalSizeIsVisible(false)}
							/>
						</View>
						<Text style={styles.petitTexte}>
							Changer la taille : {selectedDog?.size || 'Unknown'}
						</Text>
							<View style={styles.dogSize}>
											<View style={styles.sizeTextContainer}>
												<Text style={styles.dogSizeText}>Taille:</Text>
											</View>
											<View style={styles.dogSizeCardContainer}>
												<Pressable
													style={styles.dogSizeCard}
													onPress={() => handleChangeSize(DOG_SIZE_S)}
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
													onPress={() => handleChangeSize(DOG_SIZE_M)}
												>
													<View style={styles.dogSizeCard}>
														<Image
															style={{
																maxHeight: 50,
																maxWidth: 50,
																tintColor: dogSize === DOG_SIZE_M ? "#F1AF5A" : "#5B1A10",
															}}
															source={require("../assets/Images/moyen.png")}
														/>
														<Text>Moyen</Text>
													</View>
												</Pressable>
												<Pressable
													style={styles.dogSizeCard}
													onPress={() => handleChangeSize(DOG_SIZE_L)}
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
					</View>
				</Modal>
				<Modal
					style={styles.modal}
					animationType="fade"
					transparent={true}
					visible={modalRaceIsVisible}
				>
					<View style={styles.contenuModal}>
						<View style={styles.close} onPress={() => setModalRaceIsVisible(false)}>
							<FontAwesome
								alignSelf="center"
								name="close"
								size={20}
								color="gray"
								onPress={() => setModalRaceIsVisible(false)}
							/>
						</View>
						<Text style={styles.petitTexte}>
							Changer la race : {selectedDog?.race || 'Unknown'}
						</Text>
						<View style={styles.pickerContainer}>
							<DropDownPicker
								style={styles.picker}
								open={open}
								value={value}
								items={raceList}
								setOpen={setOpen}
								setValue={setValue}
								onSelectItem={(item) => handleChangeRace(item.value)}
								textStyle={{
									fontSize: 18,
								}}
								setItems={setRaceList}
								placeholder={"Race"}
							/>
						</View>
					</View>
				</Modal>
				<Modal
					style={styles.modalDelete}
					animationType="fade"
					transparent={true}
					visible={modalDeleteIsVisible}
				>
					<View style={styles.contenuModal}>
						<View style={styles.close} onPress={() => setModalDeleteIsVisible(false)}>
							<FontAwesome
								alignSelf="center"
								name="close"
								size={20}
								color="gray"
								onPress={() => setModalDeleteIsVisible(false)}
							/>
						</View>
						<Text style={{fontSize:20, fontWeight: 600}}>
							Retirer {selectedDog?.name || 'Unknown'}?
						</Text>
						<TouchableOpacity style={styles.deleteBtn}
						onPress={() => handleDelete(selectedDog)}
						>
							<Text style={styles.deleteTexte}>
								Oui
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteBtn}
							onPress={() => setModalDeleteIsVisible(false)}
						>	
							<Text style={styles.deleteTexte}>
								Non
							</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	// MODAL
	modal: {
		marginTop: "20%",
	},
	modalDelete: {
	},
	contenuModal: {
		backgroundColor: "white",
		borderRadius: 20,
		width: "80%",
		height: "50%",
		margin: "10%",
		marginTop: "18%",
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
	},
	encadreBlanc: {
		borderWidth: 1,
		borderRadius: 10,
		width: "70%",
		height: 30,
	},
	encadreTextCarousel: {
		justifyContent: "center",
		backgroundColor:'#f5f5f5',
		borderWidth: 1,
		borderRadius: 10,
		width: "50%",
		height: 32,
	},
	close: {
		// backgroundColor: 'red',
		height: 30,
		width: 30,
		borderRadius: 100,
		position: "absolute",
		top: 5,
		right: 5,
	},
	petitTexte: {
		marginTop: 10,
		fontSize: 16,
		textAlign: "center",
	},
	dogDetails: {
		color: "black",
		fontSize: 18,
		fontWeight: 600,
	},
	dogDetailsInputs: {
		color: "black",
		fontSize: 17,
		fontWeight: 500,
		alignSelf: "center",
	},
	dogDetailsLocked: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 15,
		color: "black",
		fontSize: 19,
		fontWeight: 500,
		alignSelf: "left",
		justifyContent: "center",
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
	icones: {
		// backgroundColor: 'red',
		height: '60%',
		width: '20%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100
	},
	deleteBtn: {
		flex: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#A23D42",
		width: "70%",
		height: 50,
		borderRadius: 20,
		shadowColor: "black",
		shadowOpacity: 0.4,
		elevation: 2,
		shadowRadius: 1,
		shadowOffset: { width: 1, height: 4 },
		borderWidth: 0,
	},
	deleteTexte: {
		fontSize: 20,
		color: "#ffffff",
	},
});

export default CarouselDog;
