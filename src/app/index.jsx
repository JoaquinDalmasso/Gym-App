import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'
import { StyleSheet, Text, View, Pressable } from 'react-native'

export default function App(){
    return(
        <View  style={styles.container}>
            <View style={{gap: 20}}>
                <Link href="/rutinasPlan" asChild>
                    <Pressable style={styles.presableContainer}>
                        <Text style={styles.textPresable} >Gimnasio</Text>
                    </Pressable>
                </Link>
                <Link href="/mealPlan" asChild>
                <Pressable style={styles.presableContainer}>
                    <Text style={styles.textPresable} >Dieta</Text>
                </Pressable>
                </Link>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    presableContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        gap: 5,
        marginHorizontal: 2,

        //shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        alignItems: 'center',
    },
    textPresable: {
        fontSize: 20,
    },
})