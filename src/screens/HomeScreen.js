import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

import { Container } from '../components/Container';

import Mybutton from '../components/MyButton';
import { DATABASE_NAME } from '../components/database';
import { Styles } from '../components/Styles';

const HomeScreen = ({ navigation }) => {
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

  return (
    <>
      <Container>
        <TouchableOpacity style={styles.button} onPress={logOut}>
          <Text style={{ color: 'white' }}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text
          style={{
            color: 'black',
            alignSelf: 'center',
            fontSize: 35,
            marginTop: 100,
            fontWeight: 'bold',
          }}>
          Agile Movies
        </Text>
        <SafeAreaView
          style={{
            flex: 1,
            alignSelf: 'center',
            width: '80%',
          }}>
          <View style={Styles.formContainer}>
            <View>
              <Mybutton
                title="Ver peliculas"
                customClick={() => navigation.navigate('MoviesScreen')}
              />
            </View>
          </View>
        </SafeAreaView>
      </Container>
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
});

export default HomeScreen;
