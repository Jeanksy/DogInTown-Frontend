import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SignInScreen({navigation}) {

  const handleSignIn = () => {
    navigation.navigate('TabNavigator');
  }

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  }




    return (
      <View style={styles.container}>
        <Text>Choose sign in or sign up screen</Text>
        <TouchableOpacity onPress={() => handleSignIn()}>
          <Text>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSignUp()}>
          <Text>Inscription</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });