import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function MapScreen() {
  // etat du input recherches
  const [recherches, setRecherches] = useState('');
  // etat modal
  const [modalVisible, setModalVisible] = useState(false);

    return (
      <View style={styles.container}>
      <View style={styles.blocRecherches}>
          <FontAwesome name='sliders' color='#525252' style={styles.icons}/>
          <TextInput   
          style={styles.recherches} 
          placeholder='Recherches'  
          onChangeText={(value) => setRecherches(value)}
          value={recherches}
          />
          <FontAwesome name='magnifying-glass' color='#525252' style={styles.icons}/>
      </View>
      <View style={styles.blocMap}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}> 
            <View style={styles.contenuModal}>
              <View style={styles.fenetre}>
                <View style={styles.top}>
                  <View style={styles.blocTexte}>
                    <Text>Café 203</Text>
                    <Text>21 avis</Text>
                    <Text>café - restaurant</Text>
                    <Text>chiens de toutes tailles acceptés</Text>
                  </View>
                  <View style={styles.blocBouton}>
                  <FontAwesome name='xmark' color='#525252' size={25}/>
                  <FontAwesome name='share-nodes' color='#525252' size={25}/>
                  </View>
                </View>
                <View style={styles.comment}>
                  <Text>texte comentaires</Text>
                </View>
                <View style={styles.buttons}>
                  <View style={styles.buttonInsert}></View>
                  <View style={styles.buttonFavoris}></View>
                </View>
              </View>
            </View>
        </Modal>
      </View>
      <View style={styles.zoneBouton}>
        <TouchableOpacity style={styles.boutonPatoune}>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
  </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#97C7DE',
  },
  blocRecherches:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      width: '85%',
      marginTop: '10%',
  },
  recherches: {
      width: '70%',
      height: '100%',
      marginLeft: '3%',
      marginRight: '3%',
  },
  icons: {
      fontSize: 22,
  },
  blocMap: {
      flex: 8,
      width: '100%',
  },
  zoneBouton: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
  },
  boutonPatoune: {
      width: 80,
      height: 80,
      borderRadius: 50,
      backgroundColor: '#F7CC99',
  },
  /// STYLE MODAL ////
  contenuModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  fenetre: {
    backgroundColor: 'white',
    width: '90%',
    height: '75%',
    borderRadius: 20,
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '30%',
  },
  blocTexte: {
    width: '70%',
    marginTop: '5%',
    marginLeft: '5%',
  },
  blocBouton: {
    marginLeft: '15%',
    marginTop: '5%',
  },
  comment: {
    flex: 1,
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '30%',
  },
  buttonInsert: {
    width: '70%',
  },
  });