import { useSQLiteContext } from "expo-sqlite";

export type ProjetoDatabase = { // Renomeie ou use um alias se 'Projeto' já estiver em uso
    id: number;
    userId: number; 
    nomeCliente: string;
    nomeProjeto: string;
    descricao: string;
    status: string;
    dataInicio: Date; // Ou string, dependendo de como armazena/retorna
    dataFim: Date;   // Ou string
}

export function useProjetoDatabase() {
    const database = useSQLiteContext();


    async function create(data : Omit<ProjetoDatabase, "id">) { // data agora deve incluir userId
        const statement = await database.prepareAsync(
            "INSERT INTO projetos (userId, nomeCliente, nomeProjeto, descricao, status, dataInicio, dataFim) VALUES ($userId, $nomeCliente, $nomeProjeto , $descricao, $status, $dataInicio, $dataFim);"
        )

        try {
            const result = await statement.executeAsync({
                $userId: data.userId, // Adicionado userId
                $nomeCliente: data.nomeCliente,
                $nomeProjeto: data.nomeProjeto,
                $descricao: data.descricao,
                $status: data.status,
                $dataInicio: data.dataInicio.toISOString(),
                $dataFim: data.dataFim.toISOString()
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()
            console.log("projeto criado", insertedRowId);
            return {insertedRowId}

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function getProjetosByUserId(userId: number) {
        console.log("Buscando projetos do usuário", userId); // Adicionado log de depuraçã
        const statement = await database.prepareAsync(
            "SELECT * FROM projetos WHERE userId = $userId" // Adicionado filtro por userId
        )

        try {
            const result = await statement.executeAsync({ $userId: userId }) // Passando userId
            const projetos = await result.getAllAsync();
            console.log("Projetos do usuário", userId, projetos);
            return projetos
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function getProjetoById(id: number) {
        const statement = await database.prepareAsync(
            "SELECT * FROM projetos WHERE id = $id"
        );
        try {
            const result = await statement.executeAsync({ $id: id });
            const projeto = await result.getFirstAsync(); // Pega o primeiro resultado
            console.log("Projeto encontrado por ID:", id, projeto);
            // Se as datas são strings no DB, converta para Date aqui se necessário
            // if (projeto) {
            //   projeto.dataInicio = new Date(projeto.dataInicio);
            //   projeto.dataFim = new Date(projeto.dataFim);
            // }
            return projeto; // Retorna o objeto do projeto ou null
        } catch (error) {
            console.error("Erro ao buscar projeto por ID:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

  async function deleteProject(id: number) {
    const statement = await database.prepareAsync("DELETE FROM projetos WHERE id = $id");
    try {
      const result = await statement.executeAsync({ $id: id });
      deleteProjectTasks(id)
      console.log(`Projeto com ID ${id} deletado com sucesso.`);
      return result;
    } catch (error) {
      console.error(`Erro ao deletar projeto com ID ${id}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function deleteProjectTasks(projectId: number) {
    const statement = await database.prepareAsync(
      "DELETE FROM tarefas WHERE projetoId = $projectId"
    );
    try {
      const result = await statement.executeAsync({ $projectId: projectId });
      console.log(`All tasks for project ID ${projectId} deleted successfully.`);
      return result;
    } catch (error) {
      console.error(`Error deleting tasks for project ID ${projectId}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function editProject(id: number, data: Partial<Omit<ProjetoDatabase, 'id' | 'userId'>>) {
    const updateFields = Object.keys(data)
      .map(key => `${key} = $${key}`)
      .join(', ');

    const statement = await database.prepareAsync(
      `UPDATE projetos SET ${updateFields} WHERE id = $id`
    );

    try {
      const params = {
        ...Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            `$${key}`,
            key.includes('data') ? (value instanceof Date ? value.toISOString() : value) : value
          ])
        ),
        $id: id
      };

      const result = await statement.executeAsync(params);
      console.log(`Projeto com ID ${id} atualizado com sucesso.`);
      return result;
    } catch (error) {
      console.error(`Erro ao atualizar projeto com ID ${id}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateProjectStatus(id: number, status: string) {
    const statement = await database.prepareAsync(
      "UPDATE projetos SET status = $status WHERE id = $id"
    );
    try {
      const result = await statement.executeAsync({
        $status: status,
        $id: id
      });
      console.log(`Status do projeto ${id} atualizado para ${status}.`);
      return result;
    } catch (error) {
      console.error(`Erro ao atualizar status do projeto ${id}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return { create, getProjetosByUserId, getProjetoById, deleteProject, editProject, updateProjectStatus }; // Adicione a nova função
}