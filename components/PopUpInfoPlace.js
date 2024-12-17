import React from 'react';
import { Linking, StyleSheet, Pressable, Text, View, TouchableOpacity, Image, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';



const PopUpInfoPlace = ({ friendlyToSee, setModalFriendlyVisible, userLocation, user, navigation }) => {

    const [comments, setComments] = useState([]);
    const [userCommentData, setUserCommentData] = useState(null);
    const [addFavorite, setAddFavorite] = useState(false);
    const isFocused = useIsFocused();


    // Fonction pour récupérer tous les commentaires d'un lieu
    const getComments = async () => {
        const response = await fetch(`https://dog-in-town-backend.vercel.app/places/comments/${friendlyToSee.name}`) //appelle la route avec le nom du lieu en parametre
        const result = await response.json()
        setComments(result.comments)
    }

    // Fonction pour obtenir l'utilisateur d'un commentaire
    const getUser = async (token) => {
        const response = await fetch(`https://dog-in-town-backend.vercel.app/comments/user/${token}`)
        const result = await response.json();
        setUserCommentData(result.user);
    }

    // Fonction pour ouvrir l'itinéraire dans Google Maps
    const openDirectionsInGoogleMaps = () => {
        if (userLocation) {
            const userLat = userLocation.latitude;
            const userLng = userLocation.longitude;
            const placeLat = friendlyToSee.latitude;
            const placeLng = friendlyToSee.longitude;

            // Créer l'URL d'itinéraire pour Google Maps
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${placeLat},${placeLng}`;
            Linking.openURL(url);
        }
    };
        // Récupérer les données depuis l'API
        useEffect(() => {
            if (isFocused) {
            (async () => {
                const response = await fetch(`https://dog-in-town-backend.vercel.app/users/favoris/${user.token}`);
                const data = await response.json();
                const recherche = data.allPlaces.filter((e) => e._id === friendlyToSee._id)
                if (recherche.length > 0) {  // si le lieu existe dans les favoris
                    setAddFavorite(true);
                } else {
                    setAddFavorite(false);
                }
            })();
            }
        }, [isFocused, user.token]);  // Dépendance à isFocused pour que ça s'exécute quand l'écran est focalisé

//      Fetch pour  ajouter un lieu dans la base de données User *** AJOUTER FAVORIS
    	const handleFavorite = () => {    
        fetch(`https://dog-in-town-backend.vercel.app/users/addFavoris/${user.token}`, {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({ placeId: friendlyToSee._id }),
    		}).then(response => response.json())
            .then(data => {
                console.log("Favoris ajoutés avec succès:", data);
                setAddFavorite(true); // Met à jour l'état si l'ajout a réussi
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout aux favoris:", error);
            });
    }
    
    // bouton supprime favoris
const deleteButton = () => {
    fetch(`https://dog-in-town-backend.vercel.app/users/deleteFavoris/${user.token}`,{
      method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: friendlyToSee._id }),
    }).then(response => response.json())
    .then(data => {
        console.log("Favoris supprimés avec succès:", data);
        setAddFavorite(false); // Met à jour l'état si la suppression a réussi
    })
    .catch(error => {
        console.error("Erreur lors de la suppression des favoris:", error);
    });
    
}

    useEffect(() => {
        getComments();
    }, []);

    useEffect(() => {
        if (comments.length > 0 && comments[0].token) {
            getUser(comments[0].token);
        }
    }, [comments]); // Ce useEffect est appelé chaque fois que `comments` change


    return (
        <View style={styles.fenetreInfo}>
            <View style={styles.topContent}>
                <View style={styles.titlesContainer}>
                    <Text style={styles.friendlyModalTitle}>{friendlyToSee.name}</Text>
                    <Text style={styles.type}>{friendlyToSee.type}</Text>
                </View>
                <Pressable style={styles.leaveContainer}>
                    <FontAwesome name='times-circle' size={30} color='#A23D42' onPress={() => setModalFriendlyVisible(false)} />
                </Pressable>
            </View>
            <View style={styles.placeInfo}>
                {!addFavorite ? <TouchableOpacity style={styles.buttonLike} onPress={() => handleFavorite()}>
                    <View>
                        <Text>Ajouter aux favoris</Text>
                    </View>
                </TouchableOpacity> : 
                <TouchableOpacity style={styles.buttonUnlike} onPress={() => deleteButton(friendlyToSee._id)}>
                <View>
                    <Text>Supprimer des favoris</Text>
                </View>
            </TouchableOpacity>}
                <View style={styles.ratingContainer}>
                    <View style={styles.cercleAvis} backgroundColor={friendlyToSee.feedback > 10 ? 'black' : '#F7CC99'}></View>
                    <Text style={styles.avis}>{friendlyToSee.feedback} Avis</Text>
                </View>
                <Text style={styles.sizeText}>Chiens de {friendlyToSee.sizeAccepted}{friendlyToSee.sizeAccepted === 'moyen' ? 'ne' : 'e'} taille acceptés.</Text>
            </View>
            <View style={styles.commentsContainer}>
                {userCommentData && <View style={styles.commentUserInfo}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.userAvatar} source={require('../assets/Images/avatar.png')} />
                    </View>
                    <View style={styles.userInfoText}>
                        <Text style={styles.username}>{userCommentData.username}</Text>
                        <Text style={styles.userdogRace}>Propriétaire d'un carlin</Text>
                    </View>
                </View>}
                <View style={styles.commentsPart}>
                    {comments[0] && comments[0].content && <Text style={styles.commentText}>"{comments[0].content.length > 40 ? comments[0].content.slice(0, 40) + '...' : comments[0].content}"</Text>}
                    {/* limiter le nombres de lettre affiché à 40 pour le premier commentaire*/}
                    {comments.length === 0 && <Text style={styles.commentText}>Aucun commentaire sur ce lieu</Text>}
                </View>
                {comments.length >= 1 && <View style={styles.commentsOpenerContainer}>
                    <Pressable onPress={() => { navigation.navigate('Comments', {name : friendlyToSee.name, comments: comments}); setModalFriendlyVisible(false) }}>
                        <Text style={styles.commentsOpenText}>lire les commentaires...</Text>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('Comments', {name : friendlyToSee.name, comments: comments}); setModalFriendlyVisible(false) }}>
                        <FontAwesome name='caret-down' size={30} color='#A23D42' onPress={() => setModalFriendlyVisible(false)} />
                    </Pressable>
                </View>}
            </View>
            <View style={styles.downButtonsContainer}>
                <TouchableOpacity style={styles.buttonFeedback}>
                    <View>
                        <Text style={styles.textButtonDown}>Laisser un avis</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openDirectionsInGoogleMaps()} style={styles.buttonTravel}>
                    <View>
                        <Text style={styles.textButtonDown}>On y va ?</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};



//STYLE MODAL INFOS DE LIEU
const styles = StyleSheet.create({
    fenetreInfo: {
        backgroundColor: '#FCE9D8',
        width: '90%',
        height: '75%',
        minHeight: '75%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    topContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '10%',
        paddingLeft: '5%',
        paddingRight: '3%',
        width: '100%',
    },
    titlesContainer: {
        width: '80%',
        height: '100%',
    },
    leaveContainer: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    friendlyModalTitle: {
        width: '75%',
        fontSize: 22,
        fontWeight: 700,
        color: '#5B1A10',
    },
    type: {
        marginTop: '3%',
        fontSize: 16,
        fontStyle: 'italic',
        color: '#525252',
    },
    placeInfo: {
        width: '100%',
        height: '23%',
        justifyContent: 'center',
        paddingLeft: '5%',
        paddingBottom: '3%',
        bottom: '2%',
    },
    sizeText: {
        fontSize: 18,
        fontWeight: 500,
        color: '#A23D42',
    },
    buttonLike: {
        width: '38%',
        height: '22%',
        justifyContent: 'center',
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#F1AF5A',
    },
    buttonUnlike: {
        width: '50%',
        height: '22%',
        justifyContent: 'center',
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    ratingContainer: {
        flexDirection: 'row',
        width: '22%',
        height: '20%',
        justifyContent: 'space-between',
        marginTop: '4%',
        marginBottom: '4%',
        alignItems: 'center',
    },
    cercleAvis: {
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    avis: {
        fontWeight: 600,
        color: '#5B1A10',
    },
    commentsContainer: {
        padding: '4%',
        width: '88%',
        borderRadius: 15,
        height: '30%',
        backgroundColor: 'white',
    },
    commentsPart: {
        minHeight: '10%',
        width: '100%',
        padding: '3%',
    },
    commentUserInfo: {
        flexDirection: 'row',
        width: '100%',
        height: '30%',
        alignItems: 'center',
        paddingHorizontal: '1%',
    },
    imageContainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatar: {
        maxHeight: 60,
        maxWidth: 60,
    },
    userInfoText: {
        height: '100%',
        width: '70%',
        justifyContent: 'center',
        paddingLeft: '5%',
    },
    username: {
        fontSize: 22,
        fontWeight: 600,
        color: '#A23D42',
    },
    userdogRace: {
        fontStyle: 'italic',
        color: '#A23D42',
    },
    commentText: {
        fontSize: 16,
        color: '#525252',
        fontStyle: 'italic',
    },
    commentsOpenerContainer: {
        padding: '3%',
        width: '100%',
        height: '30%',
    },
    commentsOpenText: {
        fontWeight: 600,
        fontSize: 16,
        color: '#A23D42',
    },
    downButtonsContainer: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    buttonFeedback: {
        width: '45%',
        height: '40%',
        backgroundColor: '#A23D42',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    buttonTravel: {
        width: '45%',
        backgroundColor: '#A23D42',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    textButtonDown: {
        fontWeight: 700,
        fontSize: 18,
        color: 'white',
    },

})


export default PopUpInfoPlace;