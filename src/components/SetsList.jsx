import { Text, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

const SetsList = ({ exerciseName, ListHeaderComponent }) => {
    const [sets, setSets] = useState([]);

    // Ruta del archivo sets.json
    const fileUri = FileSystem.documentDirectory + 'sets.json';

    // Leer los sets guardados en el archivo
    const loadSets = async () => {
        try {
            const fileExists = await FileSystem.getInfoAsync(fileUri);
            if (fileExists.exists) {
                const data = await FileSystem.readAsStringAsync(fileUri);
                const parsedData = JSON.parse(data);

                // Filtrar los sets por el nombre del ejercicio y ordenarlos por ID descendente
                const filteredSets = parsedData
                    .filter(set => set.exerciseName === exerciseName)
                    .sort((a, b) => b.id - a.id);  // Ordenar por ID descendente

                setSets(filteredSets);
            } else {
                console.warn('No se encontró el archivo sets.json');
            }
        } catch (error) {
            console.error('Error al cargar los sets:', error);
        }
    };

    // Eliminar un set específico
    const deleteSet = async (id) => {
        try {
            const data = await FileSystem.readAsStringAsync(fileUri);
            const parsedData = JSON.parse(data);

            // Filtrar los sets para eliminar el seleccionado
            const updatedData = parsedData.filter(set => set.id !== id);

            // Guardar los datos actualizados en el archivo
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData));

            // Actualizar el estado con los sets restantes
            setSets(updatedData.filter(set => set.exerciseName === exerciseName));
        } catch (error) {
            console.error('Error al eliminar el set:', error);
        }
    };

    // Cargar los sets al montar el componente
    useEffect(() => {
        loadSets();
    }, []);

    return (
        <FlatList
            data={sets}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()} // Asegúrate de convertir el ID a string
            renderItem={({ item }) => (
                <View style={styles.setContainer}>
                    <Text style={styles.setText}>
                        {item.reps} reps x {item.weight} kg
                    </Text>
                    <TouchableOpacity onPress={() => deleteSet(item.id)}>
                        <Text style={styles.deleteButton}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    setText: {
        fontSize: 16,
    },
    deleteButton: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default SetsList;

