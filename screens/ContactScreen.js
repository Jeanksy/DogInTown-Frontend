import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, Pressable, TextInput, TouchableOpacity,TouchableWithoutFeedback, Keyboard  } from 'react-native';
import { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFonts } from 'expo-font'; // FONT


export default function ContactScreen({navigation}) {
   // export de la font
      useFonts({
      "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
      "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
      "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
      "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
      });
  // Etats
  const [message, setMessage] = useState('') //Input 
  const [merci, setMerci] = useState(false) // message de confirmation message envoyé
  const handleReturn = () => {
		navigation.navigate('Options');
	}

  const send = () => {
    setMessage('')
    setMerci(true)
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.background}>
            <Pressable style={styles.fleche} onPress={() => handleReturn()}><FontAwesome name="arrow-left" size={30} color="#A23D42" textAlign='right'></FontAwesome></Pressable>
        <View style={styles.contenuTexte}>
          <FontAwesome name='envelope' color='#FCE9D8' size={80}/>
          <Text style={styles.texte}>Contactez-nous via le formulaire ci-dessous</Text>
          <TextInput
                      placeholder="Ecrivez votre message ici"
                      onChangeText={(value) => setMessage(value)}
                      value={message}
                      style={styles.encadreBlanc}
                      multiline
                      returnKeyType="done" // bouton 'terminé/done' sur le clavier
                      blurOnSubmit={true} //pour fermer le keyboard après avoir appuyé sur 'done'
                    />
          <TouchableOpacity style={styles.bouton} onPress={() => send()}>
            <Text style={styles.textSend}>Envoyer</Text>
          </TouchableOpacity>
          {merci && <Text style={styles.confirmation}>Message bien envoyé, merci !</Text>}
        </View>
       </SafeAreaView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    background: {
      width: "100%",
      height: "100%",
      backgroundColor: "#F7CC99",
    },
    contenuTexte: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    fleche: {
      marginTop: '5%',
      marginLeft: '5%',
      alignSelf: 'Left',
    },
    titre: {
      fontSize: 40,
      fontWeight: '600',
      color: '#A23D42',
      marginTop: '5%',
    },
    texte: {
      fontSize: 25,
      textAlign: 'center',
      marginTop: '5%',
      marginLeft: '5%',
      marginRight: '5%',
      color: '#A23D42',
      fontFamily: 'LeagueSpartan-Light',
    },
    encadreBlanc: {
      marginTop: '5%',
      height: '40%',
      width: '80%',
      borderRadius: 15,
      backgroundColor: 'white',
      padding: '5%',
    },
    bouton: {
      backgroundColor: "#A23D42",
      width: "80%",
      height: "10%",
      justifyContent: 'center',
      borderRadius: 20,
      marginTop: '5%',
      alignItems: 'center',
    },
    textSend: {
      color: 'white',
      fontSize: 18,
      fontFamily: 'LeagueSpartan-Medium',
    },
    confirmation: {
      marginTop: '2%',
    }
  });