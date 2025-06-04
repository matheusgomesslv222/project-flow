import { useState } from 'react';
import { Text, Button, StyleSheet, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { useUsersDatabase } from '@/database/UseUsersDatabase';
import { Link, useRouter } from "expo-router";
import { useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const productDatabase = useUsersDatabase();
    const router = useRouter();
    const { setUser } = useAuth();

    async function login() {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Preencha todos os campos',
                visibilityTime: 2000,
                autoHide: true,
            });
            
            return;
        }

        setIsLoading(true);
        try {
            const response = await productDatabase.searchUser(email, password);
            console.log(response);
            if (response && response.length > 0) {
                setUser({
                    id: String((response[0] as {id: number}).id),
                    email: String((response[0] as {email: string}).email),
                    name: String((response[0] as {name: string}).name),
                });
                router.push('/(tabs)/home');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Email ou senha incorretos',
                    visibilityTime: 2000,
                    autoHide: true,
                })
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao realizar login',
                visibilityTime: 2000,
                autoHide: true,
            });
            
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {/* <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.logo}
                /> */}
                <Text style={styles.title}>Bem-vindo!</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>
            </View>

            <View style={styles.form}>
                <Input 
                    placeholder='Email' 
                    onChangeText={setEmail} 
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <Input 
                    placeholder='Senha' 
                    onChangeText={setPassword} 
                    value={password}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <View style={styles.buttonContainer}>
                    <Button 
                        title={isLoading ? 'Carregando...' : 'Entrar'} 
                        onPress={login}
                        disabled={isLoading}
                        color="#4A90E2"
                    />
                </View>
            </View>
            
            <View style={styles.footer}>
                <Link href="/cadastro" style={styles.link}>
                    <Text style={styles.linkText}>Não tem uma conta? <Text style={styles.linkTextBold}>Cadastre-se</Text></Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    form: {
        flex: 0.4,
        paddingHorizontal: 32,
        paddingTop: 40,
        gap: 16,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 16,
    },
    buttonContainer: {
        marginTop: 10,
    },
    footer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        padding: 10,
    },
    linkText: {
        color: '#666',
        fontSize: 16,
    },
    linkTextBold: {
        color: '#4A90E2',
        fontWeight: 'bold',
    },
});