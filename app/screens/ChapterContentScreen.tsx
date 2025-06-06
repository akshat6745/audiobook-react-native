import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { parseHTML } from "linkedom";

type RootStackParamList = {
  ChapterContent: {
    filename: string;
    chapterNumber: number;
    title: string;
    link: string;
  };
  AudioPlayer: {
    paragraph: string;
    filename: string;
    chapterNumber: number;
    paragraphIndex: number;
    contentArray: string[];
  };
};

type ChapterContentScreenRouteProp = RouteProp<
  RootStackParamList,
  "ChapterContent"
>;
type ChapterContentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChapterContent"
>;

interface Props {
  route: ChapterContentScreenRouteProp;
  navigation: ChapterContentScreenNavigationProp;
}

const ChapterContentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { filename, chapterNumber, title, link } = route.params;
  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    fetch(link)
      .then((res) => res.text())
      .then((data) => {
        const { document } = parseHTML(data);
        const paragraphs = document
          .getElementById("chr-content")
          ?.querySelectorAll("p");
        if (paragraphs) {
          const contentArray = Array.from(paragraphs).map((p) =>
            p.textContent?.trim()
          );
          setContent(
            contentArray.filter(
              (item): item is string => item !== undefined && item !== ""
            )
          );
        }
      })
      .catch((error) =>
        console.error("Error fetching chapter content:", error)
      );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={content}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          // const setNextChapter = () => {
          //   navigation.navigate("ChapterContent", {
          //     filename,
          //     chapterNumber: chapterNumber + 1,
          //     title: title,
          //     link,
          //   });
          // }
          // const setNextParagraph = () => {
          //   navigation.navigate("AudioPlayer", {
          //     paragraph: item,
          //     filename: filename,
          //     chapterNumber: chapterNumber,
          //     paragraphIndex: index,
          //   });
          // };
          // const setPreviousParagraph = () => {
          //   navigation.navigate("AudioPlayer", {
          //     paragraph: item,
          //     filename: filename,
          //     chapterNumber: chapterNumber,
          //     paragraphIndex: index,
          //   });
          // };
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AudioPlayer", {
                  paragraph: item,
                  filename: filename,
                  chapterNumber: chapterNumber,
                  paragraphIndex: index,
                  contentArray: content,
                })
              }
            >
              <Text style={styles.paragraph}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
});

export default ChapterContentScreen;
