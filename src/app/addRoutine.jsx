import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import * as FileSystem from 'expo-file-system';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importamos el Tab Navigator
import { useFocusEffect } from '@react-navigation/native'; // Importa useFocusEffect
import { useCallback } from 'react'; // Importa useCallback si no lo tienes
import Entypo from '@expo/vector-icons/Entypo';

const fileUri = FileSystem.documentDirectory + 'rutinas.json'; // Archivo donde se guardan las rutinas

// Pestaña que muestra los ejercicios
const RoutineView = ({ day}) => {
  const [exercises, setExercises] = useState([]);
  const { dia } = useLocalSearchParams(); 

  useFocusEffect(
    useCallback(() => {
      const loadRoutine = async () => {
        try {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
  
          if (!fileInfo.exists) {
            // Inicializamos una rutina vacía si no existe el archivo
            const initialData = {
              day1: [], day2: [], day3: [], day4: [], day5: [], day6: [], day7: []
            };
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(initialData));
            setExercises([]);
          } else {
            // Si el archivo existe, cargamos la rutina
            const routineData = await FileSystem.readAsStringAsync(fileUri);
            const parsedData = JSON.parse(routineData);
            setExercises(parsedData[day.toLowerCase()] || []);
          }
        } catch (error) {
          Alert.alert('Error', 'Hubo un error al cargar la rutina.');
        }
      };
  
      loadRoutine();
    }, [day])
  );

  // Función para eliminar un ejercicio
  const deleteExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    saveRoutine(updatedExercises);
  };

  const saveRoutine = async (updatedExercises) => {
    try {
      const routineData = await FileSystem.readAsStringAsync(fileUri);
      const parsedData = JSON.parse(routineData);
      
      parsedData[day.toLowerCase()] = updatedExercises;

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(parsedData));
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al guardar la rutina.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con el nombre del día */}
      <View style={styles.header}>
        <Text style={styles.dayTitle}>{dia}</Text>
      </View>

      {exercises.length > 0 ? (
        exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseContainer}>
            {/* Nombre del ejercicio en su propia línea */}
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            
            {/* Sets y Reps en una fila separada */}
            <View style={styles.exerciseDetailsRow}>
              <Text style={styles.exerciseDetails}>Sets: {exercise.sets}</Text>
              <Text style={styles.exerciseDetails}>Reps: {exercise.reps}</Text>
            </View>
            
            {/* Botón para eliminar */}
            <Pressable onPress={() => deleteExercise(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text style={styles.noExerciseText}>No hay ejercicios agregados para este día.</Text>
      )}
    </ScrollView>
  );
};

// Pestaña que muestra el formulario para agregar ejercicios
const AddExerciseForm = ({ day }) => {
  const [newExerciseName, setNewExerciseName] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);

  const saveRoutine = async (updatedExercises) => {
    try {
      const routineData = await FileSystem.readAsStringAsync(fileUri);
      const parsedData = JSON.parse(routineData);
      
      parsedData[day.toLowerCase()] = updatedExercises;

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(parsedData));
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al guardar la rutina.');
    }
  };

  const addExercise = async () => {
    try {
      const routineData = await FileSystem.readAsStringAsync(fileUri);
      const parsedData = JSON.parse(routineData);
      const updatedExercises = [...(parsedData[day.toLowerCase()] || []), { name: newExerciseName, sets, reps }];
      await saveRoutine(updatedExercises);
      setNewExerciseName('');
      setSets(0);
      setReps(0);
    } catch (error) {
      Alert.alert("Algo salio mal")
    }
  };

  return (
    <View style={styles.addExerciseContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del ejercicio"
        value={newExerciseName}
        onChangeText={setNewExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        keyboardType="numeric"
        value={sets.toString()}
        onChangeText={(value) => setSets(Number(value))}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        keyboardType="numeric"
        value={reps.toString()}
        onChangeText={(value) => setReps(Number(value))}
      />
      <Pressable onPress={addExercise} style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar ejercicio</Text>
      </Pressable>
    </View>
  );
};

// Creamos el Tab Navigator
const Tab = createBottomTabNavigator();

const AddRoutineScreen = () => {
  const { day, dia } = useLocalSearchParams(); // Recibimos el día como parámetro

  return (
    <Tab.Navigator>
      {/* Pestaña para ver la rutina */}
      <Tab.Screen name="Ver Rutina" options={{ tabBarLabel: 'Rutina', headerShown:false, tabBarIcon: () => <Entypo name="list" size={24} color="black" /> }}>
        {() => <RoutineView day={day} />}
      </Tab.Screen>

      {/* Pestaña para agregar un ejercicio */}
      <Tab.Screen name="Agregar Ejercicio" options={{ tabBarLabel: 'Agregar Ejercicio', tabBarIcon: () => <Entypo name="add-to-list" size={24} color="black" /> }}>
        {() => <AddExerciseForm day={day} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fd5c63',
    borderRadius: 8,
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseDetails: {
    fontSize: 14,
    color: 'gray',
  },
  exerciseDetailsRow: {
    flexDirection: 'row', // Coloca los sets y reps en una fila
    justifyContent: 'space-between', // Distribuye espacio entre sets y reps
    marginBottom: 12, // Añade espacio debajo de la fila
  },
  deleteButton: {
    backgroundColor: '#ff5c5c',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noExerciseText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  addExerciseContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#fd5c63',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
  },
});

export default AddRoutineScreen;
