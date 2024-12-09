import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DogSignUpScreen({navigation}) {

  const handleDogSignup = () => {
    navigation.navigate('TabNavigator');
  }



    return (
      <View style={styles.container}>
        <Text>dog info après inscription</Text>
        <TouchableOpacity onPress={() => handleDogSignup()}>
            <Text>continuer</Text>
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
  });