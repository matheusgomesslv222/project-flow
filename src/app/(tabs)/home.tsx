import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useProjetoDatabase } from '@/database/UseProjetoDatabase';

const Tabs = createBottomTabNavigator();

interface Projeto {
    nomeCliente: string;
    nomeProjeto: string;
    descricao: string;
    status: string;
    dataInicio: Date;
    dataFim: Date;
}

export default function Home() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const projetoDatabase = useProjetoDatabase();

    useEffect(() => {
        if (!user) {
            router.replace('/login');
        }
    }, [user]);

    const handleLogout = () => {
        setUser(null);
        router.replace('/login');
    };

    useEffect(() => {
        const loadProjetos = async () => {
            try {
                const result = await projetoDatabase.getAllProjetos();
                if (result) {
                    setProjetos(result as Projeto[]);
                }
            } catch (error) {
                console.error('Erro ao carregar projetos:', error);
            }
        };

        loadProjetos();
    }, []);

    const countProjetosPorStatus = (statusType: string) => {
        if (!projetos || projetos.length === 0) {
            return 0;
        }
        return projetos.filter(projeto => projeto.status === statusType).length;
    };

    if (!user) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <View style={{ flex: 1, padding: 20 }}>
                {/* Header */}
                <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 30,
                    backgroundColor: '#FFF',
                    padding: 15,
                    borderRadius: 12,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                }}>
                    <View>
                        <Text style={{ fontSize: 16, color: '#666' }}>Bem-vindo,</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
                            {user.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            backgroundColor: '#FF4444',
                            paddingHorizontal: 15,
                            paddingVertical: 8,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialIcons name="logout" size={20} color="#FFF" />
                        <Text style={{ color: '#FFF', marginLeft: 5 }}>Sair</Text>
                    </TouchableOpacity>
                </View>

                {/* Cards de Status */}
                <View style={{ 
                    gap: 15,
                    marginBottom: 30,
                }}>
                    {/* Card Planejamento */}
                    <View style={{
                        backgroundColor: '#FFF',
                        padding: 20,
                        borderRadius: 12,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#FFD700',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="schedule" size={24} color="#FFD700" />
                            <Text style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>Em Planejamento</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>
                            {countProjetosPorStatus('planejamento')}
                        </Text>
                    </View>

                    {/* Card Em Andamento */}
                    <View style={{
                        backgroundColor: '#FFF',
                        padding: 20,
                        borderRadius: 12,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#4169E1',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="work" size={24} color="#4169E1" />
                            <Text style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>Em Andamento</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>
                            {countProjetosPorStatus('Em Andamento')}
                        </Text>
                    </View>

                    {/* Card Concluído */}
                    <View style={{
                        backgroundColor: '#FFF',
                        padding: 20,
                        borderRadius: 12,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        borderLeftWidth: 4,
                        borderLeftColor: '#32CD32',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="check-circle" size={24} color="#32CD32" />
                            <Text style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>Concluídos</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>
                            {countProjetosPorStatus('Concluído')}
                        </Text>
                    </View>
                </View>

                {/* Lista de Projetos */}
                <View style={{ flex: 1 }}>
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: 20,
                    }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>
                            Seus Projetos
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#4169E1',
                                paddingHorizontal: 15,
                                paddingVertical: 8,
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialIcons name="add" size={20} color="#FFF" />
                            <Text style={{ color: '#FFF', marginLeft: 5 }}>Novo Projeto</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ gap: 15 }}>
                        {projetos.map((projeto, index) => (
                            <View 
                                key={index} 
                                style={{ 
                                    backgroundColor: '#FFF',
                                    padding: 20,
                                    borderRadius: 12,
                                    elevation: 2,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                                        {projeto.nomeProjeto}
                                    </Text>
                                    <View style={{ 
                                        backgroundColor: '#F0F0F0',
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 15,
                                    }}>
                                        <Text style={{ color: '#666', fontSize: 12 }}>
                                            {projeto.status}
                                        </Text>
                                    </View>
                                </View>
                                
                                <Text style={{ color: '#666', marginBottom: 10 }}>
                                    Cliente: {projeto.nomeCliente}
                                </Text>
                                
                                <View style={{ 
                                    flexDirection: 'row', 
                                    justifyContent: 'space-between',
                                    borderTopWidth: 1,
                                    borderTopColor: '#F0F0F0',
                                    paddingTop: 10,
                                }}>
                                    <Text style={{ color: '#666', fontSize: 12 }}>
                                        Início: {projeto.dataInicio.toLocaleDateString('pt-BR')}
                                    </Text>
                                    <Text style={{ color: '#666', fontSize: 12 }}>
                                        Término: {projeto.dataFim.toLocaleDateString('pt-BR')}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}