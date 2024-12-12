import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { login, AddPhotoChien } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function UserScreen() {
  const user = useSelector((state) => state.user.value);
  // ****MODAL USERNAME***
  //Etat de la modal 
  const [modalIsVisible, setModalIsVisible] = useState(false);
  // Etat changement de pseudo -> new username // pour le input
  const [newUser, setnewUser] = useState('');

    return (
      <ImageBackground source={require('../assets/Images/2.png')} style={styles.background}>
        {/*Zone des modales */}
        <Modal
        style={styles.modal}
        animationType="fade"
			  transparent={true}
			  visible={modalIsVisible}
			  onRequestClose={() => {setModalIsVisible(!modalIsVisible);}}>
          <View style={styles.contenuModalUsername}>
              <View style={styles.close}><FontAwesome name="close" size={20} color="gray" /></View>
              <Text style={styles.petitTexte}>Pseudo actuel</Text>
              <view style={encadreBlanc}><Text>{user.username}</Text></view>
          </View>
        </Modal>
        {/*zone affichage standard page */}
        <View style={styles.container}>
        <Image style={styles.photoPincipale} source={{uri : user.photo}}/>
        <Text style={styles.nom}>Modifiez votre profil ici !</Text>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton} onpresse={setModalIsVisible(true)}>Modifier mon pseudo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon email</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon mot de passe</Text></TouchableOpacity>
      </View>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoPincipale: {
      backgroundColor: 'gray',
      width: 180,
      height: 180,
      borderRadius: 100,
    },
    nom: {
      color: '#A23D42',
      fontSize: 20,
      marginTop: '5%',
      marginBottom: '8%',
    },
    bouton: {
      backgroundColor: '#A23D42',
      width: '80%',
      height: '8%',
      borderRadius: 20,
      marginBottom: '3%',
    },
    texteBouton: {
      color: 'white',
      textAlign: 'center',
      fontSize: 18,
      marginTop: '4%'
    },
    // MODAL
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contenuModalUsername: {
      backgroundColor: 'white',
      width: '80%',
      height: '60%',
    },
    encadreBlanc: {
      borderWidth: 1,
      width: '70%',
      height: '10%',
    }
  });