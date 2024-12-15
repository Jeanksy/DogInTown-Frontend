import React, { useState, useEffect, memo } from "react";
import {
	View,
	Platform,
	Text,
	TouchableOpacity,
	Modal,
	StyleSheet,
	TextInput,
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

import { ElementsText, window } from "../constants/sizes";
import { withAnchorPoint } from "../utils/anchor-point";

const colors = ["#F1AF5A", "#FCE9D8", "#F7CC99"];

const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.width * 1.1;

export const CarouselDog = ({ doggies }) => {
	const user = useSelector((state) => state.user.value);
	const [selectedDog, setSelectedDog] = useState(null);
	const [newName, setNewName] = useState([]);
	// Etat de la modal
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	
	const openModal = (dog) => {
		setSelectedDog(dog);
		setModalIsVisible(true);
	};

	const baseOptions = {
		vertical: false,
		width: PAGE_WIDTH,
		height: PAGE_HEIGHT,
	};


	const handleChangeName = () => {
		setModalIsVisible(true);

		fetch(`http://192.168.1.60:3000/users/dog/${user.token}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ dogName: selectedDog.name, newName: newName }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.result) {
					alert("Dog name updated!");
					setNewName("");
					setModalIsVisible(false);
				} else {
					alert("WAF");
					setNewName("")
				}
			});
	};

	const Card = memo(({ index, animationValue, dog }) => {
		const WIDTH = PAGE_WIDTH;
		const HEIGHT = PAGE_HEIGHT / 1.8;

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
							onPress={() => openModal(dog)}
						>
							<Text style={styles.dogDetailsInputs}>{dog.name}</Text>
						</TouchableOpacity> : <Text style={styles.dogDetailsLocked}>{dog.name}</Text>}
						<Text style={styles.dogDetails}>Taille:</Text>
						{isEditing ? <TouchableOpacity
							style={styles.encadreTextCarousel}
							onPress={() => handleChangeSize()}
						>
							<Text style={styles.dogDetailsInputs}>{dog.size}</Text>
						</TouchableOpacity> : <Text style={styles.dogDetailsLocked}>{dog.size}</Text>}
						<Text style={styles.dogDetails}>Race:</Text>
						{isEditing ? <TouchableOpacity
							style={styles.encadreTextCarousel}
							onPress={() => handleChangeRace()}
						>
							<Text style={styles.dogDetailsInputs}>{dog.race}</Text>
						</TouchableOpacity> : <Text style={styles.dogDetailsLocked}>{dog.race}</Text>}
						<TouchableOpacity
							onPress={() => setIsEditing(!isEditing)}
						>
						<FontAwesome
							alignSelf="flex-end"
							name="pencil"
							size={20}
							color="gray"
							onPress={() => setIsEditing(!isEditing)}
							/>
						</TouchableOpacity>
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
						damping: 15,
					},
				}}
				data={doggies}
				renderItem={({ index, animationValue }) => {
					const dog = doggies[index];
					if (!dog) return null; 
					return <Card animationValue={animationValue} key={`card${index}`} index={index} dog={dog} />;
				}}
				
			/>
			<Modal
				style={styles.modal}
				animationType="fade"
				transparent={true}
				visible={modalIsVisible}
			>
				<View style={styles.contenuModal}>
					<View style={styles.close} onPress={() => setModalIsVisible(false)}>
						<FontAwesome
							alignSelf="center"
							name="close"
							size={20}
							color="gray"
							onPress={() => setModalIsVisible(false)}
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
						onSubmitEditing={handleChangeName}
						style={styles.encadreBlanc}
					/>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	// MODAL
	modal: {
		marginTop: "20%",
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
		height: 40,
	},
	encadreTextCarousel: {
		justifyContent: "center",
		backgroundColor:'#f5f5f5',
		borderWidth: 1,
		borderRadius: 10,
		width: "50%",
		height: 40,
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
});

export default CarouselDog;
