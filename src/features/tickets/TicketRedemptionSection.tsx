import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { ticketsService } from "../../services/ticketsService";
import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

export function TicketRedemptionSection() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRedeemedId, setLastRedeemedId] = useState<number | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [redemptionError, setRedemptionError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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
    const hasGrantedBefore =
      localStorage.getItem("camera-permission-granted") === "true";

    setCameraError(null);
    setIsInitializing(true);

    // If we've granted before, show scanner UI early to avoid flicker
    if (hasGrantedBefore) {
      setIsScannerActive(true);
    }

    // Give React a moment to render the #reader div
    setTimeout(async () => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) {
        setIsInitializing(false);
        return;
      }

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
        setIsScannerActive(true);
        setIsInitializing(false);
        localStorage.setItem("camera-permission-granted", "true");
      } catch (err) {
        console.error("Failed to start scanner", err);
        setCameraError(
          "Could not access camera. Ensure you have granted permission and are using HTTPS.",
        );
        setIsScannerActive(false);
        setIsInitializing(false);
      }
    }, 100);
  };

  // Auto-start on mount if possible
  useEffect(() => {
    startScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setLastRedeemedId(null);
    setIsSuccessModalOpen(false);
    startScanner(); // Resume scanning after closing the success modal
  };

  const handleRedeem = async (id: number) => {
    processLock.current = true;
    setIsProcessing(true);
    setScanResult(null);

    try {
      await ticketsService.scan(id);
      setScanResult("success");
      setLastRedeemedId(id);
      setIsSuccessModalOpen(true);
      // Removed redundant toast.success as we now have a success modal
    } catch (error: unknown) {
      console.error("Redemption failed", error);
      const message = (error as Error).message || "Failed to redeem ticket.";
      setRedemptionError(message);
      setScanResult(null);
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

  const handleCloseError = () => {
    setRedemptionError(null);
    startScanner(); // Restart scanner when error is cleared
  };

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
          <div className="relative min-h-[400px] flex items-center justify-center bg-muted/20">
            {isInitializing && (
              <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="font-medium animate-pulse">
                  Initializing camera...
                </p>
              </div>
            )}

            {!isScannerActive && !isInitializing ? (
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
                  className="w-full rounded-full h-12 bg-blue-950 font-bold shadow-lg shadow-primary/20"
                >
                  Enable Camera
                </Button>
              </div>
            ) : (
              <div className="w-full relative">
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

      {/* Error Modal */}
      <Dialog
        open={!!redemptionError}
        onOpenChange={(open) => !open && handleCloseError()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              Redemption Failed
            </DialogTitle>
            <DialogDescription className="sr-only">
              Details about why the ticket redemption failed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="font-medium text-lg text-foreground">
              Invalid or Used Ticket
            </p>
            <p className="text-sm text-muted-foreground">{redemptionError}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCloseError}
              className="w-full bg-blue-950 font-bold"
            >
              Continue Scanning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={isSuccessModalOpen}
        onOpenChange={(open) => !open && resetScanner()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
              Success
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirmation that the ticket was successfully redeemed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <p className="font-bold text-xl text-foreground">
              Ticket Redeemed!
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 bg-muted/30 rounded-full text-sm font-mono font-bold border">
              #T-{lastRedeemedId?.toString().padStart(5, "0")}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              The ticket is now marked as used. You can proceed with the next guest.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={resetScanner}
              className="w-full bg-blue-950 font-bold shadow-lg shadow-emerald-500/10"
            >
              Scan Next Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
