import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    height: 600,
    marginBottom: 50,
  },
  formContainerEquipos: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    height: 600,
    marginBottom: 50,
    borderWidth: 3,
  },
  horizontalEquipos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  subHeader: {
    backgroundColor: '#2089dc',
    color: 'white',
    textAlign: 'left',
    paddingVertical: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  title: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  label: {
    marginTop: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  labelLvt: {
    marginTop: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  newUserContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
});
