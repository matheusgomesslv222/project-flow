import { View, Text, TextInput, Button, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

import { useProjetoDatabase } from '@/database/UseProjetoDatabase';

export default function Projetos() {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [nomeCliente, setNomeCliente] = useState('');
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState('Em Planejamento');

    const { create } = useProjetoDatabase();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    const createProjeto = () => {
        if (!user || !user.id) {
            console.error("Usuário não autenticado ou ID do usuário indisponível para criar projeto.");
            alert("Erro: Usuário não autenticado. Não é possível criar o projeto.");
            return;
        }

        const projetoParaCriar = {
            nomeCliente: nomeCliente,
            nomeProjeto: nomeProjeto,
            descricao: descricao,
            status: status,
            dataInicio: startDate,
            dataFim: endDate,
            userId: parseInt(user.id, 10), // Garante que userId é um número
        };
        
        create(projetoParaCriar)
            .then((result) => {
                console.log("Projeto criado com ID:", result?.insertedRowId); // A função create retorna {insertedRowId}
                alert('Projeto criado com sucesso!');
                // Opcional: Limpar os campos do formulário após o sucesso
                setNomeCliente('');
                setNomeProjeto('');
                setDescricao('');
                setStatus('Em Planejamento');
                setStartDate(new Date());
                setEndDate(new Date());
            })
            .catch(error => {
                console.error("Erro ao criar projeto:", error);
                alert('Erro ao criar projeto. Verifique os logs para mais detalhes.');
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    Projetos
                </Text>
                <View style={{ gap: 16 }}>
                    <View style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                            Novo Projeto
                        </Text>
                        
                        <View style={{ gap: 12 }}>
                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Nome do Cliente</Text>
                                <TextInput 
                                    style={{
                                        backgroundColor: '#FFF',
                                        padding: 8,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#DDD'
                                    }}
                                    placeholder="Digite o nome do cliente"
                                    onChangeText={setNomeCliente}
                                    value={nomeCliente}
                                />
                            </View>

                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Nome do Projeto</Text>
                                <TextInput 
                                    style={{
                                        backgroundColor: '#FFF',
                                        padding: 8,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#DDD'
                                    }}
                                    placeholder="Digite o nome do projeto"
                                    onChangeText={setNomeProjeto}
                                    value={nomeProjeto} 
                                />
                            </View>

                            

                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Descrição</Text>
                                <TextInput 
                                    style={{
                                        backgroundColor: '#FFF',
                                        padding: 8,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#DDD',
                                        height: 100,
                                        textAlignVertical: 'top'
                                    }}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Digite a descrição do projeto"
                                    onChangeText={setDescricao}
                                    value={descricao}   
                                />
                            </View>

                            {/* <View>
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Status</Text>
                                <View style={{ 
                                    backgroundColor: '#FFF',
                                    borderRadius: 4,
                                    borderWidth: 1,
                                    borderColor: '#DDD'
                                }}>
                                    <Picker
                                        style={{ height: 60 }}
                                        selectedValue={status}
                                        onValueChange={(itemValue) => setStatus(itemValue)}
                                    >
                                        <Picker.Item label="Em Planejamento" value="Em Planejamento" />
                                        <Picker.Item label="Em Andamento" value="Em Andamento" />
                                        <Picker.Item label="Concluído" value="Concluído" />
                                    </Picker>
                                </View>
                            </View> */}

                            <View style={{ gap: 12 }}>
                                <View>
                                    <Text style={{ fontSize: 16, marginBottom: 4 }}>Data Inicial</Text>
                                    <Pressable
                                        onPress={() => setShowStartPicker(true)}
                                        style={{
                                            backgroundColor: '#FFF',
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: '#DDD',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text>{formatDate(startDate)}</Text>
                                        <MaterialIcons name="calendar-today" size={20} color="#666" />
                                    </Pressable>
                                </View>

                                <View>
                                    <Text style={{ fontSize: 16, marginBottom: 4 }}>Data Final</Text>
                                    <Pressable
                                        onPress={() => setShowEndPicker(true)}
                                        style={{
                                            backgroundColor: '#FFF',
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: '#DDD',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text>{formatDate(endDate)}</Text>
                                        <MaterialIcons name="calendar-today" size={20} color="#666" />
                                    </Pressable>
                                </View>

                                {/* {showStartPicker && (
                                    <DateTimePicker
                                        value={startDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowStartPicker(false);
                                            if (selectedDate) {
                                                setStartDate(selectedDate);
                                            }
                                        }}
                                        locale="pt-BR"
                                    />
                                )}

                                {showEndPicker && (
                                    <DateTimePicker
                                        value={endDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowEndPicker(false);
                                            if (selectedDate) {
                                                setEndDate(selectedDate);
                                            }
                                        }}
                                        locale="pt-BR"
                                        minimumDate={startDate}
                                    />
                                )} */}
                            </View>

                            <Button 
                                title="Cadastrar Projeto"
                                onPress={createProjeto}
                                color="#4169E1"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}