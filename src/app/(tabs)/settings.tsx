import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { UserDatabase, useUsersDatabase } from '@/database/UseUsersDatabase';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const userDatabase = useUsersDatabase();


  const handleUpdateProfile = async () => {
    if (user?.id) {
      const response = await userDatabase.updateProfile(user.id, nome, email);
      if (response != undefined) {
        // Atualizar o estado global do usuário
        setUser({
          id: user.id,
          name: nome,
          email: email
        });

        Toast.show({
          type: 'success',
          text1: 'Perfil atualizado com sucesso',
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (novaSenha !== confirmarSenha) {
      Toast.show({
        type: 'error',
        text1: 'As senhas não coincidem',
        visibilityTime: 3000,
      });
      return;
    }
  
    if (user?.id) {
      try {
        const response = await userDatabase.updateUser(parseInt(user.id), {
          password: novaSenha
        });
  
        if (response) {
          Toast.show({
            type: 'success',
            text1: 'Senha atualizada com sucesso',
            visibilityTime: 3000,
          });
          // Limpar os campos
          setSenhaAtual('');
          setNovaSenha('');
          setConfirmarSenha('');
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar senha',
          visibilityTime: 3000,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Perfil</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Atualizar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          <TextInput
            style={styles.input}
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            placeholder="Senha Atual"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            placeholder="Nova Senha"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Confirmar Nova Senha"
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4169E1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});