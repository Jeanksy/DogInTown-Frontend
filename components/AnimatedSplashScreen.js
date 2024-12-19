import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';

const AnimatedSplashScreen = () => {
  const animation = useRef(null);
  
      return (
        <View style={{ }}>
           <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/Images/homeScreenImg.png')}/>
                {loaded ? <LottieView
              ref={animation}
                  style={{
                  top: '30%',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F7CC99',
                  }}
                  source={require('../assets/dogSplashLoading.mp4.lottie.lottie')} autoPlay loop /> : <View></View>}      
                  </View>
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

export default AnimatedSplashScreen;