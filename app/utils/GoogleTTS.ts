import axios from "axios";
import { Audio } from "expo-av";

const API_KEY = "AIzaSyBBf8np3K23UIiNqDrYi_rh1Pwz71yAmQA"; // Replace with your key

let soundObject = new Audio.Sound();

const GoogleTTS = {
  async speak(text: string, voice: string, setResponse: (p: boolean) => void, rate: number) {
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
        {
          "input": { "text": text },
          "voice": { "languageCode": "en-US", "name": "en-US-Chirp3-HD-Aoede" },
          "audioConfig": { "audioEncoding": "LINEAR16" }
        }
      );
      // console.log(response.data.audioContent);
      const audioBase64 = response.data.audioContent;
      const uri = `data:audio/mp3;base64,${audioBase64}`;
      setResponse(true);
      // Play audio using expo-av
      if (soundObject) {
        await soundObject.unloadAsync(); // Unload previous sound if any
      }
      soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri });
      await soundObject.setRateAsync(2, true);
      await soundObject.playAsync();
    } catch (error) {
      console.error("Google TTS Error:", error);
    }
  },

  async stop() {
    try {
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
      }
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  },

  async pause() {
    try {
      if (soundObject) {
        await soundObject.pauseAsync();
      }
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  },

  async resume() {
    try {
      if (soundObject) {
        await soundObject.playAsync();
      }
    } catch (error) {
      console.error("Error resuming audio:", error);
    }
  }
  
};

export default GoogleTTS;