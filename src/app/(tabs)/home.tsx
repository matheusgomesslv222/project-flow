import { View, Text, Button } from 'react-native';
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

    // Proteção da rota - redireciona para login se não houver usuário
    useEffect(() => {
        if (!user) {
            router.replace('/login');
        }
    }, [user]);

    // Função para fazer logout
    const handleLogout = () => {
        setUser(null);
        router.replace('/login');
    };

    // Se não houver usuário, não renderiza nada
    if (!user) return null;

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
        // Verifica se há projetos antes de tentar acessá-los
        if (!projetos || projetos.length === 0) {
            return 0;
        }
        //console.log("Projetos", projetos);
        return projetos.filter(projeto => projeto.status === statusType).length;
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        Bem-vindo, {user.name}
                    </Text>
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <Button title="Sair" onPress={handleLogout}/>
                    </View>
                </View>

                <View style={{ gap: 16 }}>
                    {/* Cards de Status */}
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        gap: 10
                    }}>
                        {/* Card Planejamento */}
                        <View style={{
                            flex: 1,
                            backgroundColor: '#E8F5E9',
                            padding: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                            elevation: 2,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E7D32' }}>
                                {countProjetosPorStatus('planejamento')}
                            </Text>
                            <Text style={{ color: '#2E7D32', marginTop: 4, textAlign: 'center' }}>Em Planejamento</Text>
                        </View>

                        {/* Card Em Andamento */}
                        <View style={{
                            flex: 1,
                            backgroundColor: '#E3F2FD',
                            padding: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                            elevation: 2,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1565C0' }}>
                                {countProjetosPorStatus('Em Andamento')}
                            </Text>
                            <Text style={{ color: '#1565C0', marginTop: 4, textAlign: 'center' }}>Em Andamento</Text>
                        </View>

                        {/* Card Concluído */}
                        <View style={{
                            flex: 1,
                            backgroundColor: '#F3E5F5',
                            padding: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                            elevation: 2,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6A1B9A' }}>
                                {countProjetosPorStatus('Concluído')}
                            </Text>
                            <Text style={{ color: '#6A1B9A', marginTop: 4, textAlign: 'center' }}>Concluídos</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    Seus Projetos
                </Text>
                
                <View style={{ gap: 12 }}>
                    {projetos.map((projeto, index) => (
                        <View key={index} style={{ 
                            backgroundColor: '#FFF',
                            padding: 16,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#E0E0E0'
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                {projeto.nomeProjeto}
                            </Text>
                            <Text style={{ color: '#666', marginTop: 4 }}>
                                Status: {projeto.status}
                            </Text>
                            
                        </View>
                    ))}
                </View>
            </View>
            
        </SafeAreaView>
    );
}