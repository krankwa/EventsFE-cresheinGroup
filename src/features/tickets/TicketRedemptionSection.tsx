import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Camera,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ticketsService } from "../../services/ticketsService";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

export function TicketRedemptionSection() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRedeemedId, setLastRedeemedId] = useState<number | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const processLock = useRef(false);

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScannerActive(false);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    setIsScannerActive(true);

    // Give React a moment to render the #reader div
    setTimeout(async () => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) return;

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader", {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
      }

      try {
        await html5QrCodeRef.current.start(
          { facingMode: "environment" }, // Prefer back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          onScanFailure,
        );
      } catch (err) {
        console.error("Failed to start scanner", err);
        setCameraError(
          "Could not access camera. Ensure you have granted permission and are using HTTPS.",
        );
        setIsScannerActive(false);
      }
    }, 100);
  };

  const resetScanner = () => {
    setScanResult(null);
    setLastRedeemedId(null);
  };

  const handleRedeem = async (id: number) => {
    processLock.current = true;
    setIsProcessing(true);
    setScanResult(null);

    try {
      await ticketsService.scan(id);
      setScanResult("success");
      setLastRedeemedId(id);
      toast.success("Ticket redeemed successfully!", { duration: 5000 });

      // Optionally stop scanner on success to save battery
      // await stopScanner();

      // Clear success state after 5 seconds to allow next scan
      setTimeout(() => {
        setScanResult(null);
      }, 5000);
    } catch (error: unknown) {
      console.error("Redemption failed", error);
      setScanResult("error");
      const message = (error as Error).message || "Failed to redeem ticket.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
      processLock.current = false;
    }
  };

  async function onScanSuccess(decodedText: string) {
    if (processLock.current || isProcessing) return;

    const ticketId = parseInt(decodedText);
    if (isNaN(ticketId)) {
      toast.error("Invalid QR code format.");
      return;
    }

    if (ticketId === lastRedeemedId && scanResult === "success") return;

    processLock.current = true;
    // KILL scanner immediately to prevent runaway scans
    stopScanner();
    
    handleRedeem(ticketId);
  }

  function onScanFailure() {
    // Silent
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
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
            {!isScannerActive ? (
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

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={stopScanner}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 shadow-lg"
                >
                  Stop Scanner
                </Button>
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
