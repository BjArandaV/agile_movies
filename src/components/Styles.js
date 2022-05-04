import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    height: 600,
    marginBottom: 50,
  },
  label: {
    marginTop: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  button: {
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
  },
});
