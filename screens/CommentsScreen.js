import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import Comment from '../components/Comment';
import { useIsFocused } from '@react-navigation/native';



export default function CommentsScreen({ route, navigation }) {

    const { name } = route.params;
    const [comments, setComments] = useState([]);
    const isFocused = useIsFocused();
    const [sorted, setSorted] = useState(false);

    let commentList = [];



    useEffect(() => {
        (async () => {
            const response = await fetch(`https://dog-in-town-backend.vercel.app/places/comments/${name}`)
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
                <Pressable onPress={() => navigation.goBack()}>
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
                    console.log(data.user.dogs[0]),
                    <Comment
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
    },
    titlesContainer: {
        width: '100%,',
        height: '70%',
        padding: '7%',
    },
    placeText: {
        fontSize: 30,
        color: '#5B1A10',
        fontWeight: 600,
    },
    commentTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '60%',
    },
    commentTitle: {
        fontSize: 28,
        marginRight: '30%',
        color: '#A23D42',
    },
    buttonSort: {
        height: 50,
        width: 50,
        position: 'absolute',
        top: '80%',
        left: '93%',
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
        fontWeight: 700,
        fontSize: 18,
        color: 'white',
    },



});