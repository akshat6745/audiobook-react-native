import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  EpubDetail: { name: string };
};

interface Epub {
  id: string;
  name: string;
}

const HomeScreen: React.FC = () => {
  const [epubs, setEpubs] = useState<Epub[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [epubsTitle, setEpubsTitle] = useState<string[]>([]);


  const fetchPublicGoogleDoc = async () => {
    try {
      const docId = "1VRLgR_6cCJeXVh6N3IAiwrlxEmeDbc03CqqSZ_o57so"; // Replace with actual ID
      const response = await fetch(`https://docs.google.com/document/d/${docId}/export?format=txt`);
      const text = await response.text();
  
      const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      setEpubsTitle(lines);
      // console.log(lines);
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
    }
  };
  
  useEffect(() => {
    fetchPublicGoogleDoc();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={epubsTitle}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate("EpubDetail", { name: item })}
          >
            <Text style={styles.text}>{item}</Text>
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