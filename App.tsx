import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { CameraView as Camera, useCameraPermissions } from "expo-camera";
import type { CameraCapturedPicture } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | null
  >(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === "granted");
    };
    requestPermissions();
  }, []);

  const ensureCameraPermission = async () => {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }
  };

  if (cameraPermission === undefined || hasMediaLibraryPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>ต้องการสิทธิ์กล้องเพื่อใช้งานแอปนี้</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await requestCameraPermission();
          }}
        >
          <Text style={styles.buttonText}>เปิดสิทธิ์กล้อง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasMediaLibraryPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>ต้องการสิทธิ์จัดเก็บรูปภาพ</Text>
      </View>
    );
  }

  const onCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      setImageUri(photo.uri);
      setIsPreview(true);
    } catch (e) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถถ่ายรูปได้");
    }
  };

  const onSave = async () => {
    if (!imageUri) return;
    setIsSaving(true);
    try {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      Alert.alert("บันทึกเรียบร้อย", "รูปได้ถูกบันทึกลงอัลบั้มแล้ว");
    } catch (e) {
      Alert.alert("บันทึกไม่สำเร็จ", "ไม่สามารถบันทึกรูปได้");
    } finally {
      setIsSaving(false);
    }
  };

  const onRetake = () => {
    setImageUri(null);
    setIsPreview(false);
  };

  const toggleCameraType = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setIsFlashOn(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {!isPreview && (
        <Camera
          style={styles.camera}
          facing={cameraType}
          enableTorch={isFlashOn}
          ref={(r: any) => (cameraRef.current = r)}
        />
      )}

      {isPreview && imageUri && (
        <Image source={{ uri: imageUri }} style={styles.camera} />
      )}

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
          <Ionicons 
            name={isFlashOn ? "flash" : "flash-off"} 
            size={24} 
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {!isPreview ? (
          <>
            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
              <Ionicons name="camera-reverse-outline" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <View style={styles.iconButton}>
              {/* Placeholder for grid symmetry */}
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.previewButton, styles.retakeButton]} 
              onPress={onRetake}
            >
              <Ionicons name="refresh-outline" size={24} color="white" />
              <Text style={styles.previewButtonText}>ถ่ายใหม่</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.saveButton, isSaving && styles.disabledButton]}
              onPress={onSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={24} color="white" />
                  <Text style={styles.previewButtonText}>บันทึก</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  controls: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
    marginHorizontal: 8,
  },
  retakeButton: {
    backgroundColor: "#555",
  },
  saveButton: {
    backgroundColor: "#00796B",
  },
  previewButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  message: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    margin: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});