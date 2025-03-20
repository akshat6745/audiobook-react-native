import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  ChapterContent: { filename: string; chapterNumber: number; title: string };
  AudioPlayer: { paragraph: string; filename: string; chapterNumber: number; paragraphIndex: number };
};

type ChapterContentScreenRouteProp = RouteProp<RootStackParamList, "ChapterContent">;
type ChapterContentScreenNavigationProp = StackNavigationProp<RootStackParamList, "ChapterContent">;

interface Props {
  route: ChapterContentScreenRouteProp;
  navigation: ChapterContentScreenNavigationProp;
}

const ChapterContentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { filename, chapterNumber, title } = route.params;
  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/epub/${filename}/chapter/${chapterNumber}`)
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error fetching chapter content:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={content}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AudioPlayer", {
                paragraph: item,
                filename: filename,
                chapterNumber: chapterNumber,
                paragraphIndex: index,
              })
            }
          >
            <Text style={styles.paragraph}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  paragraph: { fontSize: 16, marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 },
});

export default ChapterContentScreen;