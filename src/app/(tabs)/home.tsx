import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tabs = createBottomTabNavigator();

export default function Home() {
    const { user, setUser } = useAuth();
    const router = useRouter();

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
                    {/* Card Em Planejamento */}
                    <View style={{ 
                        backgroundColor: '#F0F0F0',
                        padding: 16,
                        borderRadius: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#FFD700'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                            Em Planejamento
                        </Text>
                        <Text style={{ color: '#666' }}>
                            Projetos em fase inicial de planejamento
                        </Text>
                    </View>

                    {/* Card Em Andamento */}
                    <View style={{ 
                        backgroundColor: '#F0F0F0',
                        padding: 16,
                        borderRadius: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#4169E1'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                            Em Andamento
                        </Text>
                        <Text style={{ color: '#666' }}>
                            Projetos atualmente em desenvolvimento
                        </Text>
                    </View>

                    {/* Card Concluído */}
                    <View style={{ 
                        backgroundColor: '#F0F0F0',
                        padding: 16,
                        borderRadius: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#32CD32'
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                            Concluído
                        </Text>
                        <Text style={{ color: '#666' }}>
                            Projetos finalizados
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    Seus Projetos
                </Text>
                
                <View style={{ gap: 12 }}>
                    {/* Projeto 1 */}
                    <View style={{ 
                        backgroundColor: '#FFF',
                        padding: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E0E0E0'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            Sistema de Gestão Escolar
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                            Status: Em Planejamento
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                            Data de início: 01/03/2024
                        </Text>
                    </View>

                    {/* Projeto 2 */}
                    <View style={{ 
                        backgroundColor: '#FFF',
                        padding: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E0E0E0'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            App de Delivery
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                            Status: Em Andamento
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                            Data de início: 15/02/2024
                        </Text>
                    </View>

                    {/* Projeto 3 */}
                    <View style={{ 
                        backgroundColor: '#FFF',
                        padding: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E0E0E0'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            Website Institucional
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                            Status: Concluído
                        </Text>
                        <Text style={{ color: '#666', marginTop: 4 }}>
                            Data de início: 01/01/2024
                        </Text>
                    </View>
                </View>
            </View>
            
        </SafeAreaView>
    );
}