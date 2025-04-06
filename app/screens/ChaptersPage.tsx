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
import { parseHTML } from "linkedom";
import axios from "axios";

type RootStackParamList = {
  Home: undefined;
  EpubDetail: { name: string };
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
  link: string;
}

const ChaptersPage: React.FC<Props> = ({ route }) => {
  const { name } = route.params;
  // const name = epub.name.replace(".epub", "");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const navigation = useNavigation();

  const checkInternetConnection = async () => {
    try {
      const response = await fetch("https://www.google.com", {
        method: "GET",
      });

      if (response.status === 200) {
        console.log("Internet is working");
        return true;
      } else {
        console.log("Internet might not be working properly");
        return false;
      }
    } catch (error) {
      console.log("No Internet Connection", error);
      return false;
    }
  };

  useEffect(() => {
    // fetch(())
    // checkInternetConnection();
    axios
      .get("https://novelnext.dramanovels.io/ajax/chapter-archive", {
        params: {
          novelId: "the-villain-wants-to-live",
        },
        headers: {
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=1, i",
          referer:
            "https://novelnext.dramanovels.io/nw/the-villain-wants-to-live",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
        },
      })
      .then((res) => res.data) // Get response data
      .then((html) => {
        const { document } = parseHTML(html); // Parse HTML using linkedom
        const chaptersData: Chapter[] = [];

        document.querySelectorAll("li").forEach((element, index) => {
          const title = element
            .querySelector(".nchr-text")
            ?.textContent?.trim();
          const link = element.querySelector("a")?.getAttribute("href");

          if (title && link) {
            chaptersData.push({ chapter_id: `${index + 1}`, title, link });
          }
        });

        setChapters(chaptersData);
        // console.log(chaptersData);
      })
      .catch((error) => console.error("Error fetching chapters:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
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
                link: item.link,
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
