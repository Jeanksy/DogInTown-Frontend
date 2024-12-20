import { StyleSheet, View, Pressable, Image, Platform } from 'react-native';
import React, { useRef } from 'react';
import LottieView from 'lottie-react-native';

export default function HomeScreen({ navigation }) {
   const animation = useRef(null);
  
   const handleSignIn = () => {
    navigation.navigate('SignIn');
  }

  const source = Platform.OS === 'android'
  ? require('../assets/dogSplashLoading.mp4.lottie.json')  // Source pour Android
  : require('../assets/dogSplashLoading.mp4.lottie.lottie'); // Source pour iOS

  
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
                  source={source} autoPlay loop />      
            </View>
            </Pressable>
        </View>

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