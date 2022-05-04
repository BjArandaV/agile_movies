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
import { openDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME } from '../components/database';
import { Container } from '../components/Container';
import { Input } from 'react-native-elements';
import axios from 'axios';
import { Styles } from '../components/Styles';
import { getUniqueId } from '../utils/uuid';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const API_URL = 'http://161.35.140.236:9005/api';

  const loadDB = async () => {
    try {
      const db = await openDatabase({ name: DATABASE_NAME });

      db.transaction(function (txn) {
        txn.executeSql(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='token'`,
          [],

          function (_, res) {
            if (res.rows.length == 0) {
              console.log('se crearan todas las tablas xdd');
              txn.executeSql(
                `CREATE TABLE IF NOT EXISTS token(id VARCHAR(50) NOT NULL PRIMARY KEY,
                     token VARCHAR(255))`,
                [],
              );
              txn.executeSql(
                `CREATE TABLE IF NOT EXISTS refresh_token(id VARCHAR(50) NOT NULL PRIMARY KEY,
                     refresh_token VARCHAR(255))`,
                [],
              );
            } else {
              try {
                db.transaction(tx => {
                  tx.executeSql(`DELETE FROM token`, []);
                  tx.executeSql(`DELETE FROM refresh_token`, []);
                });
              } catch (e) {
                console.log('Error al borrar datos de la base de datos', e);
              }
              console.log('Hay tablas existentes en la bd.');
            }
          },
        );
      });
    } catch (e) {
      console.log('Ha ocurrido un error en crear tablas');
    }
  };

  useEffect(() => {
    loadDB();
  }, []);

  const loginUser = async () => {
    if (!username || username.length < 4) {
      alert('Usuario minimo 4 caracteres');
      return;
    }
    if (!password || password.length < 6) {
      alert('Contraseña minimo 6 caracteres');
      return;
    }

    const json = {
      username: username,
      password: password,
    };
    try {
      const response = await axios({
        method: 'post',
        url: `http://161.35.140.236:9005/api/auth/login`,
        data: {
          username: username,
          password: password,
        },
      });

      if (response.status === 201) {
        try {
          const db = await openDatabase({ name: DATABASE_NAME });
          db.transaction(function (txn) {
            txn.executeSql(`INSERT INTO token (id, token) VALUES (?,?)`, [
              getUniqueId(),
              response.data.data.payload.token,
            ]);
            txn.executeSql(
              `INSERT INTO refresh_token (id, refresh_token) VALUES (?,?)`,
              [getUniqueId(), response.data.data.payload.refresh_token],
            );
          });
        } catch (e) {
          console.log(e);
        }
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
        'Login erroneo',
        'Usuario o contraseña incorrecta',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      );
      return;
    }
  };
  return (
    <>
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
                    onChangeText={username =>
                      setUsername(username.toLowerCase())
                    }
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
    </>
  );
};

export default LoginScreen;
