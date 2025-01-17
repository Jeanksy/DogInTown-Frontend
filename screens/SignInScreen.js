import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../reducers/user';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useFonts } from 'expo-font'; // FONT

// Regex email only for input email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignInScreen({ navigation }) {
  // export de la font
    useFonts({
    "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
    "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
    "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorLogIn, setErrorLogIn] = useState(false);

  	// REDUCER *******
	const dispatch = useDispatch();  

  const handleSignIn = () => {
  fetch('https://dog-in-town-backend-three.vercel.app/users/connection', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email, password: password }),
		}).then(response => response.json())
    .then(data => {
      if (!data.result) {
        setErrorLogIn(true);
      }
          
        if (data.result) {
          navigation.replace('TabNavigator', { screen: 'MapScreen' });
          setEmail('');
          setPassword('');
          dispatch(login({username: data.username, token: data.token, postCode: data.postCode}));
				}
			});
	};


  const handleSignUp = () => {
      navigation.navigate('SignUp');
    }


    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.head}>Connexion</Text>
        <View style={styles.connexionCont}>
          <TextInput
              placeholder="Email"
              autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
              keyboardType="email-address" // https://reactnative.dev/docs/textinput#keyboardtype
              textContentType="emailAddress" // https://reactnative.dev/docs/textinput#textcontenttype-ios
              autoComplete="email" // https://reactnative.dev/docs/textinput#autocomplete-android
              onFocus={() => setErrorLogIn(false)}
              onChangeText={(value) => setEmail(value.toLocaleLowerCase().trim())}
              value={email}
              style={styles.input}
          />
             
          <TextInput
              secureTextEntry={true}
				      textContentType="oneTimeCode"
              placeholder="Password"
              onFocus={() => setErrorLogIn(false)}
              onChangeText={(value) => setPassword(value)}
              value={password}
              style={styles.input}
          />

          <TouchableOpacity onPress={() => handleSignIn()} style={styles.signInBtn} activeOpacity={0.8}>  
            <Text style={styles.clickableBtn}>Connexion</Text>
          </TouchableOpacity>
          {errorLogIn ? <Text style={styles.error}>User or password incorrect</Text> : <View></View>}
        </View>
        
         <TouchableOpacity onPress={() => handleSignUp()} style={styles.signUpBtn} activeOpacity={0.8}>
           <Text style={styles.clickableBtn}>Inscription</Text>
         </TouchableOpacity>
         <StatusBar style="auto" />
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#97C7DE',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    head: {
      color: '#fff',
      fontSize: 40,
    },
    connexionCont: {
      marginTop: '-15%',
      flex: 0,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    clickableBtn: {
      color: '#fff',
      fontWeight: 700,
      fontSize: 20,
    },
    title: {
      fontSize: 40,
      fontFamily: 'LeagueSpartan-Bold',
      marginBottom: 20
    },
    input: {
      color: '#000',
      flex: 0,
      textAlign: 'center',
      width: '80%',
      backgroundColor: '#fff',
      height: 50,
      borderRadius: 20,
      fontSize: 16,
    },
    signInBtn: {
      flex: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#A23D42",
      width: '80%',
      height: 50,
      borderRadius: 20,
      shadowColor: "black",
      shadowOpacity: 0.5,
      elevation: 1,
      shadowRadius: 1,
      shadowOffset: { width: 1, height: 4 },
      borderWidth: 0,
    },
    signUpBtn: {
      flex: 0,
      flexDirection: "row",
      marginTop: '-15%',
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#A23D42",
      width: '80%',
      height: 50,
      borderRadius: 20,
      shadowColor: "black",
      shadowOpacity: 0.5,
      elevation: 1,
      shadowRadius: 1,
      shadowOffset: { width: 1, height: 4 },
      borderWidth: 0,
    },
    textButton: {
      fontFamily: 'LeagueSpartan-Regular',
      height: 30,
      fontSize: 16,
    },
    error: {
      marginTop: 10,
      color: 'red',
    },
  
  });