import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function OptionsScreen({navigation}) {

  const handleDog = () => {
    navigation.navigate('DogsInfo');
  }

  const handleUser = () => {
    navigation.navigate('User');
  }

  const handleContact = () => {
    navigation.navigate('Contact');
  }

  const handleLogout = () => {
    navigation.navigate('SignIn');
  }


  return (
    <View style={styles.container}>
      <Text>Ici les options</Text>
      <TouchableOpacity onPress={() => handleDog()}>
        <Text>Modifier chiens</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleUser()}>
        <Text>Parametre de compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleContact()}>
        <Text>Nous contacter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Text>Logout</Text>
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