import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function ContactScreen() {
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.background}>
            <Pressable style={styles.fleche} onPress={() => handleReturn()}><FontAwesome name="arrow-left" size={30} color="#A23D42" textAlign='right'></FontAwesome></Pressable>
       <Text>Contactez-nous par mail sur dogintown@contact.fr</Text>
       <Image/>
       </SafeAreaView>
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
    background: {
      width: "100%",
      height: "100%",
      backgroundColor: "#F7CC99",
    },
    fleche: {
      marginTop: '5%',
      marginLeft: '5%',
    },
  });