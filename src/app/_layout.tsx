import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { AuthProvider } from '@/contexts/AuthContext';
import { initializeDatabase } from '@/database/initializeDatabase';
import Toast from 'react-native-toast-message';

export default function Layout() {
    return (
        <>
            <SQLiteProvider databaseName='myDatabase.db' onInit={initializeDatabase}>
                <AuthProvider>
                    <Slot />
                </AuthProvider>
            </SQLiteProvider>
            <Toast/>
        </>
    );
}