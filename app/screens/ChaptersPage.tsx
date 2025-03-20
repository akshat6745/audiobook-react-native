import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  EpubDetail: { epub: { id: string; name: string } };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, "EpubDetail">;
type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EpubDetail"
>;

interface Props {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

interface Chapter {
  chapter_id: string;
  title: string;
}

const ChaptersPage: React.FC<Props> = ({ route }) => {
  const { epub } = route.params;
  const name = epub.name.replace(".epub", "");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`http://localhost:8000/epub/${name}/chapters`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
      })
      .catch((error) => console.error("Error fetching EPUBs:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{epub.name}</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.chapterItem}
            onPress={() =>
              navigation.navigate("ChapterContent", {
                filename: name,
                chapterNumber: item.chapter_id,
                title: item.title,
              })
            }
          >
            <Text style={styles.chapterText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chapterItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  chapterText: { fontSize: 16, color: "#333" },
});

export default ChaptersPage;
