import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  AudioPlayer: { paragraph: string; filename: string; chapterNumber: number; paragraphIndex: number };
};

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, "AudioPlayer">;
type AudioPlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, "AudioPlayer">;

interface Props {
  route: AudioPlayerScreenRouteProp;
  navigation: AudioPlayerScreenNavigationProp;
}

const AudioPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { paragraph, filename, chapterNumber, paragraphIndex } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Convert text to speech API (Modify this to use your TTS API)
  const fetchAudio = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tts?text=${encodeURIComponent(paragraph)}`);
      const data = await response.json();
      return data.audioUrl; // Your API should return an audio URL
    } catch (error) {
      console.error("Error fetching audio:", error);
      return null;
    }
  };

  // Load audio
  const playAudio = async () => {
    const audioUrl = await fetchAudio();
    if (!audioUrl) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    setSound(sound);

    await sound.playAsync();
    setIsPlaying(true);
  };

  // Play/Pause toggle
  const togglePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Stop and unload audio when leaving screen
  useEffect(() => {
    return sound
      ? () => {
          sound.stopAsync();
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraphText}>{paragraph}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>⏪ Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
          <Text style={styles.buttonText}>{isPlaying ? "⏸ Pause" : "▶️ Play"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>⏩ Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  paragraphText: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  controls: { flexDirection: "row", justifyContent: "space-around", width: "80%" },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginHorizontal: 10 },
  buttonText: { fontSize: 16, color: "#fff" },
});

export default AudioPlayerScreen;