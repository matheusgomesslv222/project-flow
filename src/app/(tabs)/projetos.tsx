import { View, Text, TextInput, Button, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function Projetos() {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
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
                                />
                            </View>

                            <View>
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Status</Text>
                                <View style={{ 
                                    backgroundColor: '#FFF',
                                    borderRadius: 4,
                                    borderWidth: 1,
                                    borderColor: '#DDD'
                                }}>
                                    <Picker
                                        style={{ height: 60 }}
                                    >
                                        <Picker.Item label="Em Planejamento" value="planejamento" />
                                        <Picker.Item label="Em Andamento" value="andamento" />
                                        <Picker.Item label="Concluído" value="concluido" />
                                    </Picker>
                                </View>
                            </View>

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

                                {showStartPicker && (
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
                                )}
                            </View>

                            <Button 
                                title="Cadastrar Projeto"
                                onPress={() => {
                                    console.log('Data inicial:', startDate);
                                    console.log('Data final:', endDate);
                                }}
                                color="#4169E1"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
} 