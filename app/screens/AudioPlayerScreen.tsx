import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";
import VoiceMenu from "./VoiceMenu";

type RootStackParamList = {
  AudioPlayer: {
    paragraph: string;
    filename: string;
    chapterNumber: number;
    paragraphIndex: number;
  };
};

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, "AudioPlayer">;
type AudioPlayerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AudioPlayer"
>;

interface Props {
  route: AudioPlayerScreenRouteProp;
  navigation: AudioPlayerScreenNavigationProp;
}

const defaultVoice = {
  identifier: "com.apple.voice.compact.en-US.Samantha",
  language: "en-US",
  name: "Samantha",
  quality: Speech.VoiceQuality.Default,
};

const AudioPlayerScreen: React.FC<Props> = ({ route }) => {
  const { paragraph } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState<Speech.Voice>(defaultVoice);
  const [speed, setSpeed] = useState("1.0");
  const [isVoicePickerVisible, setIsVoicePickerVisible] = useState(false);
  const [isSpeedPickerVisible, setIsSpeedPickerVisible] = useState(false);
  const [optionVoices, setOptionVoices] = useState<Speech.Voice[]>([]);

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((voices) => {
      setOptionVoices(
        voices.filter(
          (voice) =>
            voice.language.includes("en") &&
            !voice.identifier.includes("synthesis")
        )
      );
    });
  }, []);

  const changeVoices = (selectedVoiceId: string) => {
    const selectedVoice = optionVoices.find(
      (v) => v.identifier === selectedVoiceId
    );
    setVoice(selectedVoice ?? defaultVoice);
    setIsVoicePickerVisible(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      Speech.stop();
    } else {
      Speech.speak(paragraph, {
        voice: !voice ? undefined : voice.identifier,
        pitch: 1.0,
        rate: parseFloat(speed),
        // rate: parseFloat(speed),
        onDone: () => {
          setIsPlaying(false);
          console.log("Done");
        },
        language: "en-US",
      });
      // console.log("Playing");
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{paragraph}</Text>

      <View style={styles.controls}>
        <View style={styles.sideButtons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-back-outline" size={32} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="chevron-back-circle-outline"
              size={40}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playPauseButton}
        >
          <Ionicons
            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
            size={50}
            color="black"
          />
        </TouchableOpacity>

        <View style={styles.sideButtons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="chevron-forward-circle-outline"
              size={40}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="play-skip-forward-outline"
              size={32}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Options Container */}
      <View style={styles.optionsContainer}>
        {/* Voice Selection */}
        <TouchableOpacity
          onPress={() => setIsVoicePickerVisible(!isVoicePickerVisible)}
          style={styles.option}
        >
          <Text style={styles.optionText}>
            Voice: {voice?.name ?? "Default"}
          </Text>
        </TouchableOpacity>

        <VoiceMenu
          visible={isVoicePickerVisible}
          onClose={() => setIsVoicePickerVisible(false)}
          selectedVoice={voice?.identifier ?? ""}
          onSelectVoice={changeVoices}
          voices={optionVoices}
        />

        {/* Speed Selection */}
        <TouchableOpacity
          onPress={() => setIsSpeedPickerVisible(!isSpeedPickerVisible)}
          style={styles.option}
        >
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
            <Picker.Item label="0.75x" value="0.75" />
            <Picker.Item label="1.0x" value="1.0" />
            <Picker.Item label="1.25x" value="1.25" />
            <Picker.Item label="1.5x" value="1.5" />
            <Picker.Item label="1.75x" value="1.75" />
            <Picker.Item label="2.0x" value="2.0" />
          </Picker>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  playPauseButton: { marginHorizontal: 20 },
  optionsContainer: { flexDirection: "row", marginTop: 20 },
  option: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
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
