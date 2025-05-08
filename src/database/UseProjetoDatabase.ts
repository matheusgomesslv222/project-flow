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

  return {create, getProjetosByUserId, getProjetoById }; // Adicione a nova função
}