import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function HomeScreen({navigation}) {


  const handleSignIn = () => {
    navigation.navigate('SignIn');
  }


  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleSignIn()}>
        <Text>Home Screen</Text>
      </Pressable>
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