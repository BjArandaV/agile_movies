import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'react-native-sqlite-storage';
import { DATABASE_NAME } from '../components/database';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MoviesScreen = ({ navigation }) => {
  const [data, setData] = useState({
    popularMovies: null,
    nowPlaying: null,
  });
  let token1 = '';
  let refresh_token1 = '';
  const [loading, setLoading] = useState(true);
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
      const respMovies = await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/popular`,
        headers: {
          Authorization: `Bearer ${await loadData()}`,
        },
      });
      const respNowPlaying = await axios({
        method: 'get',
        url: `http://161.35.140.236:9005/api/movies/now_playing`,
        headers: {
          Authorization: `Bearer ${await loadData()}`,
        },
      });
      setData({
        popularMovies: respMovies.data.data,
        nowPlaying: respNowPlaying.data.data,
      });
    } catch (e) {
      console.log('error al traer peliculas');
    }
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.mainBg}>
        {loading ? (
          <SkeletonPlaceholder
            backgroundColor={'#18181B'}
            highlightColor={'gray'}>
            <View style={{ marginTop: 50 }}></View>

            <View
              style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
            </View>
            <View style={{ marginTop: 50 }}></View>
            <View
              style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
              <View
                style={{
                  width: 120,
                  height: 180,
                  resizeMode: 'cover',
                  borderRadius: 5,
                  marginRight: 8,
                }}></View>
            </View>
            <View style={{ marginTop: 50 }}></View>
          </SkeletonPlaceholder>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 18,
                color: '#fff',
                marginTop: 30,
                marginLeft: 20,
                fontWeight: 'bold',
              }}>
              Peliculas
              <Text style={{ color: '#7DD329', fontSize: 22 }}> Estreno</Text>
            </Text>
            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginLeft: 20 }}
                data={data.popularMovies}
                horizontal
                renderItem={element => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Movieid', {
                          id: element.item.id,
                          title: element.item.title,
                          poster_path: `https://image.tmdb.org/t/p/w500${element.item.poster_path}`,
                          backdrop_path: `https://image.tmdb.org/t/p/w500${element.item.backdrop_path}`,
                          overview: element.item.overview,
                          release_date: element.item.release_date,
                        });
                      }}>
                      <Image
                        style={{
                          width: 120,
                          height: 180,
                          resizeMode: 'cover',
                          borderRadius: 5,
                          marginRight: 8,
                        }}
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500${element.item.poster_path}`,
                        }}
                      />
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff',
                  marginLeft: 20,
                  fontWeight: 'bold',
                }}>
                Peliculas
                <Text style={{ color: '#7DD329', fontSize: 22 }}>
                  {' '}
                  Populares
                </Text>
              </Text>
              <FlatList
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginLeft: 20 }}
                data={data.nowPlaying}
                horizontal
                renderItem={element => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Movieid', {
                          id: element.item.id,
                          title: element.item.title,
                          poster_path: `https://image.tmdb.org/t/p/w500${element.item.poster_path}`,
                          backdrop_path: `https://image.tmdb.org/t/p/w500${element.item.backdrop_path}`,
                          overview: element.item.overview,
                          release_date: element.item.release_date,
                        });
                      }}>
                      <Image
                        style={{
                          width: 120,
                          height: 180,
                          resizeMode: 'cover',
                          borderRadius: 5,
                          marginRight: 8,
                        }}
                        source={{
                          uri: `https://image.tmdb.org/t/p/w500${element.item.poster_path}`,
                        }}
                      />
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainBg: {
    backgroundColor: '#18181B',
    height: '100%',
    paddingTop: StatusBar.currentHeight,
  },
});

export default MoviesScreen;
