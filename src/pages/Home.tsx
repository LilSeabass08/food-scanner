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
  SupportedFormat,
} from "@capacitor-mlkit/barcode-scanning";
import ExploreContainer from "../components/ExploreContainer";
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
          SupportedFormat.EAN_13,
          SupportedFormat.EAN_8,
          SupportedFormat.UPC_A,
          SupportedFormat.UPC_E,
          SupportedFormat.QR_CODE, // Add other formats if needed
        ],
      });

      // Show the WebView background again
      document.body.classList.remove("barcode-scanner-active");

      if (result.barcode) {
        setScannedData(result.barcode.displayValue);
        console.log("Scanned data:", result.barcode);
        // You'll now have the barcode data in result.barcode.displayValue or similar property
      } else if (result.cancelled) {
        setErrorMessage("Scan cancelled by user.");
      } else {
        setErrorMessage("No barcode found or scan failed.");
      }
    } catch (error: any) {
      document.body.classList.remove("barcode-scanner-active");
      console.error("Scan error:", error);
      setErrorMessage(`Scan failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Baby Food Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Scanner</IonTitle>
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
