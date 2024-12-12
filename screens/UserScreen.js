import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { login, AddPhotoChien } from '../reducers/user';


export default function UserScreen() {
  const user = useSelector((state) => state.user.value);
    return (
      <ImageBackground source={require('../assets/Images/2.png')} style={styles.background}>
      <View style={styles.container}>
        <Text>Votre Profil</Text>
        <View style={styles.photoPincipale}>

        </View>
        <Text style={styles.nom}>Bienvenu sur votre profil {user.username} !</Text>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon pseudo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon email</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon mot de passe</Text></TouchableOpacity>
      </View>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
      marginTop: '10%',
    },
    container: {
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
    bouton: {
      backgroundColor: '#A23D42',
      width: '80%',
      height: '8%',
      borderRadius: 20,
      marginBottom: '3%',
    },
    texteBouton: {
      color: 'white',
      textAlign: 'center',
    }
  });