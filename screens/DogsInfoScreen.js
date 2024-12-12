import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, Platform, SafeAreaView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
import { login, AddPhotoChien } from '../reducers/user';
=======
import { upDateUser } from '../reducers/user';
import { useState, useEffect } from 'react';
>>>>>>> frontDogPage


export default function DogsInfoScreen() {
  const user = useSelector((state) => state.user.value);
  const [nombreDoggies, setNombreDoggies] = useState("")
  
  const doggies = [];

  const handleRetour = () => {
    console.log("Pouet gros")
  };
  

  useEffect(() => {
    if (doggies.length === 1) {
      setNombreDoggies(<Text style={styles.dogsTitle}>Votre chien</Text>);
    } else if (doggies.length >= 2) {
      setNombreDoggies(<Text style={styles.dogsTitle}>Vos chiens</Text>);
    } else {
      setNombreDoggies(<Text style={styles.dogsTitle}>Ajouter un chien</Text>);
    };
  }, [])
  
  


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.retourContainer}>
          <TouchableOpacity style={styles.retourBtn} onPress={() => handleRetour()}>
              <Text>Retour</Text>
          </TouchableOpacity>
          
        </View>
        <View style={styles.mainContainer}>

          <View>
            {nombreDoggies}
          </View>
          <View style={styles.photoPincipale}>
          

          </View>
          <Text style={styles.nom}>Nom chien</Text>
          <Text style={styles.race}>Race</Text>
          <Text style={styles.taille}>Taille</Text>
          <StatusBar style="auto" />
        
        </View>
      </SafeAreaView >
    </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    safeArea: {
      paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoPincipale: {
      backgroundColor: 'gray',
      width: 140,
      height: 140,
      borderRadius: 100,
    },
    retourBtn: {
      flex: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F7CC99",
      width: "30%",
      height: 50,
      borderRadius: 10,
      shadowColor: "black",
      shadowOpacity: 0.4,
      elevation: 2,
      shadowRadius: 1,
      shadowOffset: { width: 1, height: 4 },
      borderWidth: 0,
    },
    retourContainer: {
      flex: 0,
      alignItems: 'flex-end',
      marginRight: '3%',
    },
    dogsTitle: {
      color: 'black',
    },
  });