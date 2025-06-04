import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";
import {
  BarcodeScanner,
  BarcodeFormat,
  Barcode,
} from "@capacitor-mlkit/barcode-scanning";
import { useState } from "react";
import "./Home.css";

const Home: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startScan = async () => {
    setScannedData(null);
    setErrorMessage(null);
    // Check for permissions first (important for a real app)
    // For ML Kit, the UI is handled by the plugin by making the webview transparent.
    // For others, you might need to grant permissions explicitly.

    try {
      // Hide the WebView background to show the camera
      document.body.classList.add("barcode-scanner-active");

      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE,
          BarcodeFormat.QrCode, // Add other formats if needed
        ],
      });

      // Show the WebView background again
      document.body.classList.remove("barcode-scanner-active");

      if (result.barcodes && result.barcodes.length > 0) {
        const barcode: Barcode = result.barcodes[0];
        setScannedData(barcode.displayValue);
        console.log("Scanned data:", barcode);
        // You'll now have the barcode data in result.barcode.displayValue or similar property
      } else if (!result) {
        setErrorMessage("Scan cancelled by user.");
      } else {
        setErrorMessage("No barcode found or scan failed.");
      }
    } catch (error: unknown) {
      document.body.classList.remove("barcode-scanner-active");
      console.error("Scan error:", error);
      if (error && typeof error === "object" && "message" in error) {
        setErrorMessage(
          `Scan failed: ${
            (error as { message?: string }).message || "Unknown error"
          }`
        );
      } else {
        setErrorMessage("Scan failed: Unknown error");
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home Page</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonButton expand="block" onClick={startScan}>
          Scan Barcode
        </IonButton>

        {scannedData && (
          <IonText color="success">
            <p>Scanned Barcode: {scannedData}</p>
          </IonText>
        )}
        {errorMessage && (
          <IonText color="danger">
            <p>{errorMessage}</p>
          </IonText>
        )}
        {/* The ExploreContainer can be removed or repurposed later */}
        {/* <ExploreContainer /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
