import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_MOVIES_ACTORS,
  API_POPULAR_MOVIES,
  API_REFRESH_TOKEN,
} from '../utils/api';

const Movieid = ({ route, navigation }) => {
  const { id, title, poster_path, backdrop_path, overview, release_date } =
    route.params;

  const [data, setData] = useState({
    movieDetails: null,
    actors: null,
  });
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
      const respCast = await axios({
        method: 'get',
        url: API_MOVIES_ACTORS + `/${id}/actors`,
        headers: {
          Authorization: `Bearer ${asyncToken}`,
        },
      });

      setData({
        movieDetails: respMovies.data.data,
        actors: respCast.data.data,
      });
    } catch (e) {
      console.log('error al traer peliculas');
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
