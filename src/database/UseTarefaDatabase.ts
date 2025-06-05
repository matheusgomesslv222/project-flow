import { useSQLiteContext } from "expo-sqlite";

export type Tarefa = {
  id: number;
  projetoId: number;
  nomeTarefa: string; // Alterado de titulo
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | string; // Mantendo a união para flexibilidade no TS, mas o DB armazena string
  dataInicio: string; // Adicionado
  dataFim: string;    // Adicionado
  // O campo responsavel foi removido pois não está no schema fornecido.
  // Se dataCriacao for gerenciada pelo app e não apenas DEFAULT CURRENT_TIMESTAMP, adicione aqui.
};

export function useTarefaDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<Tarefa, "id" | "status"> & { status: string; dataInicio: string; dataFim: string; nomeTarefa: string; descricao: string; projetoId: number }) { // Ajuste para garantir que os novos campos estejam presentes
    const statement = await database.prepareAsync(
      "INSERT INTO tarefas (projetoId, nomeTarefa, descricao, status, dataInicio, dataFim) VALUES ($projetoId, $nomeTarefa, $descricao, $status, $dataInicio, $dataFim)"
    );
    try {
      const result = await statement.executeAsync({
        $projetoId: data.projetoId,
        $nomeTarefa: data.nomeTarefa,
        $descricao: data.descricao,
        $status: data.status,
        $dataInicio: data.dataInicio,
        $dataFim: data.dataFim,
      });
      // result.lastInsertRowId é um número, não precisa de toLocaleString()
      const insertedRowId = result.lastInsertRowId;
      console.log("Tarefa criada com ID:", insertedRowId);
      return { insertedRowId };
    } catch (error) {
      console.error("Erro ao criar tarefa:", error); // Adicionado log de erro mais detalhado
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
    // A linha abaixo era inalcançável e foi removida.
  }

  async function getTarefasByProjectId(projetoId: number) {
    // Adicionando ORDER BY para consistência, por exemplo, pelas mais recentes ou por ID.
    const statement = await database.prepareAsync("SELECT * FROM tarefas WHERE projetoId = $projetoId ORDER BY id DESC");
    try {
      const result = await statement.executeAsync({ $projetoId: projetoId });
      const tarefas = await result.getAllAsync();
      console.log(`Tarefas encontradas para o projeto ${projetoId}:`, tarefas);
      return tarefas as Tarefa[]; // Certifique-se que o tipo Tarefa corresponde às colunas do DB
    } catch (error) {
      console.error(`Erro ao buscar tarefas para o projeto ${projetoId}:`, error); // Adicionado log de erro
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getAllTarefas() {
    const statement = await database.prepareAsync("SELECT * FROM tarefas ORDER BY id DESC");
    try {
      const result = await statement.executeAsync();
      const tarefas = await result.getAllAsync();
      console.log("Todas as tarefas encontradas:", tarefas);
      return tarefas as Tarefa[];
    } catch (error) {
      console.error("Erro ao buscar todas as tarefas:", error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function deleteTask(id: number) {
    console.log('TASK:', id)
    const statement = await database.prepareAsync("DELETE FROM tarefas WHERE id = $id");
    try {
      const result = await statement.executeAsync({ $id: id });
      console.log(`Tarefa com ID ${id} deletada com sucesso.`);
      return result;
    }catch (error) {
      console.error(`Erro ao deletar tarefa com ID ${id}:`, error);
      throw error;
    }
  }

  async function editTask(nomeTarefa: string, descricao: string, id: number) {
    const statement = await database.prepareAsync(
      "UPDATE tarefas SET nomeTarefa = $nomeTarefa, descricao = $descricao WHERE id = $id"
    );
    try {
      const result = await statement.executeAsync({
        $nomeTarefa: nomeTarefa,
        $descricao: descricao,
        $id: id
      });
      console.log(`Tarefa com ID ${id} atualizada com sucesso.`);
      return result;
    } catch (error) {
      console.error(`Erro ao atualizar tarefa com ID ${id}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateTaskStatus(id: number, status: string) {
    const statement = await database.prepareAsync(
      "UPDATE tarefas SET status = $status WHERE id = $id"
    );
    try {
      const result = await statement.executeAsync({
        $status: status,
        $id: id
      });
      console.log(`Status da tarefa ${id} atualizado para ${status}.`);
      return result;
    } catch (error) {
      console.error(`Erro ao atualizar status da tarefa ${id}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return { create, getTarefasByProjectId, getAllTarefas, deleteTask, editTask, updateTaskStatus };
}