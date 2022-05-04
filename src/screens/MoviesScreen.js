import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME } from '../components/database';
import Mybutton from '../components/MyButton';
import { Styles } from '../components/Styles';

const MoviesScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [refresh_token, setRefresh_Token] = useState('');
  const [movies, setMovies] = useState([]);

  const loadData = async () => {
    try {
      const db = await openDatabase({ name: DATABASE_NAME });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM token', [], (_, results) => {
          const temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          setToken(temp[0].token);
          console.log('token', temp);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM refresh_token', [], (_, results) => {
          const temp = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          setRefresh_Token(temp[0].refresh_token);
        });
      });
    } catch (e) {
      console.log('error al cargar db');
    }
  };

  const checkToken = async () => {
    try {
      await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/popular`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('token');
      getMovies(token);
    } catch (e) {
      try {
        await axios({
          method: 'get',
          url: `http://161.35.140.236:9005/api/movies/popular`,
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        });
        console.log('refresh token');
        getMovies(refresh_token);
      } catch (e) {
        console.log('error en try checktoken');
      }
    }
  };

  const getMovies = async validToken => {
    try {
      const response = await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/popular`,
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      allDataMovies(response.data.data);
    } catch (e) {
      console.log('error al traer peliculas');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,

          backgroundColor: '#607D8B',
        }}
      />
    );
  };
  const getItem = item => {
    setEquipoSeleccionado(item);
    setFormData({ ...formData, id_puntoLub: item.id });
  };
  const ListItemView = ({ item }) => {
    // const style =
    //   item.id === equipoSeleccionado?.id
    //     ? { backgroundColor: 'grey' }
    //     : undefined;
    return (
      <>
        <TouchableOpacity style={[styles.item]} onPress={() => getItem(item)}>
          <Card>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={styles.title}>Titulo</Text>
                <Text style={styles.itemText}>{item?.title} </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </>
    );
  };

  const allDataMovies = allData => {
    const moviesMap = allData.map(map => ({
      id: map.id,
      title: map.title,
    }));
    console.log(moviesMap);
  };

  // console.log('uf', moviesMap.title);
  return (
    <>
      <View style={Styles.formContainer}>
        <SafeAreaView>
          <View>
            <Mybutton title="Ver peliculas" customClick={() => checkToken()} />
          </View>
          <View>
            <FlatList
              data={allDataMovies}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={item => item?.id}
              renderItem={({ item }) => <ListItemView item={item} />}
            />
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 2,
  },
  title: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  button: {
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#34eb83',
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonImgLub: {
    color: 'gray',
    paddingBottom: 10,
    paddingTop: 10,
  },

  item: {
    paddingLeft: 15,
    paddingTop: 8,
    paddingBottom: 8,
  },

  itemText: {
    fontSize: 14,
    color: 'black',
  },
});

export default MoviesScreen;
