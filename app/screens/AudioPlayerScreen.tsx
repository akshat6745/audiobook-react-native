import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";

type RootStackParamList = {
  AudioPlayer: { paragraph: string; filename: string; chapterNumber: number; paragraphIndex: number };
};

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, "AudioPlayer">;
type AudioPlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, "AudioPlayer">;

interface Props {
  route: AudioPlayerScreenRouteProp;
  navigation: AudioPlayerScreenNavigationProp;
}

const AudioPlayerScreen: React.FC<Props> = ({ route }) => {
  const { paragraph } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState("default");
  const [speed, setSpeed] = useState("1.0");
  const [isVoicePickerVisible, setIsVoicePickerVisible] = useState(false);
  const [isSpeedPickerVisible, setIsSpeedPickerVisible] = useState(false);

  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{paragraph}</Text>

      <View style={styles.controls}>
        <View style={styles.sideButtons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-back-outline" size={32} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
          <Ionicons name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} size={50} color="black" />
        </TouchableOpacity>

        <View style={styles.sideButtons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="chevron-forward-circle-outline" size={40} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-forward-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Options Container */}
      <View style={styles.optionsContainer}>
        {/* Voice Selection */}
        <TouchableOpacity onPress={() => setIsVoicePickerVisible(!isVoicePickerVisible)} style={styles.option}>
          <Text style={styles.optionText}>Voice: {voice}</Text>
        </TouchableOpacity>
        {isVoicePickerVisible && (
          <Picker
            selectedValue={voice}
            onValueChange={(itemValue) => {
              setVoice(itemValue);
              setIsVoicePickerVisible(false);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Default" value="default" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Male" value="male" />
          </Picker>
        )}

        {/* Speed Selection */}
        <TouchableOpacity onPress={() => setIsSpeedPickerVisible(!isSpeedPickerVisible)} style={styles.option}>
          <Text style={styles.optionText}>Speed: {speed}x</Text>
        </TouchableOpacity>
        {isSpeedPickerVisible && (
          <Picker
            selectedValue={speed}
            onValueChange={(itemValue) => {
              setSpeed(itemValue);
              setIsSpeedPickerVisible(false);
            }}
            style={styles.picker}
          >
            <Picker.Item label="0.5x" value="0.5" />
            <Picker.Item label="1.0x" value="1.0" />
            <Picker.Item label="1.5x" value="1.5" />
            <Picker.Item label="2.0x" value="2.0" />
          </Picker>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  paragraph: { fontSize: 18, textAlign: "center", marginBottom: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 20 },
  playPauseButton: { marginHorizontal: 20 },
  optionsContainer: { flexDirection: "row", marginTop: 20 },
  option: { marginHorizontal: 10, padding: 10, backgroundColor: "#ddd", borderRadius: 5 },
  optionText: { fontSize: 16 },
  picker: {
    height: 150,
    width: 150,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
  },
  sideButtons: {
    flexDirection: "row",
    gap: 20,
  },
});

export default AudioPlayerScreen;