import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';

export default function Tarefas() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Desenvolver interface do usuário',
            description: 'Criar layouts responsivos para as telas principais',
            status: 'pendente',
            dueDate: new Date(),
            priority: 'alta'
        },
        {
            id: 2,
            title: 'Implementar autenticação',
            description: 'Configurar sistema de login e registro',
            status: 'em_andamento',
            dueDate: new Date(),
            priority: 'media'
        }
    ]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendente':
                return '#FFD700';
            case 'em_andamento':
                return '#4169E1';
            case 'concluida':
                return '#32CD32';
            default:
                return '#666';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alta':
                return '#FF4444';
            case 'media':
                return '#FFA500';
            case 'baixa':
                return '#4CAF50';
            default:
                return '#666';
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <ScrollView>
                <View>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                        Tarefas
                    </Text>

                    {/* Lista de Tarefas */}
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                            Minhas Tarefas
                        </Text>
                        
                        <View style={{ gap: 12 }}>
                            {tasks.map((task) => (
                                <View 
                                    key={task.id}
                                    style={{ 
                                        backgroundColor: '#FFF',
                                        padding: 16,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#E0E0E0'
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                            {task.title}
                                        </Text>
                                        <View style={{ 
                                            backgroundColor: getPriorityColor(task.priority),
                                            paddingHorizontal: 8,
                                            paddingVertical: 4,
                                            borderRadius: 4
                                        }}>
                                            <Text style={{ color: '#FFF', fontSize: 12 }}>
                                                {task.priority.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <Text style={{ color: '#666', marginBottom: 8 }}>
                                        {task.description}
                                    </Text>
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ 
                                            backgroundColor: getStatusColor(task.status),
                                            paddingHorizontal: 8,
                                            paddingVertical: 4,
                                            borderRadius: 4
                                        }}>
                                            <Text style={{ color: '#FFF', fontSize: 12 }}>
                                                {task.status.replace('_', ' ').toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text style={{ color: '#666', fontSize: 12 }}>
                                            Entrega: {formatDate(task.dueDate)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 