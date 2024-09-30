import { View, Text, Pressable, ScrollView, Alert, LogBox } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Link } from 'expo-router'; // Asegúrate de estar usando Expo Router
import { useFocusEffect } from '@react-navigation/native'; // Para detectar el enfoque
import * as FileSystem from 'expo-file-system';

const fileUri = FileSystem.documentDirectory + 'rutinas.json'; // Archivo donde se guardan las rutinas

const RutinasPlan = () => {
  // Estado para la cantidad de días y la rutina
  const [days, setDays] = useState(3); // Iniciamos con 3 días de rutina
  const [rutina, setRutina] = useState({
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
  });

  // Función para cargar la rutina desde el archivo
  const loadRoutine = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const routineData = await FileSystem.readAsStringAsync(fileUri);
        const parsedData = JSON.parse(routineData);
        setRutina(parsedData); // Cargamos la rutina del archivo
      } else {
        // Alert.alert('Error', 'El archivo de rutina no existe.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al cargar la rutina.');
    }
  };

  // Usamos useFocusEffect para recargar la rutina cada vez que la pantalla esté enfocada
  useFocusEffect(
    useCallback(() => {
      loadRoutine(); // Cargar la rutina cuando la pantalla esté enfocada
    }, [])
    
  );

  // Renderizamos cada día
  const renderDay = (day, index) => (
    <Link
      href={{
        pathname: '/addRoutine', // Ruta para agregar la rutina
        params: {
          day: day,
          dia: `Día ${index + 1}`, // Pasamos el nombre del día
          routine: JSON.stringify(rutina[day]) // Convertimos la rutina en un string JSON
        }
      }}
      asChild
      key={index}
    >
      <Pressable style={styles.dayContainer}>
        <Text style={styles.dayTitle}>Día {index + 1}</Text>
        {/* Aquí se mostrarían los ejercicios del día */}
        <Text>
          Ejercicios: {rutina[day].length > 0 ? rutina[day].map(ex => ex.name).join(', ') : 'No hay ejercicios'}
        </Text>
      </Pressable>
    </Link>
  );

  const deleteRoutineFile = async () => {
    const fileUri = FileSystem.documentDirectory + 'rutinas.json';
    try {
      await FileSystem.deleteAsync(fileUri);
      console.log('Archivo de rutinas eliminado.');
    } catch (error) {
      console.log('Error al eliminar el archivo:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Contador de días */}
      <View style={styles.counterContainer}>
        <Pressable
          onPress={() => setDays(prev => Math.max(1, prev - 1))} // Limita a un mínimo de 1
          style={styles.counterButton}
        >
          <Text style={styles.counterText}>-</Text>
        </Pressable>
        <Text style={styles.counterDisplay}>Cantidad de días: {days}</Text>
        <Pressable
          onPress={() => setDays(prev => Math.min(7, prev + 1))} // Limita a un máximo de 7
          style={styles.counterButton}
        >
          <Text style={styles.counterText}>+</Text>
        </Pressable>
      </View>

      {/* Mostramos los días disponibles para agregar rutinas */}
      {Object.keys(rutina).slice(0, days).map((day, index) => renderDay(day, index))}
      <Pressable onPress={deleteRoutineFile} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Eliminar archivo de rutinas</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = {
  container: {
    padding: 16
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  counterButton: {
    padding: 13,
    backgroundColor: '#fd5c63',
    borderRadius: 8
  },
  counterText: {
    fontSize: 20,
    color: 'white'
  },
  counterDisplay: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: '600'
  },
  dayContainer: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700'
  }
};

export default RutinasPlan;
