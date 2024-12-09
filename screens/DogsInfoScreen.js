import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { upDateUser } from '../reducers/user';


export default function DogsInfoScreen() {
  const user = useSelector((state) => state.user.value);
    return (
      <ImageBackground source={require('../assets/Images/3.png')} style={styles.background}>
      <View style={styles.container}>
        <Text>Votre/vos chien(s)</Text>
        <View style={styles.photoPincipale}>

        </View>
        <Text style={styles.nom}>Nom chien</Text>
        <Text style={styles.race}>Race</Text>
        <Text style={styles.taille}>Taille</Text>
        <StatusBar style="auto" />
      </View>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
      marginTop: '10%',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoPincipale: {
      backgroundColor: 'gray',
      width: 140,
      height: 140,
      borderRadius: 100,
    }
  });