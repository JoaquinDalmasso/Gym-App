import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';

const NewSetInput = ({ exerciseName }) => {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const addSet = async () => {
        console.warn('Add set: ', reps, weight, exerciseName);
    
        // Ruta del archivo donde se guardarán los sets
        const fileUri = FileSystem.documentDirectory + 'sets.json';
    
        try {
            // Verificar si el archivo ya existe
            const fileExists = await FileSystem.getInfoAsync(fileUri);
    
            let newId = 1; // Inicializamos el ID con 1
    
            if (fileExists.exists) {
                // Si el archivo existe, leer los datos actuales
                const currentData = await FileSystem.readAsStringAsync(fileUri);
                const parsedData = JSON.parse(currentData);
    
                if (parsedData.length > 0) {
                    // Buscar el mayor ID en los datos existentes
                    const lastId = Math.max(...parsedData.map(set => set.id));
                    newId = lastId + 1; // Incrementar el mayor ID para el nuevo set
                }
            }
    
            // Crear un nuevo set con el ID correlativo
            const newSet = {
                id: newId, // Usamos el ID correlativo
                reps,
                weight,
                exerciseName, // Guardar el nombre del ejercicio
            };
    
            if (!fileExists.exists) {
                // Si el archivo no existe, crear uno nuevo con el set
                await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([newSet]));
            } else {
                // Si el archivo existe, leer los datos actuales
                const currentData = await FileSystem.readAsStringAsync(fileUri);
                const parsedData = JSON.parse(currentData);
    
                // Agregar el nuevo set a los datos existentes
                parsedData.push(newSet);
    
                // Escribir los datos actualizados en el archivo
                await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(parsedData));
            }
    
            console.log('Set guardado correctamente');
        } catch (error) {
            console.error('Error al guardar el set:', error);
        }
    
        setReps(''); // Limpiar campos
        setWeight('');
    };

    return (
        <View>
            <TextInput
                value={reps}
                onChangeText={setReps}
                placeholder="Reps"
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="Weight"
                style={styles.input}
                keyboardType="numeric"
            />
            <Button title="Add" onPress={addSet} />
        </View>
    );
};

const styles = StyleSheet.create({
    constainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        gap: 10,
    },
    input:{
        borderWidth: 1,
        borderColor: 'gainsboro',
        padding: 10,
        flex: 1,
        borderRadius: 5,
    }
})

export default NewSetInput;
