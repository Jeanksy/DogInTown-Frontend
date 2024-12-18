import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Image, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';





export default function FeedbackScreen({ route, navigation }) {

    const user = useSelector((state) => state.user.value);
    const { name } = route.params;
    const { comments } = route.params;
    const [dogs, setDogs] = useState([]);
    const [comment, setComment] = useState('');
    const [selectedDogIndex, setSelectedDogIndex] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`https://dog-in-town-backend.vercel.app/users/dog/${user.token}`)    //  <<<<< Token dynamique
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setDogs(data.dogs);
                }
            });
    }, []);

    useEffect(() => {
        setError('');
    },[selectedDogIndex, comments])

    const handleCommentAdd = async() => {
        if(selectedDogIndex === null){
            setError('Veuillez sélectionner un chien.')
            return
        }else if(comment === ''){
            setError('Veuillez remplir le formulaire.')
            return
        }
        const response = await fetch(`https://dog-in-town-backend.vercel.app/comments/add/${name}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: comment, token: user.token, size: dogs[selectedDogIndex]}),
          });
        navigation.navigate('Comments', {name : name, comments : comments});
        setComment('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.inner}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.leaverRow}>
                    <Pressable style={styles.leaveContainer}>
                        <FontAwesome name='arrow-left' size={30} color='#A23D42' onPress={() => navigation.goBack()} />
                    </Pressable>
                </View>
                <View style={styles.titleContainter}>
                    <Text style={styles.title}>Laissez-nous votre avis :</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput multiline={true} maxLength={280} placeholder='Laisser un avis...' onChangeText={(value) => setComment(value)} value={comment} autoCapitalize="sentences" style={styles.textInput}></TextInput>
                </View>
                <View style={styles.subTitleContainer}>
                    <Text style={styles.subtitles}>Avec quel chien êtes vous venu ?</Text>
                </View>
                <View style={styles.dogsContainer}>
                    {dogs && dogs.length > 0 && (
                        dogs.map((dog, index) => (
                            <Pressable key={index} onPress={() => setSelectedDogIndex(index)}>
                                <View style={styles.dogCard}>
                                    <Text style={[styles.dogName, { color: selectedDogIndex === index ? '#5B1A10' : '#A23D42' }]}>{dog.name}</Text>
                                    {dog.photo && <Image style={[styles.dogPhoto, { borderColor: selectedDogIndex === index ? '#5B1A10' : '#F7CC99' }]} source={{ uri: dog.photo }} />}
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>
                <View style={styles.lowerContent}>
                    {error !== '' && <Text style={styles.error}>{error}</Text>}
                    <TouchableOpacity style={styles.validateButton} onPress={() => handleCommentAdd()}>
                        <Text style={styles.buttonText}>Valider</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7CC99',
        alignItems: 'center',
        paddingVertical: '7%',
    },
    inner: {
        flex: 1,
        width: '100%',
    },
    leaverRow: {
        width: '100%',
        height: '8%',
        justifyContent: 'center',
    },
    leaveContainer: {
        left: '1%',
        position: 'absolute',
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    titleContainter: {
        height: '10%',
        width: '100%',
        paddingHorizontal: '6%',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 600,
        color: '#A23D42',
    },
    inputContainer: {
        width: '100%',
        height: 170,
        padding: '5%',
    },
    textInput: {
        width: '100%',
        height: '100%',
        fontSize: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        textAlign: 'left',
        textAlignVertical: 'top',
    },
    subTitleContainer: {
        width: '100%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitles: {
        fontSize: 18,
        fontWeight: 500,
        color: '#A23D42',
    },
    dogsContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: '5%',
    },
    dogCard: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dogPhoto: {
        height: 90,
        width: 90,
        borderRadius: 50,
        borderWidth: 3,
    },
    dogName: {
        marginBottom: 8,
        fontSize: 18,
        fontWeight: 600,
    },
    lowerContent: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        position: 'absolute',
        top: '10%',
        fontSize: 16,
        color: 'red',
    },
    validateButton: {
        width: '60%',
        height: '20%',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A23D42',
    },
    buttonText: {
        fontWeight: 700,
        fontSize: 18,
        color: 'white',
    },
});

