import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs 
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 4,
                    backgroundColor: '#FFFFFF',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#4169E1',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="tarefas"
                options={{
                    title: 'Tarefas',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="assignment" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
} 