import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';
import DogsInfoScreen from './screens/DogsInfoScreen';
import DogSignUpScreen from './screens/DogSignUpScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import MapScreen from './screens/MapScreen';
import OptionsScreen from './screens/OptionsScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import UserScreen from './screens/UserScreen';
import CommentsScreen from './screens/CommentsScreen';
import FeedbackScreen from './screens/FeedbackScreen';

// REDUCER
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';

const store = configureStore({
  reducer: { user },
});



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarStyle: {
        height: 70,
        justifyContent: 'center',
        backgroundColor: 'white', 
        borderTopWidth: 0,
      },
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Map') {
          iconName = 'location-arrow';
        } else if (route.name === 'Favoris') {
          iconName = 'bookmark';
        } else if (route.name === 'Options') {
          iconName = 'gear';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#A23D42',
      tabBarInactiveTintColor: '#525252',
      headerShown: false,
    })}>
      <Tab.Screen name="Map" component={MapScreen} options={{tabBarLabel: () => null}}/>
      <Tab.Screen name="Favoris" component={FavoritesScreen} options={{tabBarLabel: () => null}}/>
      <Tab.Screen name="Options" component={OptionsScreen} options={{tabBarLabel: () => null}}/>
    </Tab.Navigator>
  );
};

export default function App() {

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="DogSignUp" component={DogSignUpScreen} />
            <Stack.Screen name="DogsInfo" component={DogsInfoScreen} />
            <Stack.Screen name="User" component={UserScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
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
