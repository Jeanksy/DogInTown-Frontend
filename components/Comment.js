import React from 'react';
import { StyleSheet, Text, View, Image, } from 'react-native';




const Comment = ({ avatar, username, race, content, date, dogAvatar }) => {

    const dateToFormat = new Date(date);

    const formattedDate = dateToFormat.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formattedTime = dateToFormat.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    console.log(dogAvatar);

    return (
        <View style={styles.commentCard} height={200 + content.length/1.5}>
            <View style={styles.commentUserInfo}>
                <View style={styles.imageContainer}>
                    {avatar === null ? <Image style={styles.userAvatar} source={require('../assets/Images/avatar.png')}/> :
                    <Image style={styles.userAvatar} source={{ uri: avatar }} />
                    }
                    <Image style={styles.dogAvatar} source={{ uri: dogAvatar }}/>
                </View>
                <View style={styles.userInfoText}>
                    <Text style={styles.username}>{username}</Text>
                    {race !== '' && <Text style={styles.userdogRace}>Propriétaire d'un {race}</Text>}
                </View>
            </View>
            <View style={styles.commentsPart}>
                <Text style={styles.commentText}>{content}</Text>
            </View>
            <View style={styles.commentDateContainer}>
                <Text style={styles.commentDate}>(Fait le {formattedDate} à {formattedTime})</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    commentCard: {
        marginVertical: 5,
        width: 320,
        borderRadius: 20,
        padding: 20,
        backgroundColor: 'white',
    },
    commentUserInfo: {
        flexDirection: 'row',
        width: '100%',
        height: 80,
        alignItems: 'center',
        paddingHorizontal: '1%',
    },
    imageContainer: {
        height: 70,
        width: 70,
        borderRadius: 50,
        marginRight: '3%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatar: {
        height: 70,
        width: 70,
        borderRadius: 50,
    },
    dogAvatar: {
        position: 'absolute',
        top: '52%',
        left: '64%',
        height: 35,
        width: 35,
        borderRadius: 50,
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
    commentDateContainer: {
        top: '95%',
        position: 'absolute',
        width: '100%',
        height: '12%',
    },
    commentDate: {
        fontStyle: 'italic',
        paddingLeft: '4%',
        fontSize: 13,
    }
})





export default Comment