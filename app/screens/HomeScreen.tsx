import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  EpubDetail: { name: string };
  Home: undefined;
};

const DocIdScreen: React.FC = () => {
  const [docId, setDocId] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("googleDocId", docId);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to save Doc ID:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter Google Doc ID:</Text>
      <TextInput
        style={styles.input}
        value={docId}
        onChangeText={setDocId}
        placeholder="Google Doc ID"
      />
      <Button title="Submit" onPress={handleSave} />
    </View>
  );
};

interface Epub {
  id: string;
  name: string;
}

const HomeScreen: React.FC = () => {
  const [epubsTitle, setEpubsTitle] = useState<string[]>([]);
  const [docId, setDocId] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchPublicGoogleDoc = async () => {
    try {
      const storedDocId = await AsyncStorage.getItem("googleDocId");
      if (!storedDocId) {
        setDocId(null);
        return;
      }
      setDocId(storedDocId);
      const response = await fetch(
        `https://docs.google.com/document/d/${storedDocId}/export?format=txt`
      );
      const text = await response.text();

      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setEpubsTitle(lines);
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
    }
  };

  useEffect(() => {
    fetchPublicGoogleDoc();
  }, []);

  if (!docId) {
    return <DocIdScreen />;
  }

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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
  },
  tile: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
