import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Camera,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ticketsService } from "../services/ticketsService";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

export function StaffRedemptionPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRedeemedId, setLastRedeemedId] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanner = async () => {
    try {
      setCameraError(null);
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length > 0) {
        setHasPermission(true);

        // Initialize scanner after permission/hardware check
        const scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          /* verbose= */ false,
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
      } else {
        setCameraError("No cameras found on this device.");
      }
    } catch (error) {
      console.error("Camera access error", error);
      setHasPermission(false);
      setCameraError("Camera permission denied or hardware unavailable.");
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((error) => console.error("Failed to clear scanner", error));
      }
    };
  }, []);

  async function onScanSuccess(decodedText: string) {
    // Avoid double processing
    if (isProcessing) return;

    // The QR code contains the ticketId
    const ticketId = parseInt(decodedText);

    if (isNaN(ticketId)) {
      toast.error("Invalid QR code format. Expected numeric Ticket ID.");
      return;
    }

    // If it's the same as the last one we just redeemed, wait a bit
    if (ticketId === lastRedeemedId && scanResult === "success") return;

    handleRedeem(ticketId);
  }

  function onScanFailure() {
    // This is called constantly during scanning, we don't need to log it
  }

  const handleRedeem = async (id: number) => {
    setIsProcessing(true);
    setScanResult(null);

    try {
      await ticketsService.scan(id);
      setScanResult("success");
      setLastRedeemedId(id);
      toast.success("Ticket redeemed successfully!");

      // Clear success state after 3 seconds to allow next scan
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    } catch (error: unknown) {
      console.error("Redemption failed", error);
      setScanResult("error");
      const message = (error as Error).message || "Failed to redeem ticket.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setLastRedeemedId(null);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link to="/redirect">
          <Button
            variant="ghost"
            className="gap-2 -ml-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
          <Camera className="w-3.5 h-3.5" />
          Scanner Active
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Ticket Redemption
        </h1>
        <p className="text-muted-foreground">
          Point the camera at the ticket's QR code to verify entry.
        </p>
      </div>

      <Card className="overflow-hidden border-2 shadow-2xl">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <QrCode className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Scanner View</CardTitle>
            </div>
            {isProcessing && (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative min-h-[300px] flex items-center justify-center bg-muted/20">
            {!hasPermission ? (
              <div className="p-8 text-center space-y-6 max-w-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">Camera Access Required</h3>
                  <p className="text-sm text-muted-foreground">
                    We need your permission to use the camera to scan ticket QR
                    codes.
                  </p>
                </div>
                {cameraError && (
                  <p className="text-xs text-destructive font-medium border border-destructive/20 bg-destructive/5 py-2 px-3 rounded-lg">
                    {cameraError}
                  </p>
                )}
                <Button
                  onClick={startScanner}
                  className="w-full rounded-full h-12 font-bold shadow-lg shadow-primary/20"
                >
                  Enable Camera
                </Button>
              </div>
            ) : (
              <div className="w-full relative">
                {/* Success Overlay */}
                {scanResult === "success" && (
                  <div className="absolute inset-0 z-10 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                    <CheckCircle2 className="w-20 h-20 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold">
                      Successfully Redeemed
                    </h3>
                    <p className="opacity-90">
                      Ticket #T-{lastRedeemedId?.toString().padStart(5, "0")}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 border-white text-white hover:bg-white/20"
                      onClick={resetScanner}
                    >
                      Scan Next
                    </Button>
                  </div>
                )}

                {/* Error Overlay */}
                {scanResult === "error" && (
                  <div className="absolute inset-0 z-10 bg-destructive/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                    <AlertCircle className="w-20 h-20 mb-4 scale-110" />
                    <h3 className="text-2xl font-bold">Invalid Ticket</h3>
                    <p className="opacity-90 max-w-[250px] text-center">
                      Ticket could not be verified or has already been used.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 border-white text-white hover:bg-white/20"
                      onClick={resetScanner}
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}

                <div
                  id="reader"
                  className="w-full bg-black aspect-square overflow-hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-muted/30 p-6 flex items-start gap-4 border border-muted-foreground/10">
        <div className="p-2 bg-background rounded-full shadow-sm text-primary">
          <QrCode className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm">Scanning Guide</h4>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside marker:text-primary">
            <li>Hold the ticket about 6 inches from the camera</li>
            <li>Ensure there is adequate lighting</li>
            <li>Wait for the camera to autofocus on the QR code</li>
            <li>
              Each ticket can only be redeemed{" "}
              <span className="text-foreground font-semibold">once</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
