import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Picker } from '@react-native-picker/picker'; // Adicione esta importação
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';


export default function Projetos() {
    const { user } = useAuth();

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

                            <Button 
                                title="Cadastrar Projeto"
                                onPress={() => {}}
                                color="#4169E1"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
} 