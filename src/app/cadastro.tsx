import { useState } from 'react';
import {View, Text, Button, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '@/components/Input';
import {useUsersDatabase} from "@/database/UseUsersDatabase"
import { Link } from 'expo-router';

export default function Cadastro () {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const productDatabase = useUsersDatabase();

    async function create(){
        try{

            const response = await productDatabase.create({nome, email, password});
            Alert.alert("Cadastro realizado com sucesso ID: " + response.insertedRowId);
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

    return <SafeAreaView style={{flex: 1, justifyContent: 'center', padding:32,gap:16}}>
            <Text style={{textAlign: 'center', fontSize:28, fontWeight: "bold"}}>Cadastro</Text>
            <Input placeholder='Nome' onChangeText={setNome} value={nome}/>
            <Input placeholder='Email' onChangeText={setEmail} value={email}/>
            <Input placeholder='Password' onChangeText={setPassword} value={password}/>
            <Button title='Cadastrar' onPress={create}/>

            <Link href="/login" style={{ textAlign: 'center', color: 'blue', marginTop: 50 }}>
                <Text >Ir para Login</Text>
            </Link>


    </SafeAreaView>;
}