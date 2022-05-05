import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { Styles } from '../components/Styles';
import { API_REFRESH_TOKEN, API_USER_ME } from '../utils/api';

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState({
    activeUser: null,
  });

  const getUsers = async () => {
    try {
      const asyncToken = await AsyncStorage.getItem('token');
      console.log('token valido', asyncToken);
      const respUser = await axios({
        method: 'get',
        url: API_USER_ME,
        headers: {
          Authorization: `Bearer ${asyncToken}`,
        },
      });
      setData({
        activeUser: respUser.data.data,
      });
    } catch (e) {
      checkToken();
    }
  };
  const checkToken = async () => {
    try {
      const refresh_token = await AsyncStorage.getItem('refresh_token');

      const respToken = await axios({
        method: 'post',
        url: API_REFRESH_TOKEN,
        data: {
          refresh_token,
        },
      });
      await AsyncStorage.removeItem('token');
      await AsyncStorage.setItem('token', respToken.data.data.payload.token);

      await getUsers();
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

  useEffect(() => {
    getUsers();
  }, []);

  const logOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',

      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Cerrar sesión', onPress: () => loggingOut() },
      ],
    );
  };
  const loggingOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refresh_token');
      navigation.replace('Login');
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
  const firstName = data.activeUser?.firstName;
  const lastName = data.activeUser?.lastName;

  return (
    <>
      <View style={styles.mainBg}>
        <Text
          style={{
            fontSize: 16,
            color: '#fff',
            marginTop: 30,
            marginLeft: 20,
            fontWeight: 'bold',
          }}>
          Hola,
          <Text style={{ color: '#7DD329', fontSize: 18 }}>
            {' '}
            {firstName} {lastName}
          </Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={logOut}>
          <Text style={{ color: 'white' }}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Image source={require('../assets/logo.png')} style={styles.imgStyle} />
        <Text style={styles.text}>Agile Movies</Text>

        <View style={Styles.formContainer}>
          <View>
            <CustomButton
              title="Ver peliculas"
              customClick={() => navigation.navigate('MoviesScreen')}
            />
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'gray',
    borderRadius: 100,
    color: '#ffffff',
    padding: 10,
    marginTop: 16,
    width: '20%',
    marginRight: '3%',
  },
  text: {
    color: '#ffffff',
    alignSelf: 'center',
    fontSize: 35,
    marginTop: 100,
    fontWeight: 'bold',
  },
  mainBg: {
    backgroundColor: '#18181B',
    height: '100%',
    width: '100%',
  },
  imgStyle: {
    alignSelf: 'center',
    marginTop: 100,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
