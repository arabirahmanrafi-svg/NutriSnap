import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    requestPermission();
  }, []);

  async function requestPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  }

  function handleBarCodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);
    setScannedCode(data);
  }

  function searchProduct() {
    router.push({
      pathname: "/(tabs)/scan",
      params: { barcode: scannedCode },
    });
    setScanned(false);
    setScannedCode("");
  }

  function scanAgain() {
    setScanned(false);
    setScannedCode("");
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📷 Camera Access Needed</Text>
        <Text style={styles.text}>
          Please allow camera access in your iPhone settings to scan barcodes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torchOn}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>📷 Point at a barcode</Text>

          {/* Scanning Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {scanned && (
              <View style={styles.scannedOverlay}>
                <Text style={styles.scannedText}>✅ Scanned!</Text>
              </View>
            )}
          </View>

          {!scanned ? (
            <>
              <Text style={styles.overlayHint}>
                Hold steady over the barcode
              </Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setTorchOn(!torchOn)}
              >
                <Text style={styles.controlText}>
                  {torchOn ? "🔦 Flash On" : "🔦 Flash Off"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>✅ Barcode Detected!</Text>
              <Text style={styles.resultCode}>{scannedCode}</Text>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchProduct}
              >
                <Text style={styles.searchButtonText}>🔍 Search Product</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={scanAgain}
              >
                <Text style={styles.scanAgainText}>🔄 Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 60,
  },
  overlayTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#00d4aa",
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scannedOverlay: {
    backgroundColor: "rgba(0, 212, 170, 0.3)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  scannedText: {
    color: "#00d4aa",
    fontSize: 24,
    fontWeight: "bold",
  },
  overlayHint: {
    color: "#ffffff",
    opacity: 0.8,
    fontSize: 16,
    textAlign: "center",
  },
  controlButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  controlText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  resultBox: {
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00d4aa",
    width: "85%",
  },
  resultTitle: {
    color: "#00d4aa",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultCode: {
    color: "#ffffff",
    opacity: 0.7,
    fontSize: 13,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  searchButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 16,
  },
  scanAgainButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  scanAgainText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    color: "#ffffff",
    opacity: 0.7,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 16,
  },
});
