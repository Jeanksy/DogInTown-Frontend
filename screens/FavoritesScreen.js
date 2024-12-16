import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, 	Image, Pressable, SafeAreaView, TouchableOpacity} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function FavoritesScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titre}>Favoris</Text>
        <View style={styles.favConteneur}>
            <TouchableOpacity style={styles.blocFav}>
              <Text style={styles.nomLieu}>Café 203</Text>
            </TouchableOpacity>
              <View style={styles.blocClic}>
                  <Pressable style={styles.go}><Text style={styles.texteGo}>On y va ?</Text></Pressable>
                  <FontAwesome name="close" size={25} color="#525252"/> <Text style={styles.supp}>On supprime</Text>
              </View>
            <TouchableOpacity style={styles.blocFav}></TouchableOpacity>
            <TouchableOpacity style={styles.blocFav}></TouchableOpacity>
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
      marginTop: "25%",
      marginLeft: '25%',
      height: '10%',
      width: '100%',
    },
    favConteneur: {
      height: '90%',
      width: '100%',
      justifyContent: 'top',
      alignItems: 'center',
    },
    blocFav: {
      backgroundColor: 'white',
      width: '80%',
      height: '10%',
      justifyContent: 'center',
      marginTop: '5%',
      paddingLeft: '5%',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
    },
    nomLieu: {
      color: '#525252',
      fontSize: 25,
      fontWeight: 500,
    },
    //// bloc au clic sur la Touchable Opacity
    blocClic: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'start',
      alignItems: 'center',
      width: '80%',
      height: '8%',
      marginBottom: '2%',
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
      height:'50%',
      fontSize: 15,
      marginTop: '2%',
      marginLeft: '2%',
      color: '#525252',
    },
  });