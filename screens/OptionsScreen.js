import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { logout } from '../reducers/user';
import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font'; // FONT

export default function OptionsScreen({navigation}) {
  // export de la font
    useFonts({
    "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
    "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
    "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    });

  // REDUCER
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
  // etat modal
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(true)
  }

  const handleDeconnection = () => {
    dispatch(logout(user))
    setModalVisible(false)
    navigation.navigate('SignIn');
  }

  

  return (
    <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}> 
            <View style={styles.modalConteneur}>
                <View style={styles.modalLogout}>
                    <Image style={styles.imagemodal} source={require('../assets/Images/Frame8.png')}/>
                    <Text style={styles.textedeco}>Souhaitez-vous vraiment vous deconnecter ?</Text>
                    <TouchableOpacity style={styles.ouiB} onPress={() => handleDeconnection()}><Text style={styles.texteBlanc}>Oui</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.nonB} onPress={() => setModalVisible(false)}><Text style={styles.texteB}>Non</Text></TouchableOpacity>
                </View>
            </View>
        </Modal>

        <Text style={styles.titre}>Options</Text>
        <TouchableOpacity style={[styles.blocSelection1, styles.shadowBtn]} onPress={() => handleDog()}>
            <Image style={styles.imageDog} source={require('../assets/Images/moyen.png')} />
            <Text style={styles.texteTitre}>Votre/vos chien(s)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.blocSelection2, styles.shadowBtn]} onPress={() => handleUser()}>
            <FontAwesome name='gears' color='white' size={50} marginRight='6%'/>
            <Text style={styles.texteTitre}>Parametres du compte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.blocSelection3, styles.shadowBtn]} onPress={() => handleContact()}>
            <FontAwesome name='envelope' color='#97C7DE' size={50} marginRight='19%'/>
            <Text style={styles.texteTitre}>Nous contacter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.blocSelection4, styles.shadowBtn]} onPress={() => handleLogout()}>
            <Image style={styles.imageDeco} source={require('../assets/Images/Frame8.png')}/>
            <Text style={styles.texteTitreB}>Deconnection</Text>
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
  shadowBtn: {
    shadowColor: "black",
    shadowOpacity: 0.5,
    elevation: 2,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 4 },
    borderWidth: 0,
  },
  titre: {
    flex: 1,
    fontSize: 40,
    color: '#A23D42',
    marginTop: '20%',
    fontFamily: 'LeagueSpartan-Medium',
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
  imageDog: {
    width: '25%',
    height: '65%',
    marginRight: '10%',
    transform: [{ scaleX: -1 }],
  },
  imageDeco: {
    width: '25%',
    height: '65%',
    marginRight: '20%',
    transform: [{ scaleX: -1 }],
  },
  texteTitre: {
    fontFamily: 'LeagueSpartan-Light',
    fontSize: 19,
  },
  texteTitreB: {
    fontFamily: 'LeagueSpartan-Light',
    fontSize: 19,
    color: 'white',
  },
  ////// Modal ////
  modalConteneur: {
    flex: 1,
    height:'100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20%',
    marginBottom: '2%',
  },
  modalLogout: {
    backgroundColor: '#A23D43',
    borderRadius: 30,
    height: '76%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10%',
  },
  textedeco: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: '5%',
    fontFamily: 'LeagueSpartan-Light',
  },
  ouiB: {
    width: '30%',
    height: '10%',
    marginBottom: '5%',
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nonB: {
    width: '30%',
    height: '10%',
    backgroundColor: 'white',
    marginBottom: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteB: {
    fontSize: 20,
    fontFamily: 'LeagueSpartan-Regular',
    color: '#525252',
  },
  texteBlanc: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'LeagueSpartan-Regular',
  },
});