import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { DATABASE_NAME } from '../components/database';
import { openDatabase } from 'react-native-sqlite-storage';
import axios from 'axios';

const Movieid = ({ route, navigation }) => {
  let token1 = '';
  let refresh_token1 = '';
  let tokenFinal = '';
  const { id, title, poster_path, backdrop_path, overview, release_date } =
    route.params;

  const [data, setData] = useState({
    movieDetails: null,
    actors: null,
  });

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

        tokenFinal = refresh_token1;
      } catch (e) {
        console.log('error en try checktoken');
      }
    }

    return tokenFinal;
  };

  const getMovies = async () => {
    try {
      const respMovies = await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/popular`,
        headers: {
          Authorization: `Bearer ${await loadData()}`,
        },
      });
      const respCast = await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/${id}/actors`,
        headers: {
          Authorization: `Bearer ${await loadData()}`,
        },
      });

      setData({
        movieDetails: respMovies.data.data,
        actors: respCast.data.data,
      });
    } catch (e) {
      console.log('error al traer peliculas');
    }
  };

  useEffect(() => {
    getMovies();
  }, [id]);

  return (
    <ScrollView style={styles.mainBg} showsVerticalScrollIndicator={false}>
      <View>
        <ImageBackground
          style={{
            width: '100%',
            height: 240,
            resizeMode: 'cover',
            position: 'absolute',
          }}
          imageStyle={{ opacity: 0.4 }}
          source={{
            uri: backdrop_path,
          }}
        />
        <View style={{ paddingTop: 180 }}>
          <Image
            style={{
              width: 150,
              height: 200,
              resizeMode: 'cover',
              position: 'relative',
              alignSelf: 'center',
              borderRadius: 5,
            }}
            source={{
              uri: poster_path,
            }}
          />
        </View>
      </View>
      <View style={{ alignSelf: 'center', paddingTop: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>
          {title}
          <Text style={{ fontWeight: 'normal' }}>
            {' '}
            ({release_date.substr(0, 4)})
          </Text>
        </Text>
      </View>
      <View
        style={{
          alignSelf: 'center',
          paddingTop: 5,
          paddingBottom: 10,
          color: '#fff',
        }}>
        <Text style={{ color: '#fff' }}> {release_date}</Text>
      </View>
      <View style={{ paddingTop: 10, marginLeft: 25, marginRight: 25 }}>
        <Text
          style={{
            backgroundColor: 'rgba(55, 65, 81, 0.3)',
            padding: 10,
            borderRadius: 5,
            color: '#fff',
          }}>
          {overview}
        </Text>
      </View>
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 20,
            color: '#7DD329',
            marginLeft: 20,
            fontWeight: 'bold',
          }}>
          Reparto
        </Text>
      </View>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, marginLeft: 20 }}
          data={data.actors}
          horizontal
          renderItem={element => {
            return (
              <>
                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 10,
                  }}>
                  <Image
                    style={{
                      width: 140,
                      height: 200,
                      resizeMode: 'cover',
                      borderRadius: 5,
                      marginRight: 8,
                    }}
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${element.item.profile_path}`,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#FFF',
                      maxWidth: 130,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    {element.item.name}
                  </Text>
                </View>
              </>
            );
          }}
          keyExtractor={item => item.id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainBg: {
    backgroundColor: '#18181B',
    height: '100%',
  },
});

export default Movieid;
