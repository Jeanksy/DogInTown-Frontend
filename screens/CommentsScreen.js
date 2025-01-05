import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import Comment from '../components/Comment';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font'; // FONT



export default function CommentsScreen({ route, navigation }) {
// export de la font
useFonts({
    "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
    "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
    "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
    });

    const { name } = route.params; //récupérer le nom du lieu via la naviguation
    const [comments, setComments] = useState([]); //tableau d'objets des commentaire
    const isFocused = useIsFocused();
    const [sorted, setSorted] = useState(false); //état pour gérer le tri des commentaire dans l'ordre chronologique



    //Récupérer l'ensemble des commentaires d'un lieu
    useEffect(() => {
        (async () => {
            const response = await fetch(`https://dog-in-town-backend-three.vercel.app/places/comments/${name}`)
            const result = await response.json()
            setComments(result.comments)
        })();
    }, [isFocused])

    const handleSort = () => {
        setSorted(!sorted);
    }

    // Appliquer le tri si l'état `sorted` est vrai
    const sortedComments = sorted ? [...comments].reverse() : comments;


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.navigate('TabNavigator')}>
                    <View style={styles.leaveRow}>
                        <FontAwesome name='arrow-left' size={25} color='#5B1A10' />
                        <Text style={styles.backText}>revenir sur la map</Text>
                    </View>
                </Pressable>
                <View style={styles.titlesContainer}>
                    <Text style={styles.placeText}>{name}</Text>
                    <View style={styles.commentTitleContainer}>
                        <Text style={styles.commentTitle}>Commentaires</Text>
                    </View>
                </View>
                <Pressable style={styles.buttonSort} onPress={() => handleSort()}>
                    <FontAwesome style={styles.icon} name={sorted ? 'sort-down' : 'sort-up'} size={30} color='#5B1A10' />
                </Pressable>
            </View>
            <ScrollView
                contentContainerStyle={styles.commentsContainer}
                removeClippedSubviews={true}
            >
                {sortedComments.map((data, i) => (
                    <Comment //composant commentaire
                        key={i}
                        username={data.user.username}
                        avatar={data.user.avatar}
                        content={data.content}
                        race={data.user.dogs && data.user.dogs[0] && data.user.dogs[0].race ? data.user.dogs[0].race.toLowerCase() : ''} 
                        dogAvatar={data.user.dogs && data.user.dogs[0] && data.user.dogs[0].photo ? data.user.dogs[0].photo : ''}
                        date={data.date}
                    />
                ))}
            </ScrollView>
            <TouchableOpacity onPress={() => navigation.navigate('Feedback', { name: name, comments: comments })} style={styles.lowerContent}>
                <Text style={styles.buttonText}>Laisser un avis</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7CC99',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10%',
    },
    upperContent: {
        zIndex: 1,
        width: '100%',
        height: '20%',
    },
    leaveRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: '5%',
        color: '#5B1A10',
        fontSize: 15,
        fontFamily: 'LeagueSpartan-Light',
    },
    titlesContainer: {
        width: '100%,',
        height: '80%',
        padding: '7%',
    },
    placeText: {
        fontSize: 30,
        color: '#5B1A10',
        fontFamily: 'LeagueSpartan-Bold',
    },
    commentTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '60%',
    },
    commentTitle: {
        fontSize: 28,
        fontFamily: 'LeagueSpartan-Regular',
        marginRight: '30%',
        color: '#A23D42',
    },
    buttonSort: {
        height: 50,
        width: 50,
        position: 'absolute',
        top: '80%',
        left: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentsContainer: {
        flexGrow: 1,
        width: '100%',
    },
    lowerContent: {
        width: '80%',
        height: '8%',
        borderRadius: 12,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A23D42',
    },
    buttonText: {
        fontFamily: 'LeagueSpartan-Bold',
        fontSize: 22,
        marginTop: '2%',
        color: 'white',
    },



});