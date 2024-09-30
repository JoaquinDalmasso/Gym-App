import { View, Text, SafeAreaView, Pressable, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router'; // Cambia a useLocalSearchParams
import * as FileSystem from 'expo-file-system';
import {Stack} from 'expo-router'

const DiaryPlan = () => {
  const { day, meals } = useLocalSearchParams(); // Obtén los parámetros de la navegación
  const parsedMeals = JSON.parse(meals); // Parseamos las comidas recibidas como parámetro

  const [option, setOption] = useState(""); // Opción seleccionada (Desayuno, Almuerzo, etc.)
  const [menu, setMenu] = useState(parsedMeals); // Estado inicial con las comidas recibidas
  const [titulo, setTitulo] = useState(""); // Estado para el título de la comida seleccionada
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción de la comida seleccionada

  // Función para manejar la selección de una comida y cargar sus valores iniciales
  const handleSelectOption = (mealType) => {
    setOption(mealType);
    const meal = menu[mealType.toLowerCase()];
    setTitulo(meal?.titulo || "");
    setDescripcion(meal?.descripcion || "");
  };
  const fileUri = FileSystem.documentDirectory + 'dietas.json';
// Función para guardar cambios en la comida seleccionada
const handleSaveMeal = async () => {
    try {
      // Leer el contenido actual del archivo
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const currentDiet = JSON.parse(fileContent); // Parsear el contenido a un objeto
  
      // Actualizar el menú con los nuevos valores
      const updatedMenu = {
        ...currentDiet[day], // Mantener las comidas existentes para el día
        [option.toLowerCase()]: { titulo, descripcion }
      };
  
      // Guardar los cambios en el archivo original
      currentDiet[day] = updatedMenu; // Actualiza el día en el objeto de dieta
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(currentDiet), {
        encoding: FileSystem.EncodingType.UTF8
      });
  
      console.log('Dieta guardada correctamente en el archivo.');
    } catch (e) {
      console.log('Error al guardar la dieta en el archivo:', e);
    }
  };

// Función para cargar la dieta guardada
const loadMeals = async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const diet = JSON.parse(fileContent);
      setMenu(diet[day]); // Establecer el menú para el día actual
    } catch (e) {
      console.log('Error al cargar la dieta desde el archivo:', e);
    }
  };

// Llamar a loadMeals al montar el componente para cargar la dieta
useEffect(() => {
  loadMeals();
}, []);


  return (
    <SafeAreaView>
      <Stack.Screen options={{title: day.toLocaleUpperCase()}}/>
      {/* Header */}
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#fd5c63'
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{day.toUpperCase()}</Text>
        </View>
        <Text style={{ flex: 1, color: 'white' }}>Delete</Text>
      </View> */}

      {/* Botones para seleccionar tipo de comida */}
      <View style={{ marginVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'center' }}>
        <Pressable
          onPress={() => handleSelectOption("Desayuno")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: option == "Desayuno" ? '#fd5c63' : 'white',
            borderRadius: 25
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: option == 'Desayuno' ? 'white' : 'black' }}>Desayuno</Text>
        </Pressable>

        <Pressable
          onPress={() => handleSelectOption("Almuerzo")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: option == "Almuerzo" ? '#fd5c63' : 'white',
            borderRadius: 25
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: option == 'Almuerzo' ? 'white' : 'black' }}>Almuerzo</Text>
        </Pressable>

        <Pressable
          onPress={() => handleSelectOption("Merienda")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: option == "Merienda" ? '#fd5c63' : 'white',
            borderRadius: 25
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: option == 'Merienda' ? 'white' : 'black' }}>Merienda</Text>
        </Pressable>

        <Pressable
          onPress={() => handleSelectOption("Cena")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: option == "Cena" ? '#fd5c63' : 'white',
            borderRadius: 25
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: option == 'Cena' ? 'white' : 'black' }}>Cena</Text>
        </Pressable>
      </View>

      {/* Muestra la comida correspondiente según la opción seleccionada */}
      {option ? (
        <View style={{ }}>
          {/* Input para el título */}
          <TextInput
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 10, marginVertical: 10 }}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />

          {/* Input para la descripción */}
          <TextInput
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 10, marginVertical: 10, height: 100 }}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          {/* Botón para guardar la comida */}
          <Pressable
            onPress={handleSaveMeal}
            style={{ padding: 10, backgroundColor: '#fd5c63', borderRadius: 8, marginVertical: 5 }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Guardar</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '600', color: 'gray' }}>Selecciona una comida para editar</Text>
      )}
    </SafeAreaView>
  );
};

export default DiaryPlan;
