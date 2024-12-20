import React, { useState, useEffect, useRef } from 'react';
import { Modal, SafeAreaView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from "@react-navigation/native";

export const CameraCompo = ({modalCamIsVisible, setModalCamIsVisible, setImageTaken}) => {
  const [facing, setFacing] = useState("front");
  const [flashStatus, setFlashStatus] = useState(false);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();  
  // Permission hooks
  const [hasPermission, setHasPermission] = useState(false);
    
  
    

  useEffect(() => {
      (async () => {
        const result = await Camera.requestCameraPermissionsAsync();
        setHasPermission(result && result?.status === "granted");
      })();
    }, []);
    // Conditions to prevent more than 1 camera component to run in the bg
    if (!hasPermission || !isFocused) {
      return <View />;
  };

  // Fonction pour basculer entre la caméra avant et arrière
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "front" ? "back" : "front"));
  };

  // Fonction pour activer/désactiver le flash
  const toggleFlashStatus = () => {
    setFlashStatus((current) => !current);
  };

  // Fonction pour prendre une photo
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });

    if (!photo?.uri) {
      console.error('No photo URI available');
      return;
    }

    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch('https://dog-in-town-backend.vercel.app/users/upload', {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.result) {
        setImageTaken(data.url);  // Met à jour l'image après l'upload
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }

    setModalCamIsVisible(false); // Ferme la modal après la prise de photo
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalCamIsVisible}
      onRequestClose={() => setModalCamIsVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CameraView
            style={styles.camera}
            facing={facing}
            enableTorch={flashStatus}
            ref={cameraRef}
          >
            <SafeAreaView style={styles.settingContainer}>
              <TouchableOpacity style={styles.settingButton} onPress={toggleFlashStatus}>
                <FontAwesome name="flash" size={25} color={flashStatus ? "#e8be4b" : "white"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
                <FontAwesome name="rotate-right" size={25} color="white" />
              </TouchableOpacity>
            </SafeAreaView>
          </CameraView>

          <View style={styles.snapContainer}>
            <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
              <FontAwesome name="circle-thin" size={80} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalCamIsVisible(false)}>
              <FontAwesome name="times" size={35} color="gray" opacity={0.8} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    paddingBottom: 25,
    borderRadius: 20,
    height: '70%',
    width: '90%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '80%',
    aspectRatio: 1 / 1,
    paddingTop: 5,
    justifyContent: "space-between",
   
  },
  settingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: '1%',
    width:'77%',
  },
  settingButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    
  },
  snapContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
  },
  snapButton: {
    width: 100,
    aspectRatio: 1 / 1,
    alignItems: "center",
    justifyContent: 'center',
    opacity: 0.8,
  },
  closeModal: {
    position: 'absolute',
    right: 20,
  },
});

export default CameraCompo;
