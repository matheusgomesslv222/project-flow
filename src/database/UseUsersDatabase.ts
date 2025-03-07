import { useSQLiteContext } from "expo-sqlite";

export type UserDatabase = {
    id: number;
    nome: string;
    email: string;
    password: string;
}

export function useUsersDatabase() {
    const database = useSQLiteContext();


    async function create(data : Omit<UserDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO users (name, email, password) VALUES ($name, $email , $password);"
        )

        try {
            const result = await statement.executeAsync({
                $name: data.nome,
                $email: data.email,
                $password: data.password
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            return {insertedRowId}

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function searchUser(email: string, password: string){
            if(email === "" || password === ""){
                throw new Error("Email e senha são obrigatórios");
            }
            try{
                const query = "SELECT * FROM users WHERE email = $email AND password = $password";
                
                
                const response = await database.getAllAsync(query, `${email}`, `${password}`);
                console.log(response);
                return response;
            } catch (error) {
                console.error(error);
            }
        }
  return {create , searchUser};
}