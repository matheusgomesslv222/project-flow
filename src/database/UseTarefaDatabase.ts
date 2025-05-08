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
    // A linha abaixo era inalcançável e foi removida.
  }
  // Outras funções: update, delete, getTarefaById...

  return { create, getTarefasByProjectId /* ...outras funções */ };
}