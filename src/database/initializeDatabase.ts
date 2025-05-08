import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, 
            email TEXT NOT NULL, 
            password TEXT NOT NULL
        );

        DROP TABLE IF EXISTS projetos;
        CREATE TABLE IF NOT EXISTS projetos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            nomeCliente TEXT NOT NULL,
            nomeProjeto TEXT NOT NULL,
            descricao TEXT NOT NULL,
            status TEXT NOT NULL,
            dataInicio TEXT NOT NULL,
            dataFim TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id)
        );
        
        DROP TABLE IF EXISTS tarefas;
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projetoId INTEGER NOT NULL,
            nomeTarefa TEXT NOT NULL,
            descricao TEXT NOT NULL,
            status TEXT NOT NULL,
            dataInicio TEXT NOT NULL,
            dataFim TEXT NOT NULL,
            FOREIGN KEY (projetoId) REFERENCES projetos(id)
        );
        `
    ); 
}