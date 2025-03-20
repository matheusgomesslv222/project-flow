import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "@/components/Input";

export default function Tarefas() {
  const { user } = useAuth();
  const [status, setStatus] = useState("pendente");
  const [modalVisible, setModalVisible] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: "",
    descricao: "",
    status: "pendente",
    projeto: "",
    responsavel: "",
  });

  // Dados mockados para exemplo
  const tarefas = [
    {
      id: "1",
      titulo: "Desenvolver tela de login",
      descricao: "Implementar autenticação de usuários",
      status: "pendente",
      projeto: "App de Delivery",
      responsavel: "João Silva",
    },
    {
      id: "2",
      titulo: "Criar banco de dados",
      descricao: "Modelar e implementar banco de dados",
      status: "em_andamento",
      projeto: "Sistema de Gestão Escolar",
      responsavel: "Maria Santos",
    },
    {
      id: "3",
      titulo: "Testes unitários",
      descricao: "Implementar testes automatizados",
      status: "concluido",
      projeto: "Website Institucional",
      responsavel: "Pedro Oliveira",
    },
  ];

  const handleSalvarTarefa = () => {
    // Aqui você implementará a lógica para salvar a tarefa
    console.log("Nova tarefa:", novaTarefa);
    setModalVisible(false);
    // Limpar o formulário
    setNovaTarefa({
      titulo: "",
      descricao: "",
      status: "pendente",
      projeto: "",
      responsavel: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "#FFD700";
      case "em_andamento":
        return "#4169E1";
      case "concluido":
        return "#32CD32";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "em_andamento":
        return "Em Andamento";
      case "concluido":
        return "Concluído";
      default:
        return status;
    }
  };

  const renderTarefa = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(item.status),
        marginBottom: 12,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.titulo}</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>{item.descricao}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text style={{ color: "#666" }}>Projeto: {item.projeto}</Text>
        <Text style={{ color: "#666" }}>Responsável: {item.responsavel}</Text>
      </View>
      <View
        style={{
          backgroundColor: "#F0F0F0",
          padding: 4,
          borderRadius: 4,
          alignSelf: "flex-start",
          marginTop: 8,
        }}
      >
        <Text style={{ color: getStatusColor(item.status) }}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Tarefas</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#4169E1",
              padding: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add" size={24} color="#FFF" />
            <Text style={{ color: "#FFF", marginLeft: 4 }}>Nova Tarefa</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: 20,
                width: "90%",
                maxHeight: "80%",
              }}
            >
              <ScrollView>
                <View style={{ gap: 16 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 16,
                    }}
                  >
                    Nova Tarefa
                  </Text>

                  <View>
                    <Text style={{ marginBottom: 4 }}>Título</Text>
                    <Input
                      placeholder="Digite o título da tarefa"
                      value={novaTarefa.titulo}
                      onChangeText={(text) =>
                        setNovaTarefa({ ...novaTarefa, titulo: text })
                      }
                    />
                  </View>

                  <View>
                    <Text style={{ marginBottom: 4 }}>Descrição</Text>
                    <TextInput
                      style={{
                        height: 100,
                        borderWidth: 1,
                        borderRadius: 7,
                        borderColor: "#999",
                        paddingHorizontal: 16,
                        textAlignVertical: "top",
                        padding: 8,
                      }}
                      multiline
                      placeholder="Digite a descrição da tarefa"
                      value={novaTarefa.descricao}
                      onChangeText={(text) =>
                        setNovaTarefa({ ...novaTarefa, descricao: text })
                      }
                    />
                  </View>

                  <View>
                    <Text style={{ marginBottom: 4 }}>Projeto</Text>
                    <Input
                      placeholder="Digite o nome do projeto"
                      value={novaTarefa.projeto}
                      onChangeText={(text) =>
                        setNovaTarefa({ ...novaTarefa, projeto: text })
                      }
                    />
                  </View>

                  <View>
                    <Text style={{ marginBottom: 4 }}>Responsável</Text>
                    <Input
                      placeholder="Digite o nome do responsável"
                      value={novaTarefa.responsavel}
                      onChangeText={(text) =>
                        setNovaTarefa({ ...novaTarefa, responsavel: text })
                      }
                    />
                  </View>

                  <View>
                    <Text style={{ marginBottom: 4 }}>Status</Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 7,
                        borderColor: "#999",
                      }}
                    >
                      <Picker
                        selectedValue={novaTarefa.status}
                        onValueChange={(itemValue) =>
                          setNovaTarefa({ ...novaTarefa, status: itemValue })
                        }
                      >
                        <Picker.Item label="Pendente" value="pendente" />
                        <Picker.Item
                          label="Em Andamento"
                          value="em_andamento"
                        />
                        <Picker.Item label="Concluído" value="concluido" />
                      </Picker>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 16,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#666",
                        padding: 12,
                        borderRadius: 8,
                        flex: 1,
                        marginRight: 8,
                      }}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={{ color: "#FFF", textAlign: "center" }}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#4169E1",
                        padding: 12,
                        borderRadius: 8,
                        flex: 1,
                        marginLeft: 8,
                      }}
                      onPress={handleSalvarTarefa}
                    >
                      <Text style={{ color: "#FFF", textAlign: "center" }}>
                        Salvar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View
          style={{
            backgroundColor: "#F0F0F0",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            Filtrar por Status
          </Text>
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "#DDD",
            }}
          >
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Todas" value="todas" />
              <Picker.Item label="Pendentes" value="pendente" />
              <Picker.Item label="Em Andamento" value="em_andamento" />
              <Picker.Item label="Concluídas" value="concluido" />
            </Picker>
          </View>
        </View>

        <FlatList
          data={tarefas.filter(
            (tarefa) => status === "todas" || tarefa.status === status
          )}
          renderItem={renderTarefa}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
