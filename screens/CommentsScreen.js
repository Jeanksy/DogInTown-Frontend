import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect } from 'react';
import { Touchable } from 'react-native';


export default function CommentsScreen({ route, navigation }) {

    const { name } = route.params;
    const { comments } = route.params;


    useEffect(() => {
        console.log(route.params);
        console.log('les commentaires -->' + comments[0]);
    }, []);

    const commentList = comments.map((data, i) => {
        return (
            <View key={i} style={styles.commentCard}>
                <View style={styles.commentUserInfo}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.userAvatar} source={require('../assets/Images/avatar.png')} />
                    </View>
                    <View style={styles.userInfoText}>
                        <Text style={styles.username}>{data.user.username}</Text>
                        <Text style={styles.userdogRace}>Propriétaire d'un carlin</Text>
                    </View>
                </View>
                <View style={styles.commentsPart}>
                    <Text style={styles.commentText}>{data.content}</Text>
                </View>
            </View>
        );
    });

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
                    <Text style={styles.commentTitle}>Commentaires</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.commentsContainer}>
                {commentList}
            </ScrollView>
            <TouchableOpacity style={styles.lowerContent}>
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
        height: '25%',
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
        height: '80%',
        padding: '7%',
    },
    placeText: {
        fontSize: 30,
        color: '#5B1A10',
        fontWeight: 600,
    },
    commentTitle: {
        fontSize: 28,
        color: '#A23D42',
    },
    commentsContainer: {
        flexGrow: 1, // Permet de faire défiler les recettes
        height: '100%',
        width: '100%',
    },
    lowerContent: {
        width: '80%',
        height: '8%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A23D42',
    },
    buttonText: {
        fontWeight: 700,
        fontSize: 18,
        color: 'white',
    },


    //COMMENTAIRE 
    commentCard: {
        height: 200,
        width: 320,
        borderRadius: 20,
        padding: '3%',
        backgroundColor: 'white',
    },
    commentUserInfo: {
        flexDirection: 'row',
        width: '100%',
        height: '30%',
        alignItems: 'center',
        paddingHorizontal: '1%',
    },
    imageContainer: {
        height: 60,
        width: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatar: {
        maxHeight: 60,
        maxWidth: 60,
    },
    userInfoText: {
        height: '100%',
        width: '70%',
        justifyContent: 'center',
        paddingLeft: '5%',
    },
    username: {
        fontSize: 22,
        fontWeight: 600,
        color: '#A23D42',
    },
    userdogRace: {
        fontStyle: 'italic',
        color: '#A23D42',
    },
    commentsPart: {
        minHeight: '10%',
        width: '100%',
        padding: '3%',
    },
    commentText: {
        fontSize: 16,
        color: '#525252',
        fontStyle: 'italic',
    },
});