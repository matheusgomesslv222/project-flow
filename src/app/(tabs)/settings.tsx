import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
// import { AuthContext } from '../../contexts/AuthContext';
import { useUsersDatabase } from '../../database/UseUsersDatabase';
import Toast from 'react-native-toast-message';

const SettingsScreen = () => {
  const {  } = ''
  const { updateUser } = useUsersDatabase();



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <Text style={styles.label}>Nome:</Text>
      {/* <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
      /> */}

      <Text style={styles.label}>Email:</Text>
      {/* <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      /> */}

      {/* <Button title="Salvar Alterações" onPress={handleUpdate} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    width: '80%',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;