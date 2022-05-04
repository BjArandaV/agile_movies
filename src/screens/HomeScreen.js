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
import { openDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME } from '../components/database';
import Mybutton from '../components/MyButton';
import { Styles } from '../components/Styles';

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState({
    activeUser: null,
  });
  let token1 = '';
  let refresh_token1 = '';
  let tokenFinal = '';

  const loadData = async () => {
    try {
      const db = await openDatabase({ name: DATABASE_NAME });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM token', [], (_, results) => {
          const temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }

          token1 = temp[0].token;

          console.log('token1', token1);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM refresh_token', [], (_, results) => {
          const temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          refresh_token1 = temp[0].refresh_token;
        });
      });
    } catch (e) {
      console.log('error al cargar db');
    }
    try {
      await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/popular`,
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      });
      console.log('token');
      tokenFinal = token1;
    } catch (e) {
      try {
        await axios({
          method: 'get',
          url: `http://161.35.140.236:9005/api/movies/popular`,
          headers: {
            Authorization: `Bearer ${refresh_token1}`,
          },
        });
        console.log('refresh token');
        tokenFinal = refresh_token1;
      } catch (e) {
        console.log('error en try checktoken');
      }
    }
    return tokenFinal;
  };

  const getMovies = async () => {
    try {
      const respUser = await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/user/me`,
        headers: {
          Authorization: `Bearer ${await loadData()}`,
        },
      });
      setData({
        activeUser: respUser.data.data,
      });
    } catch (e) {
      console.log('error al traer peliculas');
    }
  };

  useEffect(() => {
    getMovies();
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
      const db = await openDatabase({ name: DATABASE_NAME });
      db.transaction(tx => {
        tx.executeSql(`DELETE FROM token`, []);
        tx.executeSql(`DELETE FROM refresh_token`, []);
      });
      navigation.replace('Login');
    } catch (e) {
      console.log('Error al borrar datos de la base de datos', e);
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

        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 350,
            height: 210,
            top: 30,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            color: '#fff',
            alignSelf: 'center',
            fontSize: 35,
            marginTop: 100,
            fontWeight: 'bold',
          }}>
          Agile Movies
        </Text>

        <View style={Styles.formContainer}>
          <View>
            <Mybutton
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
  },
  mainBg: {
    backgroundColor: '#18181B',
    height: '100%',
    width: '100%',
  },
});

export default HomeScreen;
