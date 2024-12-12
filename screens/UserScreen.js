import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal, Image } from 'react-native';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { login, AddPhotoChien } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function UserScreen() {
  // Etat de la modal 
  const [modalIsVisible, setModalIsVisible] = useState(false);
  // Etat changement de pseudo
  const [newUser, setnewUser] = useState('');
  // REDUCER
  const user = useSelector((state) => state.user.value);


  return (
    <View style={styles.background}>
      {/* Zone d'affichage standard page */}
      <View style={styles.container}>
        <Image style={styles.photoPincipale} source={{uri : user.photo}}/>
        <Text style={styles.nom}>Modifiez votre profil ici !</Text>
        <TouchableOpacity style={styles.bouton} onPress={()=>setModalIsVisible(true)}><Text style={styles.texteBouton}>Modifier mon pseudo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon email</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bouton}><Text style={styles.texteBouton}>Modifier mon mot de passe</Text></TouchableOpacity>
      </View>

      {/* Zone des modales */}
      <Modal
        style={styles.modal}
        animationType="fade"
        transparent={true}
        visible={modalIsVisible}>
        <View style={styles.contenuModalUsername}>
          <View style={styles.close} onPress={() => setModalIsVisible(false)}>
            <FontAwesome name="close" size={20} color="gray" />
          </View>
          <Text style={styles.petitTexte}>Pseudo actuel : {user.username}</Text>
          <View style={styles.encadreBlanc}><Text>{user.username}</Text></View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7CC99',
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
    marginTop: '4%',
  },
  // MODAL
  contenuModalUsername: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    height: '80%',
    margin: '10%',
    marginTop: '18%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  encadreBlanc: {
    borderWidth: 1,
    width: '70%',
    height: '10%',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  petitTexte: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
