import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';

export default function HomeScreen({navigation}) {
  useEffect(() => {
    // Démarrer un timer qui navigue après 4 secondes
    const timer = setTimeout(() => {
      navigation.navigate('SignIn');
    }, 500);

    // Cleanup pour annuler le timer si le composant est démonté avant les 2 secondes
    return () => clearTimeout(timer);
  }, [navigation]);

  // const handleSignIn = () => {
  //   navigation.navigate('SignIn');
  // }


  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={require('../assets/Images/homeScreenImg.png')}>
      {/* <Pressable onPress={() => handleSignIn()}>
        <Text>Home Screen</Text>
      </Pressable>
      <StatusBar style="auto" /> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7CC99',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  }
});