import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Image,
  Pressable
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function DogSignUpScreen({ navigation }) {

  const userToken = 'RL01aqaWnQNXi24mX3fPzEIONIMIMx6H';
  const photo = 'photo.png';

  const [dogName, setDogName] = useState('');
  const [dogSize, setDogSize] = useState('')
  const [selectedRace, setSelectedRace] = useState();

  // Fonction pour naviguer vers le Tab menu
  const handleDogSignup = async (dogResiter) => {
    if (!dogResiter) {
      navigation.navigate('TabNavigator');
    } else {
      const response = await fetch(`http://192.168.4.153:3000/users/dog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userToken: userToken, name: dogName, race: selectedRace, photo: photo, size: dogSize }),
      })
      navigation.navigate('TabNavigator');
    }
  }

  //Fonction pour sélectionner la taille du chien et changé la couleur de l'image selectionné
  const handleDogSize = (size) => {
    setDogSize(size);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.upperContent}>
          <View style={styles.leaveContainer}>
            <Pressable onPress={() => handleDogSignup(false)}>
              <View style={styles.textContainer}>
                <Text style={styles.leaveText}>Plus tard</Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Et si vous nous parliez de votre chien ?</Text>
          </View>
        </View>
        <View style={styles.dogsInfo}>
          <View style={styles.textInputContainer} elevation={5}>
            <TextInput
              style={styles.textInput}
              placeholder="Nom"
              onChangeText={(value) => setDogName(value)}
              value={dogName} />
          </View>
          <View style={styles.pickerContainer} elevation={5}>
            <Picker
              selectedValue={selectedRace}
              style={styles.pickerInput}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRace(itemValue)
              }>
              <Picker.Item label="Race" value="Race" />
              <Picker.Item label="Labrador" value="Labrador" />
              <Picker.Item label="Golden Retriever" value="Golden" />
            </Picker>
          </View>
        </View>
        <View style={styles.dogSize}>
          <View style={styles.sizeTextContainer}>
            <Text style={styles.dogSizeText}>Taille:</Text>
          </View>
          <View style={styles.dogSizeCardContainer}>
            <Pressable style={styles.dogSizeCard} onPress={() => handleDogSize('petit')}>
              <View style={styles.dogSizeCard}>
                <Image style={styles.imageSmall} source={require('../assets/Images/petit.png')} />
                <Text>Petit</Text>
              </View>
            </Pressable>
            <Pressable style={styles.dogSizeCard} onPress={() => handleDogSize('moyen')}>
              <View style={styles.dogSizeCard}>
                <Image style={styles.imageMid} source={require('../assets/Images/moyen.png')} />
                <Text>Moyen</Text>
              </View>
            </Pressable>
            <Pressable style={styles.dogSizeCard} onPress={() => handleDogSize('grand')}>
              <View style={styles.dogSizeCard}>
                <Image style={styles.imageBig} source={require('../assets/Images/grand.png')} />
                <Text>Grand</Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.dogPicture}>
          <Text style={styles.dogPictureText}>Voulez-vous rajouter une photo ?</Text>
          <View style={styles.dogAvatar}>
            <FontAwesome name='camera' size={40} color='#A23D42' />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => handleDogSignup(true)}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 15,
  },
  upperContent: {
    width: '100%',
    paddingTop: 30,
  },
  leaveContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // backgroundColor: '#5B1A10',
    width: 80,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    color: '#5B1A10',
    textAlign: 'center',
  },
  dogsInfo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  textInputContainer: {
    width: '80%',
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    fontSize: 18,
    paddingHorizontal: 15,
  },
  pickerContainer: {
    width: '80%',
    height: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pickerInput: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    fontSize: 18,
  },
  dogSize: {
    height: 130,
    // backgroundColor: 'orange',
    marginVertical: 10,
  },
  dogSizeText: {
    marginLeft: 8,
    fontSize: 20,
    color: '#5B1A10',
  },
  dogPicture: {
    height: 310,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // backgroundColor: 'red',
    marginTop: 20,
  },
  sizeTextContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'puprle',
  },
  dogSizeCardContainer: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    // backgroundColor: 'yellow',
  },
  dogSizeCard: {
    alignItems: 'center',
  },
  imageSmall: {
    maxHeight: 40,
    maxWidth: 40,
  },
  imageMid: {
    maxHeight: 50,
    maxWidth: 50,
  },
  imageBig: {
    maxHeight: 100,
    maxWidth: 100,
  },
  dogAvatar: {
    height: 150,
    width: 150,
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#5B1A10',
  },
  dogPictureText: {
    fontSize: 25,
    color: '#5B1A10',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: 50,
    backgroundColor: '#A23D42',
    borderRadius: 18,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 700,
  },
  leaveText: {
    color: '#5B1A10',
    fontSize: 18,
    // fontWeight: 600,
  }
});
