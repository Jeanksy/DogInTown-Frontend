import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Platform, SafeAreaView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { login, AddPhotoChien } from '../reducers/user';
import { upDateUser } from '../reducers/user';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'


export default function DogsInfoScreen() {
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  const [nombreDoggies, setNombreDoggies] = useState("");
  
  const doggies = [
    { name: 'Lala' },
    { name: 'Lola' },
    { name: 'Lolo' },
  ];

  const handleRetour = () => {
    navigation.navigate('TabNavigator', { screen: 'Options' })
  };
  
  // affiche un text différent dans le JSX selon le nombre de chiens
  useEffect(() => {
    if (doggies.length === 1) {
      setNombreDoggies(<Text style={styles.dogsTitle}>Mon chien</Text>);
    } else if (doggies.length >= 2) {
      setNombreDoggies(<Text style={styles.dogsTitle}>Mes chiens</Text>);
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
              <Text style={{fontSize: 17, fontWeight: 700,}}>Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          

          <View>
            {nombreDoggies} 
          </View>
          <View style={styles.dogListCont}>
            {doggies && doggies.length > 0 && doggies.map((doggies, index) => (
              <View style={{alignItems: 'center', gap: '5%'}}>
              <TouchableOpacity key={index} style={[styles.dogListCircle, styles.shadow]}>
                  <Image style={{height: '100%', borderRadius: '100%'}} source={{uri: 'https://i.imgur.com/5A0WEmE.jpeg',}}/>
              </TouchableOpacity>
              <Text style={{fontSize: 14, fontWeight: 600,}}>dog name</Text>
              </View>
                    )
            )}

            {doggies && doggies.length < 4 &&
              <View style={{alignItems: 'center', gap: '5%'}}> 
                <TouchableOpacity style={[styles.dogListAdd, styles.shadow]}>
                  <Text style={{ fontSize: 40, fontWeight: 600, color: 'white'}} >+</Text>
                </TouchableOpacity>
              <Text style={{fontSize: 14, fontWeight: 600,}}>Add a dog</Text>
              </View>
            }
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
    shadow: {
      shadowColor: "black",
      shadowOpacity: 0.5,
      elevation: 2,
      shadowRadius: 1,
      shadowOffset: { width: 1, height: 4 },
      borderWidth: 0,
    },
    mainContainer: {
      height: '90%',
      alignItems: 'center',
      justifyContent: 'space-around',
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
      shadowOpacity: 0.5,
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
      fontSize: 22,
      fontWeight: 700,
    },

    // AFFICHAGE DOGS
    dogListCont: {
      justifyContent: 'center',
      flexDirection: 'row',
      height: '20%',
      width: '100%',
      gap: '2%',
      overflow: 'clip',
    },
    dogListCircle: {
      height: '60%',
      aspectRatio: 1 / 1,
      backgroundColor: 'red',
      borderRadius: 100,
    }, 
    dogListAdd: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '60%',
      aspectRatio: 1 / 1,
      backgroundColor: '#F7CC99',
      borderRadius: 100,
    },
  });