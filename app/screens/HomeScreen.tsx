import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  // ChapterContent: { filename: string; chapterNumber: number; title: string };
  // AudioPlayer: { paragraph: string; filename: string; chapterNumber: number; paragraphIndex: number };
  EpubDetail: { epub: {id: string, name: string} };
};

interface Epub {
  id: string;
  name: string;
}

const HomeScreen: React.FC = () => {
  const [epubs, setEpubs] = useState<Epub[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetch("http://localhost:8000/epubs")
      .then((res) => res.json())
      .then((data) => setEpubs(data))
      .catch((error) => console.error("Error fetching EPUBs:", error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={epubs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate("EpubDetail", { epub: item })}
          >
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f8f8f8" },
  tile: { flex: 1, margin: 5, padding: 10, backgroundColor: "#ddd", borderRadius: 10 },
  text: { textAlign: "center", fontSize: 14, fontWeight: "bold" },
});

export default HomeScreen;