import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert, Pressable } from 'react-native'; // Adicionado Modal, TextInput, Button, Alert, Pressable
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useProjetoDatabase, ProjetoDatabase as Projeto } from '@/database/UseProjetoDatabase';
// Importar o hook de tarefas e o tipo Tarefa (assumindo que você criará/terá este arquivo)
import { useTarefaDatabase, Tarefa as Tarefas } from '@/database/UseTarefaDatabase'; // Descomente e ajuste o caminho se necessário

// Interface Tarefa (mantenha ou mova para um arquivo de tipos compartilhado)
interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  projetoId: number;
  responsavel?: string;
}

export default function ProjectDetailScreen() {
  const params = useLocalSearchParams();
  const projectId = params.projectId ? parseInt(params.projectId as string, 10) : null;
  const router = useRouter();

  const [project, setProject] = useState<Projeto | null>(null);
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  const { getProjetoById } = useProjetoDatabase();
  const { create: create, getTarefasByProjectId } = useTarefaDatabase(); // Obter funções do hook de tarefas

  // Estados para o modal de nova tarefa
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  // Poderia adicionar estado para status e responsável se necessário no formulário

  useEffect(() => {
    if (projectId) {
      loadProjectDetails();
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const loadProjectDetails = async () => {
    if (!projectId) return;
    setLoading(true); // Iniciar loading para detalhes do projeto
    try {
      const fetchedProject = await getProjetoById(projectId);
      if (fetchedProject) {
        // Certifique-se de que as datas estão no formato Date, se necessário
        setProject({
            ...fetchedProject,
            // dataInicio: fetchedProject?.dataInicio ? new Date(fetchedProject.dataInicio) : new Date(),
            // dataFim: fetchedProject?.dataFim ? new Date(fetchedProject.dataFim) : new Date(),
        } as Projeto);
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do projeto:", error);
      setProject(null);
    }
    // setLoading(false) será chamado no finally de loadTasks ou aqui se loadTasks não for chamado
  };

  const loadTasks = async () => {
    if (!projectId) return;
    setLoading(true); // Iniciar loading para tarefas
    try {
      const fetchedTasks = await getTarefasByProjectId(projectId);
      setTasks(fetchedTasks.map(task => ({
        id: task.id,
        titulo: task.nomeTarefa,
        descricao: task.descricao,
        status: task.status as 'pendente' | 'em_andamento' | 'concluido',
        projetoId: task.projetoId,
      })) || []);
      setPendingTasks(fetchedTasks.filter(task => task.status === 'pendente').map(task => ({
        id: task.id,
        titulo: task.nomeTarefa,
        descricao: task.descricao,
        status: task.status as 'pendente' | 'em_andamento' | 'concluido',
        projetoId: task.projetoId,
      })));
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      setTasks([]);
      setPendingTasks([]);
    } finally {
      setLoading(false); // Finalizar loading após carregar projeto e tarefas
    }
  };

  const handleCreateTask = async () => {
    if (!projectId || !newTaskTitle.trim()) {
      Alert.alert("Erro", "O título da tarefa é obrigatório.");
      return;
    }

    try {
      const newTaskData: Omit<Tarefa, 'id'> = {
        projetoId: projectId,
        titulo: newTaskTitle.trim(),
        descricao: newTaskDescription.trim(),
        status: 'pendente', // Status padrão para nova tarefa
        // responsavel: 'Quem for atribuído', // Adicionar campo se necessário
      };
      
      const result = await create({
        nomeTarefa: newTaskTitle.trim(),
        descricao: newTaskDescription.trim(),
        status: 'pendente',
        dataInicio: new Date().toISOString(),
        dataFim: new Date().toISOString(), 
        projetoId: projectId
      });
      console.log("Resultado da criação da tarefa:", result);
      if (result !== undefined) {
        Alert.alert("Sucesso", "Tarefa criada com sucesso!");
        setNewTaskTitle('');
        setNewTaskDescription('');
        setTaskModalVisible(false);
        loadTasks(); // Recarregar a lista de tarefas
      } else {
        Alert.alert("Erro", "Não foi possível criar a tarefa. Verifique os logs.");
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      Alert.alert("Erro", "Ocorreu um erro ao criar a tarefa.");
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4169E1" />
        <Text>Carregando detalhes do projeto...</Text>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.centered}>
        <MaterialIcons name="error-outline" size={48} color="red" />
        <Text style={styles.errorText}>Projeto não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderTaskItem = ({ item }: { item: Tarefa }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.titulo}</Text>
      <Text style={styles.taskDescription}>{item.descricao}</Text>
      {item.responsavel && <Text style={styles.taskInfo}>Responsável: {item.responsavel}</Text>}
      <View style={[styles.taskStatusBadge, styles[`status_${item.status}`]]}>
        <Text style={styles.taskStatusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.projectName}>{project.nomeProjeto}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações do Projeto</Text>
          <InfoRow label="Cliente" value={project.nomeCliente} />
          <InfoRow label="Descrição" value={project.descricao} multiline />
          <InfoRow label="Status" value={project.status} />
          <InfoRow label="Data de Início" value={formatDate(project.dataInicio)} />
          <InfoRow label="Data de Fim" value={formatDate(project.dataFim)} />
        </View>

        <View style={styles.card}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
            <Text style={styles.cardTitle}>Tarefas Pendentes ({pendingTasks.length})</Text>
            <TouchableOpacity 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#4169E1',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
              }} 
              onPress={() => setTaskModalVisible(true)}
            >
              <MaterialIcons name="add" size={20} color="#FFF" />
              <Text style={{color: '#FFF', marginLeft: 4}}>Nova Tarefa</Text>
            </TouchableOpacity>
          </View>
          {pendingTasks.length > 0 ? (
            <FlatList
              data={pendingTasks}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false} 
            />
          ) : (
            <Text style={styles.noTasksText}>Nenhuma tarefa pendente para este projeto.</Text>
          )}
        </View>
        
        {/* Modal para Nova Tarefa */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={taskModalVisible}
          onRequestClose={() => {
            setTaskModalVisible(!taskModalVisible);
            // Limpar campos ao fechar se desejar
            setNewTaskTitle('');
            setNewTaskDescription('');
          }}
        >
          <Pressable 
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center'
            }} 
            onPress={() => setTaskModalVisible(false)}
          >
            <Pressable 
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20,
                width: '90%',
                alignSelf: 'center',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }} 
              onPress={(e) => e.stopPropagation()}
            >
                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>Adicionar Nova Tarefa</Text>
                <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#DDD',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      marginBottom: 15
                    }}
                    placeholder="Título da Tarefa"
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                />
                <TextInput
                    style={[{ 
                      borderWidth: 1,
                      borderColor: '#DDD',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      marginBottom: 15,
                      height: 100, 
                      textAlignVertical: 'top' 
                    }]}
                    placeholder="Descrição (opcional)"
                    value={newTaskDescription}
                    onChangeText={setNewTaskDescription}
                    multiline
                    numberOfLines={3}
                />
                {/* Adicionar Picker para Status e Responsável se necessário */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                    <TouchableOpacity
                        style={{backgroundColor: '#EEE', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8}}
                        onPress={() => {
                            setTaskModalVisible(false);
                            setNewTaskTitle('');
                            setNewTaskDescription('');
                        }}
                    >
                        <Text style={{color: '#666', fontSize: 16}}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor: '#4169E1', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8}}
                        onPress={handleCreateTask}
                    >
                        <Text style={{color: '#FFF', fontSize: 16}}>Salvar Tarefa</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
          </Pressable>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value, multiline = false }: { label: string, value: string | undefined, multiline?: boolean }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={multiline ? styles.infoValueMultiline : styles.infoValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#4169E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 15,
    padding: 5, // Área de toque maior
  },
  projectName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Permite que o texto quebre se for muito longo
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4169E1',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    width: 120, // Largura fixa para o label
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Permite que o valor ocupe o espaço restante
  },
  infoValueMultiline: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  noTasksText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  taskCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DDD', // Cor padrão, será sobrescrita pelo status
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  taskInfo: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
  taskStatusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  status_pendente: {
    backgroundColor: '#FFD700', // Amarelo para pendente
    borderLeftColor: '#FFB300',
  },
  status_em_andamento: {
    backgroundColor: '#4169E1', // Azul para em andamento
    borderLeftColor: '#3558B5',
  },
  status_concluido: {
    backgroundColor: '#32CD32', // Verde para concluído
    borderLeftColor: '#28A428',
  },
});