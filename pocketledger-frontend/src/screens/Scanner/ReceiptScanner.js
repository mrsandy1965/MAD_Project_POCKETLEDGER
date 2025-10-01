import React, { useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TransactionsContext } from "../../context/TransactionsContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ReceiptScanner() {
  const [image, setImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const { addTransaction } = useContext(TransactionsContext);

  const pickImage = async (useLibrary) => {
    let result;
    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });
    }

    if (!result.cancelled) {
      setImage(result.uri);
      setRecognizedText(
        `Scanned from image: \n- Starbucks: $5.75 \n- Item: Grande Latte`
      );
    }
  };

  const saveTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      text: recognizedText.split("\n")[1] || "Scanned Item",
      amount: 5.75,
      type: "expense",
      category: "Scanning",
      date: new Date().toLocaleDateString(),
    };
    addTransaction(newTransaction);
    alert("Transaction Saved!");
    setImage(null);
    setRecognizedText("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Receipt Scanner</Text>
        <Text style={styles.subHeader}>
          Capture or upload a receipt to automatically log an expense.
        </Text>

        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              onPress={() => setImage(null)}
              style={styles.removeImageButton}
            >
              <Ionicons name="close-circle" size={32} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(false)}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Use Camera</Text>
            </TouchableOpacity>
            {Platform.OS === "web" && <Text style={styles.orText}>or</Text>}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(true)}
            >
              <Ionicons name="image" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {recognizedText ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Recognized Text</Text>
            <Text style={styles.resultText}>{recognizedText}</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveTransaction}
            >
              <Text style={styles.saveButtonText}>Save Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  header: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  subHeader: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  actionsContainer: { width: "100%", alignItems: "center" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "80%",
    justifyContent: "center",
    marginVertical: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 12,
  },
  orText: { color: "#6B7280", marginVertical: 5 },
  imageContainer: { marginVertical: 20, position: "relative" },
  image: { width: 300, height: 300, borderRadius: 12 },
  removeImageButton: { position: "absolute", top: -10, right: -10 },
  resultCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginTop: 20,
  },
  resultTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  resultText: { fontSize: 16, color: "#374151", lineHeight: 24 },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
