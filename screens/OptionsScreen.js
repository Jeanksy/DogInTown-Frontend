import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
      <Text style={styles.titre}>Options</Text>
      <TouchableOpacity style={styles.blocSelection1} onPress={() => handleDog()}>
        <Image style={styles.image} source={require('../assets/Images/moyen.png')} />
        <Text>Votre/vos chien(s)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blocSelection2} onPress={() => handleUser()}>
        <FontAwesome name='gears' color='white' size={50}/>
        <Text>Parametres du compte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blocSelection3} onPress={() => handleContact()}>
        <FontAwesome name='envelope' color='#97C7DE' size={50}/>
        <Text>Nous contacter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blocSelection4} onPress={() => handleLogout()}>
        <FontAwesome name='go' color='white' size={50}/>
        <Text>Deconnection</Text>
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
    justifyContent: 'center',
  },
  titre: {
    flex: 1,
    fontSize: 40,
    fontWeight: '600',
    color: '#A23D42',
    marginTop: '15%',
    marginBottom: '2%',
  },
  blocSelection1: {
    width: '75%',
    height: '10%',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '4%',
    backgroundColor: '#F7CC99',
  },
  blocSelection2: {
    width: '75%',
    height: '10%',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '4%',
    backgroundColor: '#97C7DE',
  },
  blocSelection3: {
    width: '75%',
    height: '10%',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '4%',
    backgroundColor: '#FCE9D8',
  },
  blocSelection4: {
    width: '75%',
    height: '10%',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '8%',
    backgroundColor: '#A23D43',
  },
  image: {
    width: '25%',
    height: '65%',
    marginRight: '10%',
  },
});