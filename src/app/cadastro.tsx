import { useState } from 'react';
import {View, Text, Button,StyleSheet, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '@/components/Input';
import {useUsersDatabase} from "@/database/UseUsersDatabase"
import { Link } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Cadastro () {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const productDatabase = useUsersDatabase();

    async function create(){
        try{

            const response = await productDatabase.create({nome, email, password});
            Toast.show({
                type: 'success',
                text1: 'Cadastro realizado com sucesso',
                text2: 'ID: ' + response.insertedRowId,
                visibilityTime: 2000,
                autoHide: true,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function list(){
        try{
            const response = await productDatabase.searchUser(email, password);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
            </View>

            <View style={styles.form}>
                <Input 
                    placeholder='Nome' 
                    onChangeText={setNome} 
                    value={nome}
                    style={styles.input}
                />
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
                    <Button title='Cadastrar' onPress={create} color="#4A90E2" />
                </View>
            </View>

            <View style={styles.footer}>
                <Link href="/login" style={styles.link}>
                    <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkTextBold}>Faça login</Text></Text>
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
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 20,
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
        flex: 0.5,
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