import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function FavoritesScreen() {
  const user = useSelector((state) => state.user.value); // Reducer pour accéder au username et token
  // On déclare un état pour stocker les résultats
  const [result, setResult] = useState([]);
  // État pour gérer la visibilité du bouton pour chaque élément
  const [visibleButtons, setVisibleButtons] = useState({});

  // Récupérer les données depuis l'API
  useEffect(() => {
    (async () => {
      const response = await fetch(`https://dog-in-town-backend.vercel.app/users/favoris/${user.token}`);
      const data = await response.json();
      setResult(data.allPlaces);
      //console.log('result----->', data.allPlaces);
    })();
  }, []);

  // Fonction pour gérer la visibilité du bouton pour chaque élément
  // permet de changer l'état de la visibilité d'un bouton pour un favori spécifique, en fonction de son id
  const toggleButtonVisibility = (id) => {
  // setVisibleButtons utilise une fonction qui prend l'état précédent (prevState) en argument et retourne un nouvel état mis à jour.
  // prevState est l'état précédent de visibleButtons. Cela nous permet de ne pas écraser l'état complet, mais plutôt de mettre à jour une partie de l'objet.
    setVisibleButtons((prevState) => ({
  //...prevState déstructure l'objet prevState et copie toutes ses clés et valeurs dans le nouvel objet retourné.
      ...prevState,
  //prevState[id] récupère la valeur actuelle de la clé correspondant à cet id (soit true si le bouton est visible, soit false si le bouton est caché).
      [id]: !prevState[id],
    }));
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
            <Pressable style={styles.go}><Text style={styles.texteGo}>On y va ?</Text></Pressable>
            <FontAwesome name="close" size={25} color="#525252" />
            <Text style={styles.supp}>On supprime</Text>
          </View>
        )}
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titre}>Favoris</Text>
      <View style={styles.favConteneur}>
        {favoris}
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
  },
  titre: {
    color: "#A23D42",
    fontSize: 40,
    marginTop: "20%",
    marginLeft: '25%',
    marginBottom: '5%',
    height: '10%',
    width: '100%',
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
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    marginTop: '5%',
    paddingLeft: '5%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  nomLieu: {
    color: '#525252',
    fontSize: 21,
    fontWeight: 500,
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
    fontSize: 15,
    fontWeight: 500,
  },
  supp: {
    height: '60%',
    fontSize: 15,
    marginTop: '2%',
    marginLeft: '2%',
    color: '#525252',
  },
});