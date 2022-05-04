import * as React from 'react';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { StatusBar } from 'react-native';
import MoviesScreen from './src/screens/MoviesScreen';

const Stack = createStackNavigator();

const App = () => {
  const [hidden, setHidden] = useState(false);

  StatusBar.setHidden(true);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'Inicio',
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Inicio de sesión',
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="MoviesScreen"
          component={MoviesScreen}
          options={{
            title: 'Peliculas populares',
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
