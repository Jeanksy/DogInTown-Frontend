import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

export default function HomeScreen({ navigation }) {
   const animation = useRef(null);
  
   const handleSignIn = () => {
    navigation.navigate('SignIn');
  }


  
      return (
        <View style={{}}>
          <Pressable onPress={() => handleSignIn()}>
           <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/Images/homeScreenImg.png')} />
                <LottieView
                  ref={animation}
              style={{
                  top: '30%',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F7CC99',
                  }}
                  source={require('../assets/dogSplashLoading.mp4.lottie.lottie')} autoPlay loop />      
            </View>
            </Pressable>
        </View>

  // useEffect(() => {
  //   // Démarrer un timer qui navigue après 4 secondes
  //   const timer = setTimeout(() => {
  //     navigation.navigate('SignIn');
  //   }, 500);

  //   // Cleanup pour annuler le timer si le composant est démonté avant les 2 secondes
  //   return () => clearTimeout(timer);
  // }, [navigation]);

  
  // return (
  //   <View style={styles.container}>
  //     <ImageBackground style={styles.image} source={require('../assets/Images/homeScreenImg.png')}>
  //     {/* <Pressable onPress={() => handleSignIn()}>
  //       <Text>Home Screen</Text>
  //     </Pressable>
  //     <StatusBar style="auto" /> */}
  //     </ImageBackground>
  //   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7CC99',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    bottom: '5%',
    zIndex: 30,
    width: '100%',
    height: '100%',
  }
});