import { StyleSheet, Text, View, Pressable, SafeAreaView, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFonts } from 'expo-font'; // FONT


export default function FavoritesScreen() {
  // export de la font
  useFonts({
		"LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
		"LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
		"LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
		"LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
		});
  const user = useSelector((state) => state.user.value); // Reducer pour accéder a la position du user
  // On déclare un état pour stocker les résultats
  const [result, setResult] = useState([]);
  // État pour gérer la visibilité du bouton pour chaque élément
  const [visibleButtons, setVisibleButtons] = useState({});
  // lorsque l'écran devient visible, appel de la fonction de récupération des données
  const isFocused = useIsFocused();

  // Récupérer les données depuis l'API
  useEffect(() => {
    if (isFocused) {
      (async () => {
        const response = await fetch(`https://dog-in-town-backend-three.vercel.app/users/favoris/${user.token}`);
        const data = await response.json();
        setResult(data.allPlaces);  // Mise à jour de l'état
      })();
    }
  }, [isFocused, user.token]);  // Dépendance à isFocused pour que ça s'exécute quand l'écran est focalisé

  // Fonction pour gérer la visibilité du bouton pour chaque élément
  // permet de changer l'état de la visibilité d'un bouton pour un favori spécifique, en fonction de son id
  const toggleButtonVisibility = (id) => {
  // setVisibleButtons utilise une fonction qui prend l'état précédent (prevState) en argument et retourne un nouvel état mis à jour.
  // prevState est l'état précédent de visibleButtons. Cela nous permet de ne pas écraser l'état complet, mais plutôt de mettre à jour une partie de l'objet.
    setVisibleButtons((prevState) => ({
  //prevState déstructure l'objet prevState et copie sa clés et sa valeur dans le nouvel objet retourné.
      prevState,
  //prevState[id] récupère la valeur actuelle de la clé correspondant à cet id (soit true si le bouton est visible, soit false si le bouton est caché).
      [id]: !prevState[id],
    }));
  };

// bouton supprime favoris
const deleteButton = (idPlace) => {
fetch(`https://dog-in-town-backend-three.vercel.app/users/deleteFavoris/${user.token}`,{
  method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeId: idPlace }),
}).then(response => response.json())
.then((data) => {
  if (data.result) {
    // Si la suppression est réussie, met à jour l'état result pour retirer le lieu de la liste
    setResult((prevResult) => {
      // Filtre les lieux pour exclure celui qui a été supprimé
      return prevResult.filter((place) => place._id !== idPlace);
    });
  } else {
    // Si la suppression échoue, affiche un message d'erreur
    alert('Erreur lors de la suppression du lieu');
  }
})
}


// // Fonction pour ouvrir l'itinéraire dans Google Maps
    const openDirectionsInGoogleMaps = (latitude, longitude) => {
        if(user.positionLat) {
            const userLat = user.positionLat;
            const userLng = user.positionLon;
            const placeLat = latitude;
            const placeLng = longitude;

            // Créer l'URL d'itinéraire pour Google Maps
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${placeLat},${placeLng}`;
            Linking.openURL(url);
          } else {
            alert('Il faut autoriser votre géolocalisation dans la page map');
          }
    };

  // Affichage des favoris avec logique conditionnelle pour chaque élément
  const favoris = result.map((data, i) => {
    return (
      <View key={i} style={styles.divglobale}>
        <TouchableOpacity
          style={styles.blocFav}
          onPress={() => toggleButtonVisibility(data._id)} // Utilisation de l'ID unique pour chaque favori
        >
          <Text style={styles.nomLieu}>{data.name}</Text>
        </TouchableOpacity>
        {visibleButtons[data._id] && (
          <View style={styles.blocClic}>
            <Pressable style={styles.go} onPress={()=> openDirectionsInGoogleMaps(data.latitude, data.longitude)}><Text style={styles.texteGo}>On y va ?</Text></Pressable>
            <TouchableOpacity style={styles.boutonDelete} onPress={() => deleteButton(data._id)}>
              <FontAwesome name="close" size={25} color="#525252" />
              <Text style={styles.supp}>On supprime</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titre}>Favoris</Text>
      <Text style={styles.sousTitre}>Cliquez sur le lieu de votre choix !</Text>
      <View style={styles.favConteneur}>
         <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        removeClippedSubviews={true}
                    >
        {favoris}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7CC99',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titre: {
    fontSize: 40,
    fontWeight: '600',
    color: '#A23D42',
    fontFamily: 'LeagueSpartan-Medium',
    marginTop: "30%",
    marginLeft: '25%',
    height: '10%',
    width: '100%',
  },
  sousTitre: {
    color: "#A23D42",
    marginLeft: '25%',
    fontSize: 20,
    width: '100%',
    fontFamily: 'LeagueSpartan-Light',
  },
  favConteneur: {
    height: '90%',
    width: '100%',
    justifyContent: 'top',
    alignItems: 'center',
  },
  divglobale: {
    width: '100%',
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '9%',
  },
  blocFav: {
    backgroundColor: 'white',
    width: 300,
    height: 60,
    justifyContent: 'center',
    marginTop: '8%',
    paddingLeft: '5%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  nomLieu: {
    color: '#525252',
    fontSize: 21,
    fontWeight: 500,
    fontFamily: 'LeagueSpartan-Medium',
  },
  blocClic: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    width: '70%',
    height: '60%',
    marginBottom: '5%',
  },
  go: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#A23D42",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: '10%',
    marginLeft: '4%',
  },
  texteGo: {
    color: 'white',
    fontSize: 17,
    fontWeight: 500,
    fontFamily: 'LeagueSpartan-Medium',
  },
  boutonDelete: {
    flexDirection: 'row',
  },
  supp: {
    height: '60%',
    fontSize: 17,
    marginTop: '5%',
    marginLeft: '2%',
    color: '#525252',
    fontFamily: 'LeagueSpartan-Medium',
  },
  scrollContent: {
    marginTop: '5%',
},
});