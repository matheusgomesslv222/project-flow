import { View, Text, Button, TouchableOpacity, Modal, TextInput, Pressable, ScrollView, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useProjetoDatabase } from '@/database/UseProjetoDatabase';
import Toast from 'react-native-toast-message';

// Remova a importação de createBottomTabNavigator se não for mais usada diretamente aqui
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

interface Projeto {
    id: number; // Adicionado id
    nomeCliente: string;
    nomeProjeto: string;
    descricao: string;
    status: string;
    dataInicio: Date; // Mantido como Date para uso no componente
    dataFim: Date;   // Mantido como Date para uso no componente
    userId: number;
}

export default function Home() {
    const { user, setUser } = useAuth();
    const router = useRouter(); // Certifique-se que router está inicializado
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const projetoDatabase = useProjetoDatabase();

    // Estados para o formulário do modal
    const [modalVisible, setModalVisible] = useState(false);
    const [nomeCliente, setNomeCliente] = useState('');
    const [nomeProjeto, setNomeProjeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState('Em Planejamento'); // Mantido, mesmo que o Picker esteja comentado
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false); // Se for usar DateTimePicker
    const [showEndPicker, setShowEndPicker] = useState(false);   // Se for usar DateTimePicker
    const [editProjectId, setEditProjectId] = useState<number | null>(null); // Para editar projetos

    useEffect(() => {
        if (!user) {
            router.replace('/login');
        } else {
            // Carregar projetos apenas se o usuário estiver logado e user.id estiver disponível
            loadProjetos();
        }
    }, [user, router]); // Adicionado router como dependência se ele for usado no useEffect

    const handleLogout = () => {
        setUser(null);
        router.replace('/login');
    };

    // Removido o useEffect anterior que chamava loadProjetos com array vazio

    const loadProjetos = async () => {
        if (user && user.id) { // Garante que user e user.id existem
            try {
                const userIdNumber = parseInt(user.id, 10); // Converte user.id para número
                if (isNaN(userIdNumber)) {
                    console.error('ID do usuário inválido:', user.id);
                    setProjetos([]); // Limpa os projetos se o ID for inválido
                    return;
                }
                const result = await projetoDatabase.getProjetosByUserId(userIdNumber);
                if (result) {
                    // Converter strings de data do DB para objetos Date
                    const formattedProjetos = result.map((p: any) => ({
                        ...p,
                        dataInicio: new Date(p.dataInicio),
                        dataFim: new Date(p.dataFim)
                    }));
                    setProjetos(formattedProjetos as Projeto[]);
                } else {
                    setProjetos([]); // Define como array vazio se não houver resultado
                }
            } catch (error) {
                console.error('Erro ao carregar projetos:', error);
                setProjetos([]); // Limpa os projetos em caso de erro
            }
        } else {
            setProjetos([]); // Limpa os projetos se não houver usuário
        }
    };

    const countProjetosPorStatus = (statusType: string) => {
        if (!projetos || projetos.length === 0) {
            return 0;
        }
        return projetos.filter(projeto => projeto.status === statusType).length;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    const createProjeto = () => {
        if (!user || !user.id) {
            console.error("Usuário não autenticado ou ID do usuário indisponível para criar projeto.");
            Toast.show({
                type: 'error',
                text1: 'Erro de Autenticação',
                text2: 'Usuário não autenticado. Por favor, faça login novamente.',
                visibilityTime: 3000,
                autoHide: true,
            });
            
            return;
        }

        const projetoParaCriar = {
            nomeCliente: nomeCliente,
            nomeProjeto: nomeProjeto,
            descricao: descricao,
            status: status, // Usando o estado 'status'
            dataInicio: startDate,
            dataFim: endDate,
            userId: parseInt(user.id, 10),
        };
        
        projetoDatabase.create(projetoParaCriar)
            .then((result) => {
                console.log("Projeto criado com ID:", result?.insertedRowId);
                Toast.show({
                    type: 'success',
                    text1: 'Projeto Criado',
                    text2: 'Seu projeto foi criado com sucesso.',
                    visibilityTime: 3000,
                    autoHide: true,
                })
                // Limpar os campos do formulário e fechar o modal
                setNomeCliente('');
                setNomeProjeto('');
                setDescricao('');
                setStatus('f');
                setStartDate(new Date());
                setEndDate(new Date());
                setModalVisible(false);
                loadProjetos(); // Recarregar a lista de projetos
            })
            .catch(error => {
                console.error("Erro ao criar projeto:", error);
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao criar projeto',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                
            });
    };

    const renderProjetoItem = ({ item }: { item: Projeto }) => {
        let statusColor = '#FFD700'; // Cor padrão para 'Em Planejamento'
        if (item.status === 'Em Andamento') {
            statusColor = '#4169E1';
        } else if (item.status === 'Concluído') {
            statusColor = '#32CD32';
        }
        // Se houver outros status, você pode adicionar mais condições 'else if' aqui

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: '#FFF',
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 15,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    borderLeftWidth: 4,
                    borderLeftColor: statusColor,
                }}
                onPress={() => router.push({ pathname: "/projectDetail", params: { projectId: item.id.toString() } })}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                    {item.nomeProjeto}
                </Text>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 3 }}>
                    Cliente: {item.nomeCliente}
                </Text>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                    Status: {item.status}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#888' }}>
                        Início: {formatDate(item.dataInicio)}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>
                        Fim: {formatDate(item.dataFim)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 25 }}>
                    <TouchableOpacity 
                    onPress={() => handleOpenModalEditProject(item)}
                    style={{
                        backgroundColor: '#4169E1',
                        padding: 8,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    >
                    <MaterialIcons name="edit" size={16} color="#FFF" />
                    <Text style={{ color: '#FFF', marginLeft: 4 }}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => handDelProject(item.id)}
                    style={{
                        backgroundColor: '#FF4444',
                        padding: 8,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    >
                    <MaterialIcons name="delete" size={16} color="#FFF" />
                    <Text style={{ color: '#FFF', marginLeft: 4 }}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const handDelProject = async (projectId: number) => {
        try {
            await projetoDatabase.deleteProject(projectId);
            loadProjetos();
            Toast.show({
                type: 'success',
                text1: 'Projeto Excluído',
                text2: 'Seu projeto foi excluído com sucesso.',
                visibilityTime: 3000,
                autoHide: true,
            });
        } catch (error){
            console.error('Erro ao excluir projeto:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao excluir projeto',
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    }

    const handleEditProject = async (projectId: number) => {
        try {
            const projetoParaEditar = {
                nomeCliente: nomeCliente,
                nomeProjeto: nomeProjeto,
                descricao: descricao,
                dataInicio: startDate,
                dataFim: endDate,
            };
            await projetoDatabase.editProject(projectId, projetoParaEditar);
            clearInputs();
            loadProjetos();
            Toast.show({
                type:'success',
                text1: 'Projeto Editado',
                text2: 'Seu projeto foi editado com sucesso.',
                visibilityTime: 3000,
                autoHide: true,
            });
        } catch (error) {
            console.error('Erro ao editar projeto:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro ao editar projeto',
                visibilityTime: 3000,
                autoHide: true,
            });
        }

    }

    const handleOpenModalEditProject = (project: Projeto) => {
        setNomeCliente(project.nomeCliente);
        setNomeProjeto(project.nomeProjeto);
        setDescricao(project.descricao);
        setStatus(project.status);
        setStartDate(project.dataInicio);
        setEndDate(project.dataFim);
        setEditProjectId(project.id);
        setModalVisible(true);
    };

    const editOrCreate = () => {
        if(editProjectId){
            handleEditProject(editProjectId);
        } else {
            createProjeto();
        }
    }

    const clearInputs = () => {
        setEditProjectId(null)
        setNomeCliente('');
        setNomeProjeto('');
        setDescricao('');
        setStatus('f');
        setStartDate(new Date());
        setEndDate(new Date());
        setModalVisible(false);
    }

    if (!user) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            {/* A View anterior com flex: 1 e padding: 20 é substituída por este ScrollView */}
            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ 
                    padding: 20, 
                    paddingBottom: 90 /* Ajuste este valor conforme necessário para a altura da sua tab bar */ 
                }}
                showsVerticalScrollIndicator={false} // Opcional: esconde a barra de rolagem do ScrollView
            >
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
                            {countProjetosPorStatus('Em Planejamento')}
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
                            <Text style={{ marginLeft: 8, color: '#666', fontSize: 14 }}>Concluído</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>
                            {countProjetosPorStatus('Concluído')}
                        </Text>
                    </View>
                </View>

                {/* Lista de Projetos */}
                {/* A View que continha a FlatList não precisa mais de flex: 1 nem paddingBottom */}
                <View> 
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>Meus Projetos</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{
                                backgroundColor: '#4169E1',
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialIcons name="add" size={22} color="#FFF" />
                            <Text style={{ color: '#FFF', marginLeft: 5, fontSize: 16 }}>Novo Projeto</Text>
                        </TouchableOpacity>
                    </View>

                    {projetos.length > 0 ? (
                        <FlatList
                            data={projetos}
                            renderItem={renderProjetoItem} 
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false} // Mantém esta propriedade
                            scrollEnabled={false} // Adicionado: Desabilita o scroll da FlatList
                        />
                    ) : (
                        <View style={{ /* flex: 1 removido */ justifyContent: 'center', alignItems: 'center', minHeight: 150 /* Para dar algum espaço visual */ }}>
                            <Text style={{ fontSize: 16, color: '#666' }}>Nenhum projeto encontrado.</Text>
                            <Text style={{ fontSize: 14, color: '#888', marginTop: 5 }}>Crie um novo projeto para começar!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal de Novo Projeto (código existente do modal, permanece fora do ScrollView) */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => clearInputs()}>
                <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => clearInputs()}>
                    <Pressable style={{backgroundColor: 'white', borderRadius: 12, padding: 25, width:'90%', maxHeight: '85%', elevation: 5}} onPress={(e) => e.stopPropagation()}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' }}>Criar Novo Projeto</Text>
                            
                            {/* Campos do formulário (Nome Cliente, Nome Projeto, Descrição, Datas) */}
                            {/* ... (código dos inputs e pickers de data inalterado) ... */}
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 16, marginBottom: 5, color: '#555' }}>Nome do Cliente</Text>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#F8F9FA' }}
                                    placeholder="Digite o nome do cliente"
                                    value={nomeCliente}
                                    onChangeText={setNomeCliente}
                                />
                            </View>

                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 16, marginBottom: 5, color: '#555' }}>Nome do Projeto</Text>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#F8F9FA' }}
                                    placeholder="Digite o nome do projeto"
                                    value={nomeProjeto}
                                    onChangeText={setNomeProjeto}
                                />
                            </View>

                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 16, marginBottom: 5, color: '#555' }}>Descrição</Text>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, minHeight: 100, textAlignVertical: 'top', backgroundColor: '#F8F9FA' }}
                                    placeholder="Descreva o projeto"
                                    value={descricao}
                                    onChangeText={setDescricao}
                                    multiline
                                />
                            </View>
                            
                            {/* Datas (simplificado para o exemplo, mantenha seu DateTimePicker se estiver usando) */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                <View style={{ flex: 1, marginRight: 5 }}>
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: '#555' }}>Data Início</Text>
                                    <Pressable onPress={() => setShowStartPicker(true)} style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, backgroundColor: '#F8F9FA' }}>
                                        <Text style={{ fontSize: 16 }}>{formatDate(startDate)}</Text>
                                    </Pressable>
                                </View>
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <Text style={{ fontSize: 16, marginBottom: 5, color: '#555' }}>Data Fim</Text>
                                    <Pressable onPress={() => setShowEndPicker(true)} style={{ borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, backgroundColor: '#F8F9FA' }}>
                                        <Text style={{ fontSize: 16 }}>{formatDate(endDate)}</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Seus DatePickers (showStartPicker, showEndPicker) aqui */}
                            {/* ... */}


                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#6c757d', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 }}
                                    onPress={() => clearInputs()}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#4169E1', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 }}
                                    onPress={editOrCreate}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                        {editProjectId !== null ? 'Editar Projeto' : 'Salvar Projeto'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
        );
}
