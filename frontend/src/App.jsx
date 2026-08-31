import React, { useState, useRef, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UserCheck,
  FileText,
  AlertTriangle,
  Camera,
  Activity,
  CheckCircle2,
  Fingerprint,
  RefreshCw,
  Search,
  Video,
  StopCircle,
  Lock,
  Mail,
  User,
  LogIn,
  ArrowRight,
  LogOut,
  Info,
} from "lucide-react";

export default function FakeIdentityApp() {
  // Auth States: 'login' | 'register' | 'authenticated' | 'guest'
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Verification States
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [docType, setDocType] = useState("Aadhaar Card");

  // Real WebCam states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);

  // Initial Logs
  const [logs, setLogs] = useState([
    {
      id: "SIH-90821",
      type: "Aadhaar Card",
      time: "2 mins ago",
      risk: "Low",
      score: 0.04,
      status: "VERIFIED",
    },
    {
      id: "SIH-90820",
      type: "PAN Card",
      time: "15 mins ago",
      risk: "High",
      score: 0.89,
      status: "FORGED FONT",
    },
  ]);

  // Attach webcam stream to video element
  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => console.log("Play error:", err));
    }
  }, [isCameraActive, mediaStream]);

  // Auth Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Kripya email aur password fill karein!");
      return;
    }
    setCurrentUser(formData.name || formData.email.split("@")[0]);
    setAuthMode("authenticated");
  };

  const handleGuestEntry = () => {
    setCurrentUser("Guest Officer");
    setAuthMode("guest");
  };

  const handleLogout = () => {
    stopCamera();
    setAuthMode("login");
    setCurrentUser(null);
    setResult(null);
    setDocPreview(null);
    setSelfieCaptured(null);
  };

  // WebCam Handlers
  const startCamera = async () => {
    try {
      setSelfieCaptured(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      setMediaStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Camera open nahi ho paya! Browser me camera permission allow karein.");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setSelfieCaptured(dataUrl);
      stopCamera();
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFile(file);
      setDocPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!docPreview) {
      alert("Pehle document upload karein!");
      return;
    }
    if (!selfieCaptured) {
      alert("Live webcam se photo snap karein!");
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const isFraud = Math.random() < 0.35;
      const newResult = {
        isFraud,
        ocrScore: isFraud ? 61.4 : 99.1,
        faceMatch: isFraud ? 44.8 : 98.4,
        tamperRisk: isFraud ? 86.2 : 1.5,
        docNumber: isFraud ? "XXXX-XXXX-9821 (Tampered)" : "6721 9081 2341",
        detectedName: "ADARSH RAI",
        verdict: isFraud
          ? "CRITICAL FRAUD: Face Mismatch & Digital Manipulation Detected"
          : "IDENTITY AUTHENTICATED: Live Biometrics & OCR Validated",
      };
      setResult(newResult);

      setLogs((prev) => [
        {
          id: `SIH-${Math.floor(10000 + Math.random() * 90000)}`,
          type: docType,
          time: "Just now",
          risk: isFraud ? "High" : "Low",
          score: isFraud ? 0.86 : 0.01,
          status: isFraud ? "TAMPERED" : "VERIFIED",
        },
        ...prev,
      ]);
    }, 2000);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN
  // ==========================================
  if (authMode === "login" || authMode === "register") {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-4 text-slate-100 font-sans relative overflow-hidden">
        {/* Background Glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <Fingerprint className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
              VeriShield AI
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                SIH-26188
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              National Fake Identity & Biometric Screening Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "register" && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Adarsh Rai"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Official / User Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="officer@verishield.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              {authMode === "login" ? "Secure Log In" : "Register Credentials"}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center my-3">
            <button
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {authMode === "login"
                ? "Need a verified account? Register here"
                : "Already registered? Back to Login"}
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Guest / Direct Access Option */}
          <button
            onClick={handleGuestEntry}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Enter Without Login (Guest Mode)</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MAIN DASHBOARD SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 md:p-8">
      <canvas ref={canvasRef} className="hidden" />

      {/* Guest Mode High-Security Alert Banner */}
      {authMode === "guest" && (
        <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-amber-200 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-300">High-Security Advisory:</span> Aap bina login kiye **Guest Mode** me hain. Sensitive identity verification aur full tamper logs secure rakhne ke liye log in karein.
            </div>
          </div>
          <button
            onClick={() => setAuthMode("login")}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow"
          >
            <LogIn className="w-3.5 h-3.5" /> Log In for High Security
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-3">
              VeriShield AI
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                SIH-26188
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Biometric Liveness & Forensic Document Verification System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{currentUser}</p>
            <p className="text-[10px] text-cyan-400 uppercase font-mono">
              {authMode === "authenticated" ? "Verified Officer" : "Guest Mode"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400">TOTAL SCANNED</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{logs.length + 14820}</p>
          <span className="text-[11px] text-cyan-400">+14% vs national average</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400">FORGERIES CAUGHT</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 font-mono">628</p>
          <span className="text-[11px] text-rose-400/80">Tampered Fonts & Morphs</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400">AUTHENTICATED</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">14,192</p>
          <span className="text-[11px] text-emerald-400/80">95.7% Genuine Pass</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400">SESSION MODE</span>
            <RefreshCw className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono uppercase text-sm mt-1">
            {authMode === "authenticated" ? "Encrypted (256-bit)" : "Guest Session"}
          </p>
          <span className="text-[11px] text-amber-400">Real-time Inference</span>
        </div>
      </div>

      {/* Main Screening Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Console */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Identity & Biometric Feed
              </h2>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Voter ID</option>
                <option>Passport</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Box 1: Document Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleDocUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all ${
                  docPreview
                    ? "border-cyan-500/50 bg-slate-950/60"
                    : "border-slate-800 hover:border-cyan-500/40 bg-slate-950/30"
                }`}
              >
                {docPreview ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={docPreview}
                      alt="Doc Preview"
                      className="max-h-32 rounded-lg object-contain border border-slate-800 shadow"
                    />
                    <p className="text-xs text-cyan-400 font-medium mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {docType} Ready
                    </p>
                    <span className="text-[10px] text-slate-500">Click to change</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                    <p className="text-xs font-semibold text-slate-200">
                      Upload {docType}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      JPG, PNG (Supports Aadhaar/PAN)
                    </p>
                  </>
                )}
              </div>

              {/* Box 2: REAL WEBCAM */}
              <div className="relative border-2 border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[220px] bg-slate-950/60">
                {isCameraActive && (
                  <div className="w-full flex flex-col items-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-32 rounded-lg object-cover border border-cyan-500/50 shadow"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 shadow cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" /> Snap Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <StopCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!isCameraActive && selfieCaptured && (
                  <div className="w-full flex flex-col items-center justify-center">
                    <img
                      src={selfieCaptured}
                      alt="Captured Face"
                      className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500 shadow"
                    />
                    <p className="text-xs text-cyan-400 font-medium mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Face Captured
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 underline mt-1 cursor-pointer"
                    >
                      Retake Photo
                    </button>
                  </div>
                )}

                {!isCameraActive && !selfieCaptured && (
                  <div className="flex flex-col items-center">
                    <Video className="w-8 h-8 text-cyan-400 mb-2" />
                    <p className="text-xs font-semibold text-slate-200">
                      Live Laptop WebCam
                    </p>
                    <p className="text-[10px] text-slate-500 mb-3">
                      Anti-Spoofing & Liveness
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" /> Open WebCam
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Running Neural OCR & Biometric Face Match...
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5" />
                Run AI Screening Pipeline
              </>
            )}
          </button>
        </div>

        {/* Right: AI Verdict Output */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            AI Screening Verdict
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Multi-layer tampering & biometric verification.
          </p>

          {result ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  result.isFraud
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.isFraud ? (
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold">
                      {result.isFraud ? "SUSPECTED FORGERY" : "VERIFIED AUTHENTIC"}
                    </h3>
                    <p className="text-[11px] opacity-80">{result.verdict}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded font-mono ${
                    result.isFraud
                      ? "bg-rose-500/20 text-rose-300"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {result.isFraud ? "HIGH RISK" : "SAFE"}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Extracted Name:</span>
                  <span className="font-semibold text-slate-200">{result.detectedName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document ID:</span>
                  <span className="font-mono text-cyan-400">{result.docNumber}</span>
                </div>
              </div>

              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">OCR Font Consistency</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {result.ocrScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${result.ocrScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Biometric Face Match</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {result.faceMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${result.faceMatch}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Tamper & Noise Anomaly</span>
                    <span
                      className={`font-mono font-bold ${
                        result.tamperRisk > 50 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {result.tamperRisk}% Anomaly
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        result.tamperRisk > 50 ? "bg-rose-500" : "bg-emerald-400"
                      }`}
                      style={{ width: `${result.tamperRisk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
              <ShieldAlert className="w-10 h-10 mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-medium">Attach document, capture live face & click Run</p>
            </div>
          )}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="mt-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">Live Forensic Audit Logs</h3>
            <p className="text-xs text-slate-400">History of all analyzed identity tokens</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Ref ID, type, status..."
              className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Doc Type</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Risk Metric</th>
                <th className="py-3 px-4">Screening Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-cyan-400">{log.id}</td>
                  <td className="py-3 px-4 font-sans text-slate-200">{log.type}</td>
                  <td className="py-3 px-4 font-sans text-slate-500">{log.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        log.risk === "High"
                          ? "text-rose-400 font-bold"
                          : log.risk === "Medium"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {log.risk} ({log.score})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${
                        log.status.includes("VERIFIED")
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}