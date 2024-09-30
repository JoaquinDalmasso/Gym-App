import {Stack} from 'expo-router'

export default function RootLayout(){
    return(
    <Stack>
        <Stack.Screen name="index" options={{title: 'Inicio'}}/>
        <Stack.Screen name="addRoutine" options={{title: 'Rutina'}}/>
        <Stack.Screen name="rutinasPlan" options={{title: 'Rutinas diarias'}}/>
    </Stack>
) 
}