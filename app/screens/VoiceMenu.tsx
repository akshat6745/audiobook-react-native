import React from "react";
import * as Speech from "expo-speech";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

interface VoiceMenuProps {
  visible: boolean;
  onClose: () => void;
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
  voices: Speech.Voice[];
}

const VoiceMenu: React.FC<VoiceMenuProps> = ({ visible, onClose, selectedVoice, onSelectVoice, voices }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Voice Menu</Text>
          <Text style={styles.subtitle}>Enable dialogue voices for character conversations.</Text>
          
          <FlatList
            data={voices}
            keyExtractor={(item) => item.identifier}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.voiceButton, selectedVoice === item.name && styles.selectedVoice]}
                onPress={() => onSelectVoice(item.identifier)}
              >
                <Text style={styles.voiceText}>{item.name}</Text>
                <Text style={styles.langText}>{item.language}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={onClose}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VoiceMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1C1C1E",
    width: "90%",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
    marginBottom: 20,
  },
  voiceButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    flex: 1,
  },
  selectedVoice: {
    borderWidth: 2,
    borderColor: "white",
  },
  voiceText: {
    color: "white",
    fontWeight: "bold",
  },
  langText: {
    color: "white",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
  submitText: {
    color: "black",
    fontWeight: "bold",
  },
});