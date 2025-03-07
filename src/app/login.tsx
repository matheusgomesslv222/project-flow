// filepath: /C:/Users/mathe/Desktop/PROJETO FACUL/project-flow/src/app/login.tsx
import { useState } from 'react';
import { Text, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { useUsersDatabase } from '@/database/UseUsersDatabase';
import { Link, useRouter } from "expo-router";
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const productDatabase = useUsersDatabase();
    const router = useRouter();
    const { setUser } = useAuth();

    async function login() {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos");
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
                Alert.alert("Email ou senha incorretos");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao realizar login");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 32, gap: 16 }}>
            <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>Login</Text>
            <Input 
                placeholder='Email' 
                onChangeText={setEmail} 
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Input 
                placeholder='Password' 
                onChangeText={setPassword} 
                value={password}
                secureTextEntry={true}
            />
            <Button 
                title={isLoading ? 'Carregando...' : 'Login'} 
                onPress={login}
                disabled={isLoading} 
            />
            
            <Link href="/cadastro" style={{ textAlign: 'center', color: 'blue', marginTop: 50 }}>
                <Text>Ir para Cadastro</Text>
            </Link>
        </SafeAreaView>
    );
}