import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Container } from '../components/Container';
import { Input } from 'react-native-elements';
import axios from 'axios';
import { Styles } from '../components/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_LOGIN } from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    if (!username || username.length < 4) {
      return alert('Usuario minimo 4 caracteres');
    }
    if (!password || password.length < 6) {
      return alert('Contraseña minimo 6 caracteres');
    }

    let response = null;
    try {
      response = await axios({
        method: 'post',
        url: API_LOGIN,
        data: {
          username,
          password,
        },
      });
    } catch (e) {
      return Alert.alert(
        'Login erroneo',
        'Usuario o contraseña incorrecta',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      );
    }
    try {
      if (response.status === 201) {
        await AsyncStorage.setItem('token', response.data.data.payload.token);
        await AsyncStorage.setItem(
          'refresh_token',
          response.data.data.payload.refresh_token,
        );

        Alert.alert(
          'Login',
          'Autenticación exitosa',
          [
            {
              text: 'Ok',
              onPress: () => navigation.replace('HomeScreen'),
            },
          ],
          { cancelable: false },
        );
      }
    } catch (e) {
      Alert.alert(
        'Error',
        'Ha ocurrido un error inesperado...',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={Styles.formContainer}>
          <View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <KeyboardAvoidingView>
                <Text style={Styles.label}>Usuario</Text>
                <Input
                  placeholder="Ingrese su usuario:"
                  selectionColor="black"
                  autoCapitalize="none"
                  onChangeText={username => setUsername(username.toLowerCase())}
                  value={username}
                />

                <Text style={Styles.label}>Contraseña</Text>
                <Input
                  placeholder="Ingrese su contraseña:"
                  secureTextEntry
                  selectionColor="black"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={password => setPassword(password)}
                  value={password}
                />

                <View style={Styles.buttonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={Styles.button}
                    onPress={loginUser}>
                    <Text style={Styles.buttonText}>Iniciar Sesión</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Container>
  );
};

export default LoginScreen;
