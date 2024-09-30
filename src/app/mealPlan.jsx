import React, { useState } from 'react';
import { Link } from 'expo-router';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

const fileUri = FileSystem.documentDirectory + 'dietas.json';

const MealPlan = () => {
  // Estado para guardar la dieta de cada día
  const [diet, setDiet] = useState(null);

  // Cargar el archivo de dieta cuando el componente se monta
  useFocusEffect(
    React.useCallback(() => {
      const loadDietData = async () => {
        try {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) {
            const defaultDiet = {
              lunes: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} },
              martes: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} },
              miercoles: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} },
              jueves: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} },
              viernes: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} },
              sabado: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} },
              domingo: { desayuno: {titulo: "-", descripcion: "-"}, almuerzo: {titulo: "-", descripcion: "-"}, merienda: {titulo: "-", descripcion: "-"}, cena: {titulo: "-", descripcion: "-"} }
            };
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(defaultDiet));
            setDiet(defaultDiet);
          } else {
            const dietData = await FileSystem.readAsStringAsync(fileUri);
            setDiet(JSON.parse(dietData));
          }
        } catch (error) {
          console.error("Error loading diet data: ", error);
        }
      };
  
      loadDietData();
    }, []) // El arreglo de dependencias se deja vacío para que se ejecute solo al cargar la pantalla
  );
  // Renderiza un día con los platos
  const renderDay = (day, meals) => (
    <Link
      href={{
        pathname: '/diaryPlan',
        params: { day, meals: JSON.stringify(meals) }  // Pasamos el día y las comidas como parámetros
      }}
      asChild
      key={day}
    >
      <Pressable style={styles.dayContainer}>
        <Text style={styles.dayTitle}>{day.toUpperCase()}</Text>
        <Text>Desayuno: {meals.desayuno.titulo}</Text>
        <Text>Almuerzo: {meals.almuerzo.titulo}</Text>
        <Text>Merienda: {meals.merienda.titulo}</Text>
        <Text>Cena: {meals.cena.titulo}</Text>
      </Pressable>
    </Link>
  );

  // Si la dieta aún no ha sido cargada, mostramos un mensaje
  if (!diet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando dieta...</Text>
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(diet).map(day => renderDay(day, diet[day]))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MealPlan;


