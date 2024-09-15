import {View, Text, StyleSheet, ScrollView} from 'react-native'
import {useLocalSearchParams} from 'expo-router'
import exercises from '../../assets/data/exercises.json'
import {Stack} from 'expo-router'
import { useState } from 'react'
import NewSetInput from '../components/NewSetInput'
import SetsList from '../components/SetsList'

export default function ExerciseDetailsScreen(){
    const [isInstructionExpanded, setIsInstructionExpanded] = useState(false)
    const params = useLocalSearchParams();
    
    const exercise = exercises.find(item => item.name === params.name)

    if(!exercise){
        return <Text>Exercise not found</Text>
    }

    return(
        <View contentContainerStyle={styles.container}>
            <Stack.Screen options={{title: exercise.name}}/>
            <SetsList 
            ListHeaderComponent={() => (
            <View style={{ gap: 5 }}>
                <View style={styles.panel}>
                    <Text  style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseSubtitle}>
                        <Text style={styles.subValue}>{exercise.muscle}</Text> |{' '} 
                        <Text style={styles.subValue}>{exercise.equipment}</Text>
                    </Text>
                </View>

                <View style={styles.panel}>
                    <Text style={styles.instructions} numberOfLines={isInstructionExpanded ? 0 : 3}>
                        {exercise.instructions}
                    </Text>
                    <Text onPress={() => setIsInstructionExpanded(!isInstructionExpanded)} style={styles.seeMore}>{isInstructionExpanded ? 'See less' : 'See more'}</Text>
                </View>

                <NewSetInput exerciseName={exercise.name} />
            </View>
           )}
            exerciseName={exercise.name} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    panel:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: '500',
    },
    exerciseSubtitle: {
        color: 'dimgray',
    },
    subValue: {
        textTransform: 'capitalize',
    },
    instructions: {
        fontSize: 16,
        lineHeight: 22,
    },
    seeMore: {
        alignSelf: 'center',
        padding: 5,
        fontWeight: '600',
        color: 'gray',
    }
})