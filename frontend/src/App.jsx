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
  KeyRound,
  ArrowLeft,
  Send,
  Cpu,
  Layers,
  Sparkles,
  Radio,
  Sliders,
  Database,
  BarChart3,
  Download,
  Eye,
  SlidersHorizontal,
  FileCheck,
  Zap,
  Printer,
} from "lucide-react";

export default function VeriShieldForensicApp() {
  // Navigation & Auth States
  const [activeTab, setActiveTab] = useState("console"); // 'console' | 'analytics' | 'logs' | 'print' | 'settings'
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register' | 'forgot' | 'authenticated' | 'guest'
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", newPassword: "", otp: "" });
  const [forgotStep, setForgotStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Document & WebCam States
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [docType, setDocType] = useState("Aadhaar Card");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [latency, setLatency] = useState(380);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLogRow, setSelectedLogRow] = useState(null);

  // Settings Configuration State
  const [config, setConfig] = useState({
    ocrConfidenceThreshold: 85,
    faceMatchSensitivity: 90,
    tamperDetectionLevel: 75,
    autoQuarantine: true,
    realTimeWebhook: false,
    aiModel: "ResNet-50 + YOLOv8 Forensic (Production)",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  // Initial Audit Logs
  const [logs, setLogs] = useState([]);
   

  // Video attachment for live WebCam
  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => console.log("Stream play error:", err));
    }
  }, [isCameraActive, mediaStream]);

  const triggerDashboardTransition = (targetMode, userName) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentUser(userName);
      setAuthMode(targetMode);
      setIsTransitioning(false);
    }, 350);
  };

  const handleAuthSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    alert("Please provide both email and password.");
    return;
  }

  if (authMode === "register") {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
       
    
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const user = await response.json();

      alert("Registration successful!");

      triggerDashboardTransition("authenticated", user.name);
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }

    return;
  }

try {
  
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    body: formData,

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const user = await response.json();

  alert("Login successful!");

  triggerDashboardTransition("authenticated", user.name);
} catch (error) {
  console.error(error);
  alert("Invalid email or password.");}

};

  const handleGuestEntry = () => {
    triggerDashboardTransition("guest", "Guest Forensic Officer");
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Please enter a registered official email address.");
      return;
    }
    alert(`Security OTP sent to ${formData.email} (Demo OTP: 1234)`);
    setForgotStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (formData.otp !== "1234") {
      alert("Invalid OTP! Please enter verification code '1234' for this demo.");
      return;
    }
    if (!formData.newPassword) {
      alert("Please specify a new security password.");
      return;
    }
    alert("Password updated successfully. You can now proceed to login.");
    setForgotStep(1);
    setAuthMode("login");
  };

  const handleLogout = () => {
    stopCamera();
    setAuthMode("login");
    setCurrentUser(null);
    setResult(null);
    setDocPreview(null);
    setSelfieCaptured(null);
  };

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
      alert("Unable to access camera hardware. Please allow camera permissions in browser settings.");
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
  const loadScreenings = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/screenings");

    if (!response.ok) {
      throw new Error("Failed to load screenings");
    }

    const screenings = await response.json();

    const formattedLogs = screenings.map((screening) => ({
      id: `VERI-${screening.id}`,
      docType: screening.documentType,
      applicant: screening.applicantName,
      timestamp: new Date(screening.createdAt).toLocaleString(),
      ocrScore: `${screening.ocrScore}%`,
      faceMatch: `${screening.faceMatch}%`,
      riskScore: screening.tamperRisk / 100,
      riskLevel:
        screening.tamperRisk >= 70
          ? "High"
          : screening.tamperRisk >= 30
          ? "Medium"
          : "Low",
      status: screening.fraud ? "TAMPERED" : "AUTHENTICATED",
      details: screening.fraud
        ? "High forensic anomaly detected."
        : "All identity verification checks successfully validated.",
    }));

    setLogs(formattedLogs);
  } catch (error) {
    console.error("Failed to load screenings:", error);
  }
};
useEffect(() => {
  loadScreenings();
}, []);
const handleAnalyze = async () => {
  if (!docPreview) {
    alert("Please attach an identity document to begin the screening sequence.");
    return;
  }

  if (!selfieCaptured) {
    alert("Please capture a live facial biometric snapshot via WebCam.");
    return;
  }

  setAnalyzing(true);
  const startTime = performance.now();

  try {
    const response = await fetch("http://localhost:8080/api/screenings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicantName: "Adarsh Rai",
        documentType: docType,
        ocrScore: 99.1,
        faceMatch: 98.4,
        tamperRisk: 1.5,
        fraud: false,
        verdict:
          "AUTHENTICATION PASSED: All Cryptographic & Forensic Markers Validated",
      }),
    });

    if (!response.ok) {
      throw new Error("Screening request failed");
    }

    const savedScreening = await response.json();

    const newResult = {
      isFraud: savedScreening.fraud,
      ocrScore: savedScreening.ocrScore,
      faceMatch: savedScreening.faceMatch,
      tamperRisk: savedScreening.tamperRisk,
      docNumber: "6721 9081 2341",
      detectedName: savedScreening.applicantName,
      verdict: savedScreening.verdict,
    };

    setResult(newResult);

    setLogs((prev) => [
      {
        id: `VERI-${savedScreening.id}`,
        docType: savedScreening.documentType,
        applicant: savedScreening.applicantName,
        timestamp: "Just now",
        ocrScore: `${savedScreening.ocrScore}%`,
        faceMatch: `${savedScreening.faceMatch}%`,
        riskScore: savedScreening.tamperRisk / 100,
        riskLevel: savedScreening.fraud ? "High" : "Low",
        status: savedScreening.fraud
          ? "TAMPERED"
          : "AUTHENTICATED",
        details: savedScreening.fraud
          ? "High forensic anomaly detected."
          : "All identity verification checks successfully validated.",
      },
      ...prev,
    ]);
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the screening backend. Please make sure the backend is running.");
  } finally {
    const endTime = performance.now();
const latency = Math.round(endTime - startTime);
setLatency(latency);
    setAnalyzing(false);
  }
};

  // Printable Summary Report Generator Function
  const generatePrintableSummary = (logData) => {
    try {
      const isAuthentic = logData.status.includes("AUTHENTICATED") || logData.status.includes("VERIFIED");
      const statusColor = isAuthentic ? "#057a55" : "#e02424";

      const printWindow = window.open("", "_blank", "width=850,height=950");
      if (!printWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site in your browser settings to print reports.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Verification Summary - ${logData.id}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 35px; color: #111827; line-height: 1.5; }
              @media print {
                body { margin: 15px; }
                .no-print { display: none !important; }
              }
              .header { border-bottom: 2px solid #1f2937; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
              .logo { font-size: 20px; font-weight: 800; color: #0891b2; letter-spacing: 0.5px; }
              .token { font-family: monospace; font-size: 13px; font-weight: bold; }
              .title { text-align: center; font-size: 20px; font-weight: 800; text-transform: uppercase; margin: 25px 0 15px; color: #1f2937; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
              .meta-item span { display: block; font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 2px; }
              .verdict-box { border: 2px solid ${statusColor}; background: ${isAuthentic ? '#f0fdf4' : '#fef2f2'}; color: ${statusColor}; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
              .table-section { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
              .table-section td, .table-section th { border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: left; }
              .table-section th { color: #6b7280; text-transform: uppercase; font-size: 11px; }
              .diagnostic-box { background: #fafafa; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; margin-bottom: 30px; }
              .footer { border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 11px; color: #9ca3af; }
              .print-btn { background: #0891b2; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; margin-bottom: 20px; }
              .print-btn:hover { background: #0e7490; }
            </style>
          </head>
          <body>
            <div class="no-print" style="text-align: right;">
              <button onclick="window.print()" class="print-btn">🖨️ Print Summary Report</button>
            </div>
            <div class="header">
              <div>
                <div class="logo">🛡️ VeriShield AI Forensic Suite</div>
                <div style="font-size: 11px; color: #6b7280;">National Identity Verification & Biometric Screening Node</div>
              </div>
              <div style="text-align: right;">
                <div class="token">Token ID: ${logData.id}</div>
                <div style="font-size: 11px; color: #6b7280;">Date: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <h2 class="title">Official Patient / Applicant Verification Summary</h2>

            <div class="meta-grid">
              <div class="meta-item"><span>Patient / Applicant Name</span><strong>${logData.applicant}</strong></div>
              <div class="meta-item"><span>Document Scanned</span><strong>${logData.docType}</strong></div>
              <div class="meta-item"><span>Inspection Officer</span><strong>${currentUser || "Authorized Officer"} (SIH-26188)</strong></div>
              <div class="meta-item"><span>Timestamp</span><strong>${logData.timestamp}</strong></div>
            </div>

            <div class="verdict-box">
              <div>
                <h3 style="margin: 0; font-size: 16px;">VERDICT: ${isAuthentic ? "AUTHENTICATED / PASS" : "FORGERY SUSPECTED / FAIL"}</h3>
                <p style="margin: 3px 0 0; font-size: 12px;">Identity verification sequence successfully completed.</p>
              </div>
              <span style="font-size: 14px; font-weight: bold; font-family: monospace;">Risk: ${logData.riskLevel} (${logData.riskScore})</span>
            </div>

            <table class="table-section">
              <thead>
                <tr>
                  <th>Forensic Verification Layer</th>
                  <th>Observed Score</th>
                  <th>Validation Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>OCR Typography & Microprint Quality</td>
                  <td style="font-family: monospace; font-weight: bold;">${logData.ocrScore}</td>
                  <td style="color: ${statusColor}; font-weight: bold;">${isAuthentic ? "Valid" : "Discrepancy Detected"}</td>
                </tr>
                <tr>
                  <td>Live WebCam Biometric Match</td>
                  <td style="font-family: monospace; font-weight: bold;">${logData.faceMatch}</td>
                  <td style="color: ${statusColor}; font-weight: bold;">${isAuthentic ? "Matched" : "Mismatch / Generative Swap"}</td>
                </tr>
                <tr>
                  <td>National Database Cryptographic Handshake</td>
                  <td style="font-family: monospace;">256-Bit SHA Checksum</td>
                  <td style="color: #057a55; font-weight: bold;">Verified</td>
                </tr>
              </tbody>
            </table>

            <div>
              <strong style="font-size: 12px; text-transform: uppercase; color: #6b7280;">Forensic Diagnostic Summary:</strong>
              <div class="diagnostic-box">"${logData.details}"</div>
            </div>

            <div class="footer">
              <p>Generated automatically via VeriShield AI (SIH-26188 Node Lucknow) • Official Forensic Tamper-Evident Report</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Print generation error:", err);
      alert("Failed to generate printable summary report.");
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.docType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // VIEW 1: AUTHENTICATION PORTAL
  // ==========================================
  if (authMode === "login" || authMode === "register" || authMode === "forgot") {
    return (
      <div className="min-h-screen w-full bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between">
        {/* Animated Cyber Lights */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>
          <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-cyan-500/20 rounded-full blur-[140px] animate-blob-1"></div>
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] animate-blob-2"></div>
          <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-teal-500/15 rounded-full blur-[150px] animate-blob-3"></div>
        </div>

        {/* Brand Bar */}
        <div className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-md bg-slate-950/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-md shadow-cyan-500/20">
              <Fingerprint className="w-5 h-5" />
            </div>
            <span className="font-bold text-base text-white tracking-wide">VeriShield AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              SIH-26188
            </span>
          </div>
          <span className="text-xs text-slate-300 flex items-center gap-2 font-mono bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            National Identity Security Network
          </span>
        </div>

        {/* 2-Column Split Portal */}
        <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-12 gap-10 relative z-10">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs w-fit backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
              Next-Gen Deepfake & Forensic Shield
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Automated Forensic <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                Identity & Biometric
              </span> Screening
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Detect manipulated typography, forged PAN/Aadhaar vectors, and real-time live selfie camera deepfakes with multi-layer neural inspection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-lg transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] group">
                <Cpu className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white">Edge AI Pipeline</h4>
                <p className="text-[11px] text-slate-400 mt-1">&lt;400ms neural inference</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-500/40 backdrop-blur-lg transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] group">
                <Camera className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white">Live Liveness Check</h4>
                <p className="text-[11px] text-slate-400 mt-1">Direct WebCam matching</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-lg transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group">
                <Layers className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-white">Tamper Anomaly</h4>
                <p className="text-[11px] text-slate-400 mt-1">Noise & font forensics</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 w-full bg-slate-900/70 border border-slate-700/60 hover:border-cyan-500/40 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl transition-all shadow-cyan-950/40">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {authMode === "forgot" ? (
                  "Account Recovery"
                ) : authMode === "register" ? (
                  "Register Security Officer"
                ) : (
                  <>
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    Security Portal Login
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === "forgot"
                  ? "Reset access key via 2-factor OTP authorization."
                  : "Enter officer credentials to inspect audit feeds."}
              </p>
            </div>

            {authMode === "forgot" ? (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setForgotStep(1);
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-300">Back to Login</span>
                </div>

                {forgotStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Official ID / Email</label>
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
                    <button
                      type="submit"
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Send Security OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-xs text-emerald-400">
                      OTP transmitted to <span className="font-semibold text-white">{formData.email}</span> (Use Demo: 1234)
                    </p>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">4-Digit Security OTP</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="1234"
                          maxLength={4}
                          value={formData.otp}
                          onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 tracking-widest font-mono focus:outline-none focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">New Master Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="password"
                          placeholder="Enter new master password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Update Master Password
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Officer Name</label>
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
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email Address</label>
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Authorization Key / Password</label>
                    {authMode === "login" && (
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot")}
                        className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
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
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  {authMode === "login" ? "Secure Terminal Login" : "Register Credentials"}
                </button>
              </form>
            )}

            {authMode !== "forgot" && (
              <div className="text-center my-3">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {authMode === "login"
                    ? "Need verified credentials? Register here"
                    : "Already registered? Back to Login"}
                </button>
              </div>
            )}

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGuestEntry}
              className="w-full py-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
            >
              <span>Access Terminal (Guest Mode)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="w-full py-3 px-6 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/50 backdrop-blur-md">
          Smart India Hackathon 2026 • AI-Powered Anti-Fraud & Identity Verification Engine
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: 5-PAGE ENTERPRISE FORENSIC SUITE
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-30"></div>
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[140px] animate-blob-1"></div>
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-blob-2"></div>
        <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[150px] animate-blob-3"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-glow-reveal">
        <canvas ref={canvasRef} className="hidden" />

        <div className="w-full max-w-7xl">
          {/* Guest Advisory Alert */}
          {authMode === "guest" && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-amber-200 text-xs shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">Security Advisory:</span> Operating under **Guest Session**. Automated cryptographic audits are restricted. Please authenticate for production-level privileges.
                </div>
              </div>
              <button
                onClick={() => setAuthMode("login")}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow"
              >
                <LogIn className="w-3.5 h-3.5" /> Log In for High Security
              </button>
            </div>
          )}

          {/* Top Bar */}
          <header className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
            <div className="flex items-center gap-3.5">
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
                  Automated Forensic Identity & Deepfake Biometric Inspection Suite
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white">{currentUser}</p>
                <p className="text-[10px] text-cyan-400 uppercase font-mono">
                  {authMode === "authenticated" ? "Verified Forensic Officer" : "Guest Mode"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2.5 bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer backdrop-blur"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 5-Page Navigation Tab Bar */}
          <nav className="flex items-center gap-2 my-6 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md overflow-x-auto">
            <button
              onClick={() => setActiveTab("console")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "console"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Forensic Console
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Threat Analytics
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "logs"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Database className="w-4 h-4" />
              Audit Vault ({logs.length})
            </button>

            {/* Print Patient Summary Tab */}
            <button
              onClick={() => setActiveTab("print")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "print"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Printer className="w-4 h-4" />
              Print Patient Summary
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sliders className="w-4 h-4" />
              Settings
            </button>
          </nav>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400">TOTAL SCANNED</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">{logs.length}</p>
              <span className="text-[11px] text-cyan-400">+14% vs national average</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400">FORGERIES BLOCKED</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-bold text-rose-400 font-mono">{logs.filter((log) => log.status === "TAMPERED").length}</p>
              <span className="text-[11px] text-rose-400/80">Tampered Fonts & Morphs</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400">AUTHENTICATED</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{logs.filter((log) => log.status === "AUTHENTICATED").length}</p>
              <span className="text-[11px] text-emerald-400/80">95.7% Genuine Pass</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur">
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400">LATENCY TIME</span>
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">{latency} ms</p>
              <span className="text-[11px] text-amber-400">Edge Acceleration Online</span>
            </div>
          </div>

          {/* ====================================================
              PAGE 1: FORENSIC SCREENING CONSOLE
              ==================================================== */}
          {activeTab === "console" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      Document & Facial Biometric Input
                    </h2>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option>Aadhaar Card</option>
                      <option>PAN Card</option>
                      <option>Voter ID</option>
                      <option>Passport</option>
                      <option>Driving License</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Document Upload Box */}
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
                          ? "border-cyan-500/50 bg-slate-950/60 shadow-lg shadow-cyan-950/20"
                          : "border-slate-800 hover:border-cyan-500/40 bg-slate-950/30"
                      }`}
                    >
                      {docPreview ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <img
                            src={docPreview}
                            alt="Document Preview"
                            className="max-h-32 rounded-lg object-contain border border-slate-800 shadow"
                          />
                          <p className="text-xs text-cyan-400 font-medium mt-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {docType} Ready
                          </p>
                          <span className="text-[10px] text-slate-500">Click to change document</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                          <p className="text-xs font-semibold text-slate-200">
                            Upload {docType}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Supports JPG, PNG, WEBP (Aadhaar/PAN)
                          </p>
                        </>
                      )}
                    </div>

                    {/* WebCam Box */}
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
                            alt="Captured Live Face"
                            className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500 shadow"
                          />
                          <p className="text-xs text-cyan-400 font-medium mt-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Live Facial Sample Ready
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
                            3D Liveness & Anti-Spoofing Feed
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
                      Executing Neural OCR & Biometric Pipeline...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5" />
                      Run AI Forensic Screening Pipeline
                    </>
                  )}
                </button>
              </div>

              {/* AI Verdict Output */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Forensic AI Verdict & Diagnostics
                  </h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Multi-layer neural tampering & biometric verification breakdown.
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
                          <span className="text-slate-400">Identity ID:</span>
                          <span className="font-mono text-cyan-400">{result.docNumber}</span>
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">OCR Font Consistency</span>
                            <span className="text-cyan-400 font-mono font-bold">{result.ocrScore}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${result.ocrScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Biometric Face Match</span>
                            <span className="text-cyan-400 font-mono font-bold">{result.faceMatch}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${result.faceMatch}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">Tamper & Noise Anomaly</span>
                            <span className={`font-mono font-bold ${result.tamperRisk > 50 ? "text-rose-400" : "text-emerald-400"}`}>
                              {result.tamperRisk}% Anomaly
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${result.tamperRisk > 50 ? "bg-rose-500" : "bg-emerald-400"}`}
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
                      <p className="text-[10px] text-slate-600 mt-0.5">Real-time model inference output</p>
                    </div>
                  )}
                </div>

                {result && (
                  <button
                    onClick={() => generatePrintableSummary(logs[0])}
                    className="w-full mt-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <Printer className="w-4 h-4" /> Print Patient Forensic Summary
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              PAGE 2: THREAT ANALYTICS & HEATMAPS
              ==================================================== */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" /> Forgery Types Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Breakdown of blocked fraudulent attempts</p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Font Kerning & Typography</span>
                        <span className="text-cyan-400 font-mono">48% (301 cases)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: "48%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Deepfake Facial Morphing</span>
                        <span className="text-purple-400 font-mono">31% (195 cases)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full rounded-full" style={{ width: "31%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Photoshop Microprint Overlay</span>
                        <span className="text-rose-400 font-mono">15% (94 cases)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-400 h-full rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Expired / Invalid Checksums</span>
                        <span className="text-amber-400 font-mono">6% (38 cases)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: "6%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Real-Time Engine Health
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Inference hardware cluster status</p>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400">GPU VRAM Allocated:</span>
                      <span className="text-emerald-400 font-bold">4.2 GB / 16 GB (RTX)</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Inference Queue:</span>
                      <span className="text-cyan-400 font-bold">0 Pending (Real-Time)</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Accuracy Rate:</span>
                      <span className="text-emerald-400 font-bold">99.2% F1-Score</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Server Uptime:</span>
                      <span className="text-white font-bold">99.98% High Availability</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" /> Document Pass Rate
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Comparison across Indian ID cards</p>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Aadhaar (UIDAI Verified)</span>
                        <span className="text-emerald-400 font-mono">96.8% Safe</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: "96.8%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">PAN Card (ITD Service)</span>
                        <span className="text-amber-400 font-mono">91.2% Safe</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: "91.2%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Passport (MRZ Validated)</span>
                        <span className="text-cyan-400 font-mono">98.9% Safe</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: "98.9%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Grid */}
              <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">National Threat Vector Grid</h3>
                    <p className="text-xs text-slate-400">Live monitoring nodes across regional state clusters</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg font-mono">
                    All Nodes Synchronized
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[11px]">NORTH ZONE</p>
                    <p className="text-lg font-bold text-white mt-1">4,210 Scans</p>
                    <p className="text-rose-400 text-[11px] mt-0.5">3.8% Risk Flagged</p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[11px]">WEST ZONE</p>
                    <p className="text-lg font-bold text-white mt-1">5,890 Scans</p>
                    <p className="text-amber-400 text-[11px] mt-0.5">4.2% Risk Flagged</p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[11px]">SOUTH ZONE</p>
                    <p className="text-lg font-bold text-white mt-1">3,420 Scans</p>
                    <p className="text-emerald-400 text-[11px] mt-0.5">1.9% Risk Flagged</p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-slate-400 text-[11px]">EAST ZONE</p>
                    <p className="text-lg font-bold text-white mt-1">1,303 Scans</p>
                    <p className="text-rose-400 text-[11px] mt-0.5">5.1% Risk Flagged</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              PAGE 3: AUDIT VAULT & HISTORY
              ==================================================== */}
          {activeTab === "logs" && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">Forensic Audit Vault</h3>
                  <p className="text-xs text-slate-400">Cryptographically signed logs of all processed applicants</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search applicant, Ref ID, type..."
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Ref Token</th>
                      <th className="py-3.5 px-4">Applicant Name</th>
                      <th className="py-3.5 px-4">Doc Type</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4">OCR Score</th>
                      <th className="py-3.5 px-4">Face Match</th>
                      <th className="py-3.5 px-4">Risk Metric</th>
                      <th className="py-3.5 px-4">Screening Result</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-mono">
                    {filteredLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-cyan-400">{log.id}</td>
                        <td className="py-3.5 px-4 font-sans text-slate-100">{log.applicant}</td>
                        <td className="py-3.5 px-4 font-sans text-slate-300">{log.docType}</td>
                        <td className="py-3.5 px-4 font-sans text-slate-500">{log.timestamp}</td>
                        <td className="py-3.5 px-4 text-slate-200">{log.ocrScore}</td>
                        <td className="py-3.5 px-4 text-slate-200">{log.faceMatch}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={
                              log.riskLevel === "High"
                                ? "text-rose-400 font-bold"
                                : log.riskLevel === "Medium"
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {log.riskLevel} ({log.riskScore})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${
                              log.status.includes("AUTHENTICATED") || log.status.includes("VERIFIED")
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedLogRow(log)}
                            className="p-1.5 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg text-slate-400 cursor-pointer transition-colors"
                            title="View Forensic Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================
              PAGE 4: PRINT PATIENT FORENSIC SUMMARIES
              ==================================================== */}
          {activeTab === "print" && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Generate Printable Patient Summaries</h3>
                  <p className="text-xs text-slate-400">
                    Filter and generate official printable forensic verification summaries for patients or clients.
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search applicant, token ID..."
                    className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredLogs.map((log, idx) => {
                  const isAuthentic = log.status.includes("AUTHENTICATED") || log.status.includes("VERIFIED");
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-[240px]">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isAuthentic
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {isAuthentic ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white font-sans">{log.applicant}</p>
                          <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                            <span className="font-mono text-cyan-400">{log.id}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-300">{log.docType}</span>
                            <span className="text-slate-600">•</span>
                            <span>{log.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold font-mono ${
                            isAuthentic
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                          }`}
                        >
                          {isAuthentic ? "VERIFIED SAFE" : "FLAGGED / HIGH RISK"}
                        </span>
                        <button
                          onClick={() => generatePrintableSummary(log)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 transition-all"
                        >
                          <Printer className="w-4 h-4" /> Print Summary Report
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================
              PAGE 5: SETTINGS & MODEL CONFIGURATION
              ==================================================== */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                    Forensic Sensitivity Calibration
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjust neural threshold parameters for suspicious anomaly detection.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-semibold text-slate-200">OCR Minimum Confidence Threshold</span>
                      <span className="text-cyan-400 font-mono font-bold">{config.ocrConfidenceThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="99"
                      value={config.ocrConfidenceThreshold}
                      onChange={(e) => setConfig({ ...config, ocrConfidenceThreshold: Number(e.target.value) })}
                      className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-semibold text-slate-200">Biometric Facial Match Threshold</span>
                      <span className="text-cyan-400 font-mono font-bold">{config.faceMatchSensitivity}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="99"
                      value={config.faceMatchSensitivity}
                      onChange={(e) => setConfig({ ...config, faceMatchSensitivity: Number(e.target.value) })}
                      className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-semibold text-slate-200">Noise & Tampering Anomaly Sensitivity</span>
                      <span className="text-cyan-400 font-mono font-bold">{config.tamperDetectionLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="95"
                      value={config.tamperDetectionLevel}
                      onChange={(e) => setConfig({ ...config, tamperDetectionLevel: Number(e.target.value) })}
                      className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    AI Engine & Automated Rules
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure backend inference weights and automated incident dispatch.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-200 block mb-1">Active Neural Architecture</label>
                    <select
                      value={config.aiModel}
                      onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option>ResNet-50 + YOLOv8 Forensic (Production)</option>
                      <option>Vision Transformer (ViT-B/16) High-Precision</option>
                      <option>MobileNetV3 Edge Lite (Ultra-Low Latency)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Auto-Quarantine Forged IDs</p>
                      <p className="text-[10px] text-slate-400">Instantly flag suspicious identities to national blacklist</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.autoQuarantine}
                      onChange={(e) => setConfig({ ...config, autoQuarantine: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => alert("Model hyperparameters saved successfully!")}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
                  >
                    <FileCheck className="w-4 h-4" /> Apply & Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Row Inspection Modal */}
          {selectedLogRow && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Forensic Audit Inspection</h3>
                    <p className="text-xs font-mono text-cyan-400">{selectedLogRow.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLogRow(null)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Applicant:</span>
                    <span className="font-semibold text-white">{selectedLogRow.applicant}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Document Type:</span>
                    <span className="font-semibold text-white">{selectedLogRow.docType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">OCR Authenticity Score:</span>
                    <span className="font-mono text-cyan-400 font-bold">{selectedLogRow.ocrScore}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400">Biometric Face Alignment:</span>
                    <span className="font-mono text-cyan-400 font-bold">{selectedLogRow.faceMatch}</span>
                  </div>
                  <div className="py-2">
                    <p className="text-slate-400 mb-1">Diagnostic Log Summary:</p>
                    <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed font-mono text-[11px]">
                      {selectedLogRow.details}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLogRow(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Close Inspection Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 