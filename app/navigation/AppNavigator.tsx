import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ChaptersPage from "../screens/ChaptersPage";
import ChapterContentScreen from "../screens/ChapterContentScreen";
import AudioPlayerScreen from "../screens/AudioPlayerScreen";

type RootStackParamList = {
  Home: undefined;
  EpubDetail: { epub: { id: string; name: string } };
  ChapterContent: { filename: string; chapterNumber: string; title: string };
  AudioPlayer: {
    paragraph: string;
    filename: string;
    chapterNumber: number;
    paragraphIndex: number;
  };
};
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EpubDetail" component={ChaptersPage} />
      <Stack.Screen name="ChapterContent" component={ChapterContentScreen} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
