import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  EpubDetail: { epub: { id: string; name: string } };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, "EpubDetail">;
type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, "EpubDetail">;

interface Props {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

const ChaptersPage: React.FC<Props> = ({ route }) => {
  const { epub } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{epub.name}</Text>
      <Text style={styles.id}>ID: {epub.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  id: { fontSize: 14, color: "gray", marginTop: 10 },
});

export default ChaptersPage;