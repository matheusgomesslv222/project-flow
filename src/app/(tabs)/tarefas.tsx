import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function Tarefas() {
    const { user } = useAuth();

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    Tarefas
                </Text>
                {/* Conteúdo da tela de tarefas */}
            </View>
        </SafeAreaView>
    );
} 