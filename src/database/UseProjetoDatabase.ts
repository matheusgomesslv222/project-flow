import { useSQLiteContext } from "expo-sqlite";

export type ProjetoDatabase = {
    id: number;
    nomeCliente: string;
    nomeProjeto: string;
    descricao: string;
    status: string;
    dataInicio: Date;
    dataFim: Date;
}

export function useProjetoDatabase() {
    const database = useSQLiteContext();


    async function create(data : Omit<ProjetoDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO projetos ( nomeCliente, nomeProjeto, descricao, status, dataInicio, dataFim) VALUES ($nomeCliente, $nomeProjeto , $descricao, $status, $dataInicio, $dataFim);"
        )

        try {
            const result = await statement.executeAsync({
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

    async function getAllProjetos() {
        
        const statement = await database.prepareAsync(
            "SELECT * FROM projetos"
        )

        try {
            const result = await statement.executeAsync()
            const projetos = await result.getAllAsync();
            console.log("Projetos", projetos);
            return projetos
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }


    }

  return {create, getAllProjetos};
}