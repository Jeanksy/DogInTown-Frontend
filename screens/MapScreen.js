import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, Dimensions, Pressable, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker, } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { API_GOOGLE_KEY } from '@env';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';



const { width, height } = Dimensions.get('window'); //dimension de l'écran
const DOG_SIZE_S = 'petit';
const DOG_SIZE_M = 'moyen';
const DOG_SIZE_L = 'grand';


export default function MapScreen() {

  const [modalVisible, setModalVisible] = useState(false); //Modal d'ajout de lieu
  const [currentPosition, setCurrentPosition] = useState({}); //coordonnés de notre position actuelle
  const [places, setPlaces] = useState([]); //lieux trouvés par l'API GOOGLE
  const [friendlies, setFriendlies] = useState([]); //lieux contenu dans notre base de donnée place
  const [searchText, setSearchText] = useState(''); //text compris dans la bar de recherche
  const [dogSize, setDogSize] = useState('petit'); //taille du chien
  const [addPlaceName, setAddPlaceName] = useState(''); //nom du lieu à ajouter à la bdd
  const [placeToAdd, setPlaceToAdd] = useState(null); //objet du lieu à ajouter à la bdd
  const [friendlyToSee, setFriendlyToSee] = useState(null) //objet du lieu à afficher avec le pop up lieu
  const [firstComment, setFirstComment] = useState(''); //contenu d'un premier commentaire
  const [refreshShow, setRefreshShow] = useState(false);
  const [modalFriendlyVisible, setModalFriendlyVisible] = useState(false) //Modal détail de lieu
  const user = useSelector((state) => state.user.value);


  const isFocused = useIsFocused();

  useEffect(() => {
      (async () => {
        const response = await fetch('https://dog-in-town-backend.vercel.app/places')
        const result = await response.json()
        setFriendlies(result.allPlaces);
      })();
  }, [isFocused, modalVisible, refreshShow])

  // Trouver notre position actuel
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
          });
      }
    })();
  }, [currentPosition, modalVisible]);


  // Fonction pour filtrer les friendlies en fonction de la recherche
  const filterFriendlies = () => {
    if (searchText.trim().length === 0) {
      return friendlies; // Si rien n'est recherché, retourne tous les friendlies
    }

    // Filtre les friendlies dont le nom contient la recherche
    return friendlies.filter(friendly =>
      friendly.name.toLowerCase().includes(searchText.toLowerCase()) // Comparaison insensible à la casse
    );
  };



  // FONCTION POUR TROUVER UN LIEU SUR L'API GOOGLE PLACE ET FILTRER L'AFFICHAGE
  const searchPlace = async () => {
    if (!searchText.trim().length) return;

    console.log('Recherche:', searchText);
    const radius = 10000 // 10000 metres = 10 km autour de position utilisateur
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}bars+cafes+restaurants&location=${currentPosition.latitude},${currentPosition.longitude}&radius=${radius}&key=${API_GOOGLE_KEY}`;
    setFriendlies(filterFriendlies())
    try {
      const response = await fetch(googleApiUrl);
      const data = await response.json();


      if (data.status === 'OK' && data.results.length > 0) {
        const placeData = data.results;
        setPlaces(placeData);  // enregistre la data du lieu recherché dans l'état places
        setSearchText('');
      } else {
        console.log('Pas de résultats trouvé', data.status);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
    }
  };

  //Fonction pour ourir le pop est sélectionner le lieu à ajouter
  const addNewPlace = (place) => {
    setModalVisible(true);
    setPlaceToAdd(place); //enregistre dans placeToAdd l'objet correspondant au marker selectionné
  }

  // Fonction pour vérifier si un lieu est déjà un friendlie
  const isPlaceInFriendlies = (place) => {
    return friendlies.some(friendly =>
      friendly.latitude === place.geometry.location.lat &&
      friendly.longitude === place.geometry.location.lng
    );
  };


  //Fonction pour ajouter à la BDD un nouveau lieu
  const handleAddingPlace = async (place) => {

    if (firstComment !== '') { //si commentaire rempli ajout du commentaire dans la bdd
      const responseComment = await fetch(`https://dog-in-town-backend.vercel.app/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: firstComment, token: user.token }),
      })
      const result = await responseComment.json()
      const responsePlace = await fetch(`https://dog-in-town-backend.vercel.app/places/addPlace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: place.name,
          token: result.comment.token,
          type: place.types[0],
          adress: place.formatted_address,
          size: dogSize,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        })
      })
    } else { //pas de premier commentaire rempli
      const responsePlace = await fetch(`https://dog-in-town-backend.vercel.app/places/addPlace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: place.name,
          type: place.types[0],
          adress: place.formatted_address,
          size: dogSize,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        })
      })
    }
    setDogSize(DOG_SIZE_S);
    setPlaces([]);
    setFirstComment('');
    setModalVisible(!modalVisible);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <MapView mapType="standard" onPress={() => {setPlaces([]), setRefreshShow(!refreshShow)}} style={styles.map} initialRegion={{
        latitude: 45.75,
        longitude: 4.85,
        latitudeDelta: 1.0,
        longitudeDelta: 1.0,
      }
      }>
        {currentPosition && currentPosition.latitude && currentPosition.longitude && (
          <Marker coordinate={currentPosition} pinColor="#fecb2d" title="Vous êtes ici" />
        )}
        {places && places.length > 0 && places.map((place, index) => !isPlaceInFriendlies(place) && (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            description={place.formatted_address}
            onPress={() => { addNewPlace(place), setAddPlaceName(place.name) }}
          />
        ))}
        {friendlies && friendlies.length > 0 && friendlies.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.adress}
            style={styles.marker}
            onPress={() => {setModalFriendlyVisible(true), setFriendlyToSee(place)}}
          >
            <View style={styles.markerContainer}>
              <Image source={require('../assets/Images/patte2.png')} style={{ width: 15, height: 15, tintColor: 'white', resizeMode: 'contain' }} />
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.blocRecherches}>
        <FontAwesome name='sliders' color='#525252' style={styles.icons} />
        <TextInput
          style={styles.recherches}
          placeholder='Rechercher'
          onChangeText={(value) => setSearchText(value)}
          value={searchText}
        />
        <FontAwesome onPress={searchPlace} name='search' color='#525252' style={styles.icons} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.contenuModal}>
          <View style={styles.fenetre}>
            <Text style={styles.addModalTitle}>Ce lieu est un espace dog friendly ?</Text>
            <View style={styles.searchBox}>
              <Text style={styles.searchBoxField}>{addPlaceName}</Text>
            </View>
            <View style={styles.dogSize}>
              <View style={styles.sizeTextContainer}>
                <Text style={styles.dogSizeText}>Taille de chien accepté:</Text>
              </View>
              <View style={styles.dogSizeCardContainer}>
                <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_S)}>
                  <View style={styles.dogSizeCard}>
                    <Image style={{ maxHeight: 40, maxWidth: 40, tintColor: dogSize === DOG_SIZE_S ? "#A23D42" : "#5B1A10" }} source={require('../assets/Images/petit.png')} />
                    <Text>Petit</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_M)}>
                  <View style={styles.dogSizeCard}>
                    <Image style={{ maxHeight: 50, maxWidth: 50, tintColor: dogSize === DOG_SIZE_M ? "#A23D42" : "#5B1A10" }} source={require('../assets/Images/moyen.png')} />
                    <Text>Moyen</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.dogSizeCard} onPress={() => setDogSize(DOG_SIZE_L)}>
                  <View style={styles.dogSizeCard}>
                    <Image style={{ maxHeight: 100, maxWidth: 100, tintColor: dogSize === DOG_SIZE_L ? "#A23D42" : "#5B1A10" }} source={require('../assets/Images/grand.png')} />
                    <Text>Grand</Text>
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={styles.firstCommentContainer}>
              <TextInput placeholder='Laissez un premier avis sur ce lieu!' onChangeText={(value) => setFirstComment(value)} value={firstComment} autoCapitalize="sentences" style={styles.firstCommentTextInput}></TextInput>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleAddingPlace(placeToAdd)}>
              <View >
                <Text style={styles.buttonLabel}>Ajouter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFriendlyVisible}
        onRequestClose={() => {
          setModalFriendlyVisible(!modalFriendlyVisible);
        }}>
        <View style={styles.contenuModal}>
          <View style={styles.fenetre}>
            <View style={styles.topContent}>
              {friendlyToSee && <Text style={styles.addModalTitle}>{friendlyToSee.name}</Text>}
              <View style={styles.topRightButtons}></View>
            </View>
            <View style={styles.placeInfo}></View>
            <View style={styles.commentsContainer}></View>
            <View style={styles.buttonAvis}></View>
            <View style={styles.downButtonsContainer}></View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#97C7DE',
  },
  map: {
    height: height,
    width: width,
  },
  blocRecherches: {
    top: '10%',
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: '85%',
    height: 60,
  },
  recherches: {
    width: '70%',
    height: '100%',
    marginLeft: '3%',
    marginRight: '3%',
  },
  // marker:{
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: 50,
  //   width: 50,
  // },
  markerContainer: {
    height: 28,
    width: 28,
    borderRadius: 100,
    backgroundColor: '#F1AF5A',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  icons: {
    fontSize: 22,
  },
  zoneBouton: {
    position: 'absolute',
    top: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  boutonPatoune: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',

  },
  patte: {
    height: 150,
    width: 150,
  },
  /// STYLE MODAL AJOUT DE LIEU ////
  contenuModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  fenetre: {
    backgroundColor: '#F1AF5A',
    width: '90%',
    height: '75%',
    minHeight: '75%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addSearchInput: {
    marginLeft: 20,
    height: 40,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '80%',
    height: 60,
    backgroundColor: '#FCE9D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dogSize: {
    height: 140,
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',

  },
  dogSizeText: {
    marginLeft: 8,
    fontSize: 20,
    color: '#5B1A10',
  },
  dogPicture: {
    height: 310,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // backgroundColor: 'red',
    marginTop: 20,
  },
  sizeTextContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'puprle',
  },
  dogSizeCardContainer: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginRight: '12%',
  },
  dogSizeCard: {
    alignItems: 'center',
  },
  firstCommentContainer: {
    backgroundColor: 'white',
    height: '20%',
    width: '80%',
    borderRadius: 15,
  },
  firstCommentTextInput: {
  },
  addModalTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#5B1A10',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 600,
    color: '#5B1A10',
  },
  searchBoxField: {
    fontSize: 22,
    fontWeight: 700,
  }
});