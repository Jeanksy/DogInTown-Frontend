import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SignUpScreen({ navigation }) {



  const handleSignUp = () => {
    navigation.navigate('DogSignUp');
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleSignUp()}>
        <Text>Inscrivez vous</Text>
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