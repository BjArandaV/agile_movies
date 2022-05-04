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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_NOW_PLAYING,
  API_POPULAR_MOVIES,
  API_REFRESH_TOKEN,
} from '../utils/api';

const MoviesScreen = ({ navigation }) => {
  const [data, setData] = useState({
    popularMovies: null,
    nowPlaying: null,
  });
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    try {
      const asyncToken = await AsyncStorage.getItem('token');
      const respMovies = await axios({
        method: 'get',
        url: API_POPULAR_MOVIES,
        headers: {
          Authorization: `Bearer ${asyncToken}`,
        },
      });
      const respNowPlaying = await axios({
        method: 'get',
        url: API_NOW_PLAYING,
        headers: {
          Authorization: `Bearer ${asyncToken}`,
        },
      });
      setData({
        popularMovies: respMovies.data.data,
        nowPlaying: respNowPlaying.data.data,
      });
      if (loading) {
        setLoading(false);
      }
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
      await getMovies();
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
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
            </View>
            <View style={{ marginTop: 50 }}></View>
            <View
              style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
              <Placeholder />
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

function Placeholder() {
  return (
    <View
      style={{
        width: 120,
        height: 180,
        resizeMode: 'cover',
        borderRadius: 5,
        marginRight: 8,
      }}
    />
  );
}

const styles = StyleSheet.create({
  mainBg: {
    backgroundColor: '#18181B',
    height: '100%',
    paddingTop: StatusBar.currentHeight,
  },
});

export default MoviesScreen;
