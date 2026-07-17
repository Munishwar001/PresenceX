import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  QrCode,
  MapPin,
  Wifi,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Smartphone,
  ScanLine,
  Fingerprint,
  Lock,
  Settings,
  Users,
  Bell,
  BarChart3,
  FileText,
  Search,
  Zap,
  ShieldCheck,
  Calendar,
  Layers,
  Star,
  Activity,
  ShieldAlert,
  Sliders,
  Terminal,
  Code,
  Network,
  Cpu,
} from "lucide-react";

interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  time: string;
  status: "Present" | "Late" | "Absent";
  method: "QR Scan" | "Manual";
}

interface MicroserviceModule {
  id: string;
  code: string;
  title: string;
  desc: string;
  icon: JSX.Element;
  latency: string;
  dbType: string;
  ports: string;
}

const INITIAL_STUDENTS: StudentAttendance[] = [
  { id: "1", name: "Rahul Sharma", rollNo: "CS24B102", time: "10:02 AM", status: "Present", method: "QR Scan" },
  { id: "2", name: "Pooja Patel", rollNo: "CS24B145", time: "10:04 AM", status: "Present", method: "QR Scan" },
  { id: "3", name: "Amit Joshi", rollNo: "CS24B128", time: "10:09 AM", status: "Late", method: "QR Scan" },
];

const SIMULATED_POOL = [
  { name: "Ananya Sen", rollNo: "CS24B105" },
  { name: "Kabir Singh", rollNo: "CS24B189" },
  { name: "Riya Roy", rollNo: "CS24B132" },
  { name: "Rohan Verma", rollNo: "CS24B154" }
];

// Re-structured modular service architecture groups
const ARCHITECTURE_GROUPS = [
  {
    id: "security",
    label: "Security & Authentication",
    modules: [
      { id: "m1", code: "SRV-AUTH-01", title: "Role-Based Access Control", desc: "JWT session authorization with automatic token refresh cycles and password hashing (bcrypt). Blocks proxy logins by binding session hashes to unique hardware profiles.", icon: <Lock className="w-5 h-5" />, latency: "< 8ms", dbType: "Redis", ports: "8081" },
      { id: "m2", code: "SRV-QR-02", title: "QR Rotation Gateway", desc: "Generates secure, rotating QR codes with unique time-bound session tokens. Rejects duplicated screenshot codes automatically.", icon: <QrCode className="w-5 h-5" />, latency: "< 5ms", dbType: "Memory Cache", ports: "8082" },
      { id: "m3", code: "SRV-SHIELD-03", title: "Security Auditing Shield", desc: "Protections against CSRF, XSS, API rate limiting, and inputs validations via robust Joi schema engines.", icon: <ShieldCheck className="w-5 h-5" />, latency: "< 12ms", dbType: "PostgreSQL", ports: "8083" },
      { id: "m4", code: "SRV-LOGS-04", title: "Activity & Audit Logs", desc: "Cryptographically tracks user login history, admin settings updates, and manual check-in override trails.", icon: <Layers className="w-5 h-5" />, latency: "< 15ms", dbType: "TimescaleDB", ports: "8084" }
    ]
  },
  {
    id: "admin",
    label: "Administration & Structuring",
    modules: [
      { id: "m5", code: "SRV-BOARD-01", title: "Institutional Boarding", desc: "Admin command dashboard to create classes, assign faculty, activate users, and manage departments.", icon: <Users className="w-5 h-5" />, latency: "< 14ms", dbType: "PostgreSQL", ports: "8085" },
      { id: "m6", code: "SRV-FILE-02", title: "File & Data Management", desc: "Bulk import student rosters via CSV / ExcelJS sheets. Automated database backups.", icon: <FileText className="w-5 h-5" />, latency: "< 90ms", dbType: "S3 Storage", ports: "8086" },
      { id: "m7", code: "SRV-SCHED-03", title: "Classroom Scheduling", desc: "Map lectures to semesters, allocate physical classrooms, and structure timetables.", icon: <Calendar className="w-5 h-5" />, latency: "< 10ms", dbType: "PostgreSQL", ports: "8087" },
      { id: "m8", code: "SRV-SETT-04", title: "Global Portal Settings", desc: "Fine-tune attendance time windows, customize QR refresh frequencies, and configure email details.", icon: <Settings className="w-5 h-5" />, latency: "< 4ms", dbType: "Redis Config", ports: "8088" }
    ]
  },
  {
    id: "analytics",
    label: "Real-Time & Analytics",
    modules: [
      { id: "m9", code: "SRV-WS-01", title: "WebSockets Stream", desc: "Uses Socket.io to push real-time check-in updates, active student count counters, and active session refreshes.", icon: <Zap className="w-5 h-5" />, latency: "< 2ms", dbType: "Socket.io Cache", ports: "8089" },
      { id: "m10", code: "SRV-ANALYT-02", title: "Analytics Engine", desc: "Visualizes presence trends, tracks low-attendance flags below 75%, and builds monthly subject graphs.", icon: <BarChart3 className="w-5 h-5" />, latency: "< 25ms", dbType: "ClickHouse", ports: "8090" },
      { id: "m11", code: "SRV-NOTIF-03", title: "Automated Notifications", desc: "Email triggers for warning alerts, check-in updates, and upcoming session notifications.", icon: <Bell className="w-5 h-5" />, latency: "< 45ms", dbType: "RabbitMQ Queue", ports: "8091" },
      { id: "m12", code: "SRV-SRCH-04", title: "Multi-Filter Search", desc: "Search and filter records by department, semester, subject modules, and checking status.", icon: <Search className="w-5 h-5" />, latency: "< 15ms", dbType: "ElasticSearch", ports: "8092" }
    ]
  }
];

const TESTIMONIALS = [
  {
    quote: "PresenceX resolved our proxy problems on day one. We saw class attendance figures match actual physical student headcounts precisely. Dynamic QRs are brilliant.",
    author: "Dr. Archana Sen",
    role: "Dean of Computer Science",
    institution: "IIT Delhi Campus",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
    rating: 5
  },
  {
    quote: "With over 4,000 students across departments, manually logging lists took half the lecture time. Now scanning takes 5 seconds. The automated warnings help us target alerts.",
    author: "Prof. Rajesh Kumar",
    role: "Department Registrar",
    institution: "VIT University",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120",
    rating: 5
  },
  {
    quote: "I love that I can track my attendance percentage. The notifications let me know immediately if I fall near the 75% cutoff threshold.",
    author: "Kabir Singh",
    role: "Undergrad Student",
    institution: "DTU Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    rating: 5
  }
];

export default function Landing() {
  const [sessionActive, setSessionActive] = useState(false);
  const [qrToken, setQrToken] = useState("PX-982-FXA");
  const [timeLeft, setTimeLeft] = useState(15);
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [scanStep, setScanStep] = useState<"idle" | "scanning" | "geofencing" | "wifi" | "face" | "success">("idle");
  const [scanningStudent, setScanningStudent] = useState<typeof SIMULATED_POOL[0] | null>(null);

  const [logs, setLogs] = useState<string[]>([
    "System ready — attendance tracking online",
    "Student database connected successfully",
    "Waiting for session to start..."
  ]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCodeTab, setActiveCodeTab] = useState<"json" | "typescript">("json");
  const [activeSchemaTab, setActiveSchemaTab] = useState<"prisma" | "api">("prisma");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");
  const terminalLogsContainerRef = useRef<HTMLDivElement>(null);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [qrExpirySlider, setQrExpirySlider] = useState(30);
  const [geofenceSlider, setGeofenceSlider] = useState(15);

  // Radar states
  const [radarRotation, setRadarRotation] = useState(0);
  const [activeBlip, setActiveBlip] = useState<string | null>(null);
  const [radarCoords, setRadarCoords] = useState({ lat: "28.6139", lng: "77.2090" });

  // Microservices architecture interactive states
  const [activeGroup, setActiveGroup] = useState("security");
  const [activeModule, setActiveModule] = useState<MicroserviceModule>(ARCHITECTURE_GROUPS[0].modules[0]);

  useEffect(() => {
    if (terminalLogsContainerRef.current) {
      terminalLogsContainerRef.current.scrollTop = terminalLogsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Rotates radar sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarRotation(prev => (prev + 1.5) % 360);
    }, 25);

    const gpsInterval = setInterval(() => {
      const driftLat = (28.6139 + (Math.random() - 0.5) * 0.0002).toFixed(4);
      const driftLng = (77.2090 + (Math.random() - 0.5) * 0.0002).toFixed(4);
      setRadarCoords({ lat: driftLat, lng: driftLng });
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(gpsInterval);
    };
  }, []);

  // Rotating QR code token simulator
  useEffect(() => {
    let interval: any;
    if (sessionActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const newToken = "PX-" + Math.floor(100 + Math.random() * 900) + "-" + Math.random().toString(36).substring(2, 5).toUpperCase();
            setQrToken(newToken);
            setLogs(prevLogs => [...prevLogs.slice(-8), `QR code refreshed → [${newToken}] (valid for ${qrExpirySlider}s)`]);
            return qrExpirySlider;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, qrExpirySlider]);

  const handleStartSession = () => {
    setSessionActive(true);
    setTimeLeft(qrExpirySlider);
    setLogs([
      "Session started — students can now scan the QR code",
      `Active QR code: ${qrToken} — refreshes every ${qrExpirySlider}s`
    ]);
  };

  const handleStopSession = () => {
    setSessionActive(false);
    setScanStep("idle");
    setLogs(prev => [...prev.slice(-8), "Session ended by teacher. No more check-ins accepted."]);
  };

  const handleSimulateScan = () => {
    if (!sessionActive || (scanStep !== "idle" && scanStep !== "success")) return;

    const checkedInNames = students.map(s => s.name);
    const available = SIMULATED_POOL.filter(s => !checkedInNames.includes(s.name));

    if (available.length === 0) {
      setLogs(prev => [...prev.slice(-8), "All students have already been marked present."]);
      return;
    }

    const randomStudent = available[Math.floor(Math.random() * available.length)];
    setScanningStudent(randomStudent);
    setScanStep("scanning");
    setLogs(prev => [...prev.slice(-8), `${randomStudent.name} is scanning the QR code...`]);

    setTimeout(() => {
      setScanStep("geofencing");
      setLogs(prev => [...prev.slice(-8), `✓ Location verified — student is within ${geofenceSlider}m of the classroom`]);

      setTimeout(() => {
        setScanStep("wifi");
        setLogs(prev => [...prev.slice(-8), "✓ Connected to campus Wi-Fi — network verified"]);

        setTimeout(() => {
          setScanStep("face");
          setLogs(prev => [...prev.slice(-8), "✓ Identity confirmed — device matches student profile"]);

          setTimeout(() => {
            setScanStep("success");
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            const newRecord: StudentAttendance = {
              id: Date.now().toString(),
              name: randomStudent.name,
              rollNo: randomStudent.rollNo,
              time: timeString,
              status: "Present",
              method: "QR Scan"
            };

            setStudents(prev => [newRecord, ...prev]);
            setLogs(prev => [
              ...prev.slice(-8),
              `🎉 ${randomStudent.name} marked Present at ${timeString}`
            ]);

            setTimeout(() => {
              setScanStep("idle");
            }, 2500);

          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const addLog = (type: string, message: string) => {
    setLogs(prev => [...prev, `${type.toUpperCase()}: ${message}`]);
  };

  const handleGroupSelect = (groupId: string) => {
    setActiveGroup(groupId);
    const selectedGroup = ARCHITECTURE_GROUPS.find(g => g.id === groupId);
    if (selectedGroup && selectedGroup.modules.length > 0) {
      setActiveModule(selectedGroup.modules[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1a22] font-sans antialiased selection:bg-purple-600 selection:text-white overflow-x-hidden">

      {/* Header - Full-width sticky navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none select-none">
        <div className="mx-auto max-w-6xl pointer-events-auto">
          <div className="bg-[#faf9f6]/85 backdrop-blur-xl border border-black/8 rounded-2xl shadow-sm px-6 py-3.5 flex items-center justify-between transition-all duration-300">

          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-7.5 text-purple-600" />
            <span className="font-display font-black tracking-tight text-[#1c1a22] text-base">PresenceX</span>

            {/* Live Gateway Telemetry Dot */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/15 text-[8px] font-mono font-bold text-purple-700">
              <span className="w-1 h-1 rounded-full bg-purple-500 animate-ping" />
              <span>LIVE</span>
            </span>
          </div>

          {/* Navigation Links with Gliding Hover Underlines */}
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <a
              href="#sandbox"
              className="relative py-1 transition-colors hover:text-[#1c1a22] group"
            >
              Live Demo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#configurator"
              className="relative py-1 transition-colors hover:text-[#1c1a22] group"
            >
              Settings
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#modules"
              className="relative py-1 transition-colors hover:text-[#1c1a22] group"
            >
              Modules
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#testimonials"
              className="relative py-1 transition-colors hover:text-[#1c1a22] group"
            >
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 font-mono">
            <Link
              to="/login"
              className="text-[10px] font-bold text-neutral-500 hover:text-black transition-all hover:tracking-widest uppercase tracking-wider"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="bg-[#1c1a22] hover:bg-neutral-800 text-white text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-wider transition-all duration-200 border border-white/15 shadow-xs flex items-center gap-1.5"
            >
              <span>&gt;_</span> DEPLOY
            </Link>
          </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-12 border-b border-black/5 overflow-hidden bg-[#faf9f6]">

        {/* Dynamic High-Tech Tactical Radar Background */}
        <div className="absolute right-[-15%] lg:right-[5%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[620px] sm:h-[620px] rounded-full border border-purple-500/10 pointer-events-auto z-0 flex items-center justify-center bg-white/30 backdrop-blur-xs shadow-inner">

          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: '120s' }}>
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-purple-600">000° N</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-purple-600">180° S</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-purple-600">090° E</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-purple-600">270° W</span>
          </div>

          <div className="absolute w-[85%] h-[85%] rounded-full border border-purple-500/10 flex items-center justify-center">
            <span className="absolute -top-3 text-[7px] font-mono text-neutral-400">RANGE: 15m</span>
            <div className="absolute w-[70%] h-[70%] rounded-full border border-purple-500/5 border-dashed flex items-center justify-center">
              <span className="absolute -top-3 text-[7px] font-mono text-neutral-400">10m</span>
              <div className="absolute w-[50%] h-[50%] rounded-full border border-purple-500/10 flex items-center justify-center">
                <span className="absolute -top-3 text-[7px] font-mono text-neutral-400">5m</span>
              </div>
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 left-0 right-0 rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(from ${radarRotation}deg, rgba(168,85,247,0.2) 0deg, rgba(168,85,247,0.05) 45deg, transparent 180deg)`
            }}
          />
          <div
            className="absolute w-1/2 h-[1px] bg-gradient-to-r from-purple-500 to-transparent origin-left left-1/2 top-1/2"
            style={{ transform: `rotate(${radarRotation - 90}deg)` }}
          />

          <div className="absolute w-full h-[1px] bg-purple-500/5" />
          <div className="absolute h-full w-[1px] bg-purple-500/5" />

          <div className="absolute bottom-6 left-6 text-[8px] font-mono text-neutral-500 leading-normal border-l border-purple-500/30 pl-2 pointer-events-none">
            <p>LAT: {radarCoords.lat}° N</p>
            <p>LNG: {radarCoords.lng}° E</p>
            <p>SYS_STATUS: SECURED</p>
          </div>

          <div className="absolute top-6 right-6 text-[8px] font-mono text-purple-600 leading-normal border-r border-purple-500/30 pr-2 text-right pointer-events-none">
            <p>FREQ: 2.45 GHZ</p>
            <p>SSID: IITD_CAMPUS</p>
            <p>BEACONS: 3 ACTIVE</p>
          </div>

          <button
            onMouseEnter={() => setActiveBlip("rahul")}
            onMouseLeave={() => setActiveBlip(null)}
            className="absolute top-[42%] left-[32%] w-4.5 h-4.5 cursor-pointer z-20 flex items-center justify-center group"
          >
            <span className="absolute w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-60" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white shadow-xs group-hover:scale-125 transition-transform" />
          </button>

          <button
            onMouseEnter={() => setActiveBlip("pooja")}
            onMouseLeave={() => setActiveBlip(null)}
            className="absolute bottom-[32%] right-[38%] w-4.5 h-4.5 cursor-pointer z-20 flex items-center justify-center group"
          >
            <span className="absolute w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-60" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white shadow-xs group-hover:scale-125 transition-transform" />
          </button>

          <button
            onMouseEnter={() => setActiveBlip("proxy")}
            onMouseLeave={() => setActiveBlip(null)}
            className="absolute top-[22%] right-[28%] w-5 h-5 cursor-pointer z-20 flex items-center justify-center group"
          >
            <span className="absolute w-4.5 h-4.5 bg-rose-500 rounded-full animate-ping opacity-50" />
            <span className="w-3 h-3 bg-rose-500 rounded-full border border-white shadow-md group-hover:scale-125 transition-transform flex items-center justify-center text-[7px] text-white font-bold font-mono">!</span>
          </button>

          {activeBlip === "rahul" && (
            <div className="absolute top-[47%] left-[12%] bg-[#121016] text-white p-2.5 rounded-lg shadow-lg text-[9px] font-mono z-30 w-40 border border-purple-500/20">
              <p className="font-bold text-emerald-400 flex items-center gap-1"><UserCheck className="w-3 h-3" /> ATTENDANCE MARKED ✓</p>
              <p className="mt-1">Student: Rahul Sharma</p>
              <p>Roll No: CS24B102</p>
              <p>Distance from class: 1.4m</p>
            </div>
          )}

          {activeBlip === "pooja" && (
            <div className="absolute bottom-[16%] right-[16%] bg-[#121016] text-white p-2.5 rounded-lg shadow-lg text-[9px] font-mono z-30 w-40 border border-purple-500/20">
              <p className="font-bold text-emerald-400 flex items-center gap-1"><UserCheck className="w-3 h-3" /> ATTENDANCE MARKED ✓</p>
              <p className="mt-1">Student: Pooja Patel</p>
              <p>Roll No: CS24B145</p>
              <p>Distance from class: 2.1m</p>
            </div>
          )}

          {activeBlip === "proxy" && (
            <div className="absolute top-[10%] right-[3%] bg-[#121016] text-white p-2.5 rounded-lg shadow-lg text-[9px] font-mono z-30 w-44 border border-rose-500/40">
              <p className="font-bold text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> PROXY ATTEMPT BLOCKED
              </p>
              <p className="mt-1">Wrong Wi-Fi network detected</p>
              <p>Location is 1.2km away — rejected</p>
              <p className="text-[7.5px] text-neutral-400">QR code already expired</p>
            </div>
          )}

        </div>

        {/* Editorial Text Overlays */}
        <div className="mx-auto max-w-7xl px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pointer-events-none">
          <div className="lg:col-span-6 space-y-8 text-left pointer-events-auto">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-purple-500/15 bg-white/80 shadow-xs font-mono text-[10px] text-purple-700">
              <Activity className="w-3.5 h-3.5 animate-pulse text-purple-600" />
              <span>LIVE: Campus attendance tracking is active</span>
            </div>

            <h1 className="font-display text-5xl sm:text-7xl font-black text-[#1c1a22] tracking-tight leading-none">
              No proxies. <br />
              No screenshots. <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Just presence.
              </span>
            </h1>

            <p className="max-w-md text-neutral-500 text-sm sm:text-base leading-relaxed">
              Hover over the live student pins on the campus map. PresenceX confirms your physical presence using GPS location, Wi-Fi connection, and a unique time-limited QR code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#sandbox"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1c1a22] text-white hover:bg-neutral-800 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider transition-colors shadow-lg"
              >
                Launch Sandbox
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#modules"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white hover:bg-neutral-50 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black transition-all"
              >
                Explore Modules
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* UNCONVENTIONAL SANDBOX: The Integrated Flow Dashboard */}
      <section id="sandbox" className="pb-24 px-6 relative z-10 max-w-7xl mx-auto">

        {/* SVG connection lines for visual pipeline logic */}
        <div className="bg-[#faf9f6] border border-black/5 rounded-3xl p-8 shadow-xs relative overflow-hidden">

          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 280 200 C 400 200, 360 300, 480 300" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6,4" fill="none" className="animate-dash-flow" />
              <path d="M 720 300 C 800 300, 820 200, 940 200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" fill="none" className="animate-dash-flow-delayed" />
            </svg>
          </div>

          <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              <span className="text-xs font-mono text-purple-700 uppercase tracking-widest font-bold">WebSocket Live Flow Sandbox</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">STATUS: INTERACTIVE WORKSPACE</span>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* 1. Lecturer Console Card */}
            <div className="lg:col-span-4 bg-white/70 backdrop-blur-md border border-purple-500/10 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[9px] font-mono text-purple-600 font-bold uppercase tracking-wide">Step 01 // Host</span>
                  <h3 className="text-xs font-bold text-neutral-800 mt-1">Instructor Session</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>

              <div className="bg-[#faf9f6] rounded-xl p-4 border border-black/5 flex flex-col items-center justify-center min-h-[170px] text-center">
                {sessionActive ? (
                  <>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrToken}`}
                      alt="Dynamic Verification Token"
                      className="w-28 h-28 object-contain rounded border border-neutral-100 shadow-xs"
                    />
                    <div className="mt-3 w-full flex justify-between text-[9px] font-mono text-neutral-500">
                      <span>Token: {qrToken}</span>
                      <span className="text-purple-600 font-bold">{timeLeft}s left</span>
                    </div>
                  </>
                ) : (
                  <div className="py-6">
                    <p className="text-xs font-bold text-neutral-500">Session Inactive</p>
                    <p className="text-[9.5px] text-neutral-400 mt-1 mb-4">Launch lecture scan loop</p>
                    <button
                      onClick={handleStartSession}
                      className="bg-[#1c1a22] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Start Session
                    </button>
                  </div>
                )}
              </div>

              {sessionActive && (
                <button
                  onClick={handleStopSession}
                  className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg transition-all cursor-pointer"
                >
                  End Session
                </button>
              )}
            </div>

            {/* 2. Overlapping Tilted Student Device Frame */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-[42px] opacity-20 blur-lg group-hover:opacity-40 transition" />
                <div className="w-[250px] aspect-[9/18] bg-[#14121a] rounded-[38px] p-2.5 border border-white/10 flex flex-col shadow-2xl relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#14121a] rounded-b-xl z-20 flex items-center justify-center">
                    <span className="w-5 h-0.5 bg-neutral-800 rounded-full" />
                  </div>

                  <div className="flex-1 bg-[#0b0a10] rounded-[30px] p-3 pt-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500 border-b border-white/5 pb-1">
                      <span>Step 02 // Client</span>
                      <span>10:10 AM</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                      {scanStep === "idle" && (
                        <div className="space-y-4">
                          <Smartphone className="w-6 h-6 text-purple-400 mx-auto animate-bounce" />
                          <p className="text-[10px] text-neutral-400 leading-normal max-w-[140px] mx-auto">
                            Point device camera to scan the dynamic QR code.
                          </p>
                          <button
                            onClick={handleSimulateScan}
                            disabled={!sessionActive}
                            className={`w-full text-[9px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer ${sessionActive ? "bg-white text-black hover:bg-neutral-200" : "bg-neutral-900 text-neutral-600 border border-white/5 cursor-not-allowed"
                              }`}
                          >
                            {sessionActive ? "Scan QR Code" : "Awaiting Host"}
                          </button>
                        </div>
                      )}

                      {scanStep === "scanning" && (
                        <div className="space-y-2 flex flex-col items-center animate-pulse">
                          <ScanLine className="w-8 h-8 text-purple-400" />
                          <p className="text-[8.5px] font-mono text-purple-400">Reading QR code...</p>
                        </div>
                      )}

                      {scanStep === "geofencing" && (
                        <div className="space-y-2 flex flex-col items-center">
                          <MapPin className="w-8 h-8 text-purple-400 animate-bounce" />
                          <p className="text-[9.5px] font-bold text-white">Checking your location...</p>
                        </div>
                      )}

                      {scanStep === "wifi" && (
                        <div className="space-y-2 flex flex-col items-center">
                          <Wifi className="w-8 h-8 text-blue-400 animate-pulse" />
                          <p className="text-[9.5px] font-bold text-white">Checking Wi-Fi network...</p>
                        </div>
                      )}

                      {scanStep === "face" && (
                        <div className="space-y-2 flex flex-col items-center">
                          <UserCheck className="w-8 h-8 text-indigo-400" />
                          <p className="text-[9.5px] font-bold text-white">Confirming identity...</p>
                        </div>
                      )}

                      {scanStep === "success" && (
                        <div className="space-y-2 flex flex-col items-center animate-float">
                          <div className="w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] font-bold text-emerald-400">Verified!</p>
                        </div>
                      )}
                    </div>

                    <div className="w-10 h-0.75 bg-white/10 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Server Database Console logs card */}
            <div className="lg:col-span-4 bg-[#121018] border border-white/5 rounded-2xl p-5 shadow-2xl font-mono text-[9px] flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Step 03 // Attendance Saved</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>

                <div ref={terminalLogsContainerRef} className="h-[180px] overflow-y-auto space-y-1.5 terminal-scrollbar pr-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-neutral-400 border-l border-purple-500/20 pl-2">
                      <span className="text-purple-400 font-bold mr-1">$</span> {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 mt-4 text-neutral-500 flex justify-between">
                <span>RECORDS: SAVED</span>
                <span>LIVE SYNC: ACTIVE</span>
              </div>
            </div>

          </div>

          {/* Roster logs below */}
          <div className="mt-8 border-t border-black/5 pt-6">
            <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider mb-4">Today's Attendance Roster</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {students.map((st) => (
                <div key={st.id} className="bg-white/80 backdrop-blur-xs border border-black/5 p-3 rounded-xl flex items-center justify-between hover:shadow-xs transition-shadow">
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1a22]">{st.name}</h4>
                    <span className="text-[9px] font-mono text-neutral-400">{st.rollNo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-neutral-400 block">{st.time}</span>
                    <span className="inline-block bg-emerald-500/10 text-emerald-700 text-[8px] font-bold px-1.5 py-0.25 rounded mt-1">{st.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* HIGH-FIDELITY INTERACTIVE GATEWAY CONFIGURATOR */}
      <section id="configurator" className="py-24 border-t border-black/5 bg-[#faf9f6] relative">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

            {/* Left Column: Visual Controller Deck */}
            <div className="lg:col-span-5 bg-white border border-black/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1c1a22] font-mono">Attendance Settings</span>
                </div>

                <h2 className="font-display text-2xl font-black text-[#1c1a22] mb-2 leading-tight">
                  Customize Your Classroom
                </h2>
                <p className="text-neutral-500 text-xs mb-8">
                  Use the sliders below to set how long codes stay valid and how far students can be from the classroom.
                </p>

                <div className="space-y-8">

                  {/* Slider 1: Expiry */}
                  <div className="bg-[#faf9f6] p-4 rounded-xl border border-black/5">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-800 mb-3">
                      <span className="flex items-center gap-1.5"><QrCode className="w-4 h-4 text-purple-600" /> Refresh Rate</span>
                      <span className="text-purple-600 font-mono bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">{qrExpirySlider}s</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={qrExpirySlider}
                        onChange={(e) => {
                          setQrExpirySlider(Number(e.target.value));
                          addLog("info", `CONFIG_UPDATE: Expiry updated to ${e.target.value}s`);
                        }}
                        className="w-full accent-purple-600 bg-neutral-200 rounded-lg h-1.5 cursor-pointer"
                      />
                    </div>
                    <p className="text-[9px] text-neutral-400 mt-2 font-mono">Code changes every {qrExpirySlider} seconds to block screenshots</p>
                  </div>

                  {/* Slider 2: Geofence */}
                  <div className="bg-[#faf9f6] p-4 rounded-xl border border-black/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> Proximity Range</span>
                      <span className="text-blue-600 font-mono bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">{geofenceSlider}m</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={geofenceSlider}
                        onChange={(e) => {
                          setGeofenceSlider(Number(e.target.value));
                          addLog("info", `CONFIG_UPDATE: Geofence radius set to ${e.target.value}m`);
                        }}
                        className="w-full accent-blue-600 bg-neutral-200 rounded-lg h-1.5 cursor-pointer"
                      />
                    </div>

                    <div className="bg-white rounded-lg border border-black/5 h-28 flex items-center justify-center relative overflow-hidden">
                      <span className="text-[7.5px] font-mono text-neutral-400 absolute top-2 left-2">ZONE PREVIEW</span>

                      <div className="w-3.5 h-3.5 bg-blue-500 rounded-full border border-white z-10 flex items-center justify-center shadow-md">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      </div>

                      <div
                        className="absolute border border-blue-500/30 bg-blue-500/5 rounded-full transition-all duration-300 flex items-center justify-center"
                        style={{
                          width: `${geofenceSlider * 2}px`,
                          height: `${geofenceSlider * 2}px`,
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      >
                        <span className="text-[7.5px] font-mono text-blue-600 absolute bottom-1.5">Radius: {geofenceSlider}m</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <span className="text-[9.5px] font-mono text-neutral-400 block border-t border-black/5 pt-3 mt-4">
                Settings update the live preview in real-time.
              </span>
            </div>

            {/* Right Column: Code Editor Workspace */}
            <div className="lg:col-span-7 bg-[#121018] rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between shadow-2xl">

              <div className="flex items-center justify-between bg-black/40 border-b border-white/5 px-6 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCodeTab("json")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeCodeTab === "json" ? "bg-white/10 text-purple-300 font-bold" : "text-neutral-500 hover:text-white"
                      }`}
                  >
                    Attendance Settings
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("typescript")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeCodeTab === "typescript" ? "bg-white/10 text-purple-300 font-bold" : "text-neutral-500 hover:text-white"
                      }`}
                  >
                    Attendance System
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[9px]">
                  <Code className="w-3.5 h-3.5 text-purple-400" />
                  <span>PREVIEW: ACTIVE</span>
                </div>
              </div>

              <div className="p-6 font-mono text-xs overflow-x-auto text-purple-300/90 leading-relaxed flex-1">
                {activeCodeTab === "json" ? (
                  <pre>
                    {`// Your current attendance settings

  ✔ Classroom Zone
     Students must be within ${geofenceSlider} metres
     of the class to mark attendance.

  ✔ QR Code Security
     Code refreshes every ${qrExpirySlider} seconds.
     Screenshots are automatically rejected.

  ✔ Wi-Fi Verification
     Student must be on campus network.

  ✔ Proxy Prevention: ON
     Duplicate scans are blocked.`}
                  </pre>
                ) : (
                  <pre>
                    {`// How attendance is verified — step by step

STEP 1: Student opens PresenceX app
  → App shows a time-limited QR code

STEP 2: Teacher starts the session
  → QR code refreshes every ${qrExpirySlider} seconds

STEP 3: Student scans the QR code
  → GPS checked: within ${geofenceSlider}m of class? YES
  → Wi-Fi checked: on campus network? YES
  → Identity matched to student profile? YES

STEP 4: Attendance saved instantly
  → Teacher sees the update in real time
  → Student gets a confirmation notification`}
                  </pre>
                )}
              </div>

              <div className="bg-black/20 border-t border-white/5 px-6 py-3 flex justify-between items-center text-[9px] text-neutral-500 font-mono">
                <span>UTF-8</span>
                <span>LIVE</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RETHINKED UNCONVENTIONAL CORE MODULES: Interactive Blueprint Visual Explorer */}
      <section id="modules" className="py-24 border-t border-black/5 bg-[#faf9f6] relative">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono">How It Works</span>
            <h2 className="font-display text-3xl font-extrabold text-[#1c1a22] mt-2 sm:text-4xl">
              Everything You Need, All in One Place
            </h2>
            <p className="text-neutral-500 text-sm mt-3">
              Explore all the powerful features PresenceX offers. Click a category on the left and pick a feature to see what it does.
            </p>
          </div>

          <div className="bg-[#f0ede6] border border-black/5 rounded-3xl p-6 md:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">

            {/* Category Navigation Bar (Left Column - Asymmetric Tab design) */}
            <div className="lg:col-span-3 flex flex-col gap-3 justify-start">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold block px-2 mb-2">CATEGORIES</span>
              {ARCHITECTURE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${activeGroup === group.id
                    ? "bg-[#1c1a22] text-white border-transparent shadow-lg scale-[1.02]"
                    : "bg-white hover:bg-neutral-50 text-neutral-500 border-black/5"
                    }`}
                >
                  <span>{group.label}</span>
                  <Network className={`w-4.5 h-4.5 transition-transform ${activeGroup === group.id ? "rotate-90 text-purple-400" : "text-neutral-400"}`} />
                </button>
              ))}
            </div>

            {/* Interactive Pipeline Map & Diagnostics Display (Right Columns) */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

              {/* Interactive Node Flowchart (Left Panel inside details block) */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-black/5 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block mb-4">FEATURES</span>

                  {/* Visual Node Flow Layout */}
                  <div className="flex flex-col gap-4 relative">
                    {ARCHITECTURE_GROUPS.find(g => g.id === activeGroup)?.modules.map((mod, index, arr) => (
                      <div key={mod.id} className="flex flex-col items-center">
                        <button
                          onClick={() => setActiveModule(mod)}
                          className={`w-full p-4.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${activeModule.id === mod.id
                            ? "border-purple-600 bg-purple-500/5 text-purple-950 font-bold shadow-xs ring-1 ring-purple-600/30"
                            : "border-black/5 bg-[#faf9f6] text-neutral-600 hover:border-neutral-300"
                            }`}
                        >
                          <div className="flex items-center gap-3.5 text-left">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${activeModule.id === mod.id ? "bg-purple-600 text-white" : "bg-neutral-200 text-neutral-600"
                              }`}>
                              {mod.icon}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold">{mod.title}</h4>
                              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider">Feature</span>
                            </div>
                          </div>

                          <span className="text-[8.5px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                            {mod.latency}
                          </span>
                        </button>

                        {index < arr.length - 1 && (
                          <div className="h-4.5 w-[2px] bg-purple-600/30 my-1 animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] font-mono text-neutral-500 border-t border-black/5 pt-4 mt-6">
                  Click any feature above to see a detailed description.
                </div>
              </div>

              {/* Service Specifications diagnostics readouts (Right Panel) */}
              <div className="md:col-span-5 bg-[#121018] rounded-2xl border border-white/5 p-6 text-white flex flex-col justify-between font-mono text-[10px] shadow-xl">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-purple-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" /> DETAILS
                    </span>
                    <span className="bg-emerald-500/25 text-emerald-400 text-[8px] px-2 py-0.25 rounded border border-emerald-500/30">ACTIVE</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-neutral-500 block text-[9.5px]">FEATURE NAME</span>
                      <span className="text-xs text-white font-bold font-sans">{activeModule.title}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[9.5px]">WHAT IT DOES</span>
                      <p className="text-[9.5px] text-neutral-300 font-sans leading-relaxed">{activeModule.desc}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div>
                        <span className="text-neutral-500 block text-[8px]">SPEED</span>
                        <span className="text-purple-300 font-bold flex items-center gap-1 mt-0.5">
                          <Zap className="w-3 h-3" /> {activeModule.latency}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[8px]">STATUS</span>
                        <span className="text-emerald-400 font-bold mt-0.5 block">Online ✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-6 flex justify-between text-[8px] text-neutral-500">
                  <span>UPTIME: 99.9%</span>
                  <span>SECURE: YES</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Testimonials - Official Endorsement Memo Desk */}
      <section id="testimonials" className="py-24 border-t border-black/5 bg-white relative">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono">Verified Endorsements</span>
            <h2 className="font-display text-3xl font-extrabold text-[#1c1a22] mt-2">
              Academic Feedback
            </h2>
          </div>

          <div className="bg-[#f0ede6] border border-black/5 rounded-3xl p-6 md:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Column: Organization Selector Tabs */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold block px-2 mb-2">INSTITUTION</span>
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-full text-left px-5 py-4.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${currentTestimonial === idx
                    ? "bg-[#1c1a22] text-white border-transparent shadow-lg scale-[1.02]"
                    : "bg-white hover:bg-neutral-50 text-neutral-500 border-black/5"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${currentTestimonial === idx ? "bg-purple-400" : "bg-neutral-300"}`} />
                    <span>{t.institution}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column: High-Fidelity Letterhead Memo */}
            <div className="lg:col-span-8 bg-[#faf9f6] border border-black/5 rounded-2xl p-6 md:p-10 shadow-inner flex flex-col justify-between relative overflow-hidden min-h-[360px]">

              {/* Security Seal Background Graphic */}
              <div className="absolute right-[-10%] top-[-10%] opacity-[0.03] pointer-events-none">
                <Logo className="w-80 h-80 text-purple-600" />
              </div>

              {/* Memo Header */}
              <div className="border-b-2 border-double border-black/15 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="font-mono text-[9px] text-neutral-500 leading-normal uppercase">
                  <p>REVIEW: FACULTY</p>
                  <p>YEAR: 2026</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                  ))}
                </div>
              </div>

              {/* Endorsement Statement */}
              <div className="flex-1 flex flex-col justify-center">
                <blockquote className="text-base md:text-lg font-serif italic text-neutral-800 leading-relaxed mb-8 relative">
                  <span className="absolute -left-4 -top-2 text-3xl text-purple-200 font-serif pointer-events-none font-bold">“</span>
                  {TESTIMONIALS[currentTestimonial].quote}
                  <span className="text-purple-200 font-serif font-bold">”</span>
                </blockquote>
              </div>

              {/* Memo Sign-off Footer */}
              <div className="border-t border-black/5 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

                {/* Author Avatar & Meta */}
                <div className="flex items-center gap-3">
                  <img
                    src={TESTIMONIALS[currentTestimonial].avatar}
                    alt={TESTIMONIALS[currentTestimonial].author}
                    className="w-11 h-11 rounded-full object-cover border border-black/10 shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1c1a22] font-sans">{TESTIMONIALS[currentTestimonial].author}</h4>
                    <p className="text-[9.5px] text-neutral-500 font-sans mt-0.5">
                      {TESTIMONIALS[currentTestimonial].role} • <span className="text-purple-600 font-bold">{TESTIMONIALS[currentTestimonial].institution}</span>
                    </p>
                  </div>
                </div>

                {/* Hand-signed security verification stamp */}
                <div className="bg-purple-600/5 border border-purple-500/15 rounded-lg px-3 py-2 text-right font-mono text-[8px] text-purple-800 self-end sm:self-center">
                  <p className="font-bold uppercase tracking-wider">VERIFIED</p>
                  <p className="text-neutral-500 mt-0.5">Authentic ✓</p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* How It Works - User Friendly Visual Section */}
      <section id="architecture" className="py-24 border-t border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs text-purple-600 font-bold uppercase tracking-widest">Simple & Secure</span>
            <h3 className="text-3xl font-extrabold text-neutral-800 mt-2">How PresenceX Works</h3>
            <p className="text-neutral-500 text-sm mt-3 max-w-lg mx-auto">
              From the moment class starts to when attendance is saved — everything happens in seconds, automatically.
            </p>
          </div>

          {/* Step-by-step visual flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 relative">

            {/* Connecting dashed lines (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 z-0" />

            {[
              {
                step: "01",
                icon: "🏫",
                color: "bg-purple-100 text-purple-700",
                ring: "ring-purple-200",
                title: "Teacher Starts Class",
                desc: "Teacher opens PresenceX and starts an attendance session. A unique QR code is instantly generated for the class."
              },
              {
                step: "02",
                icon: "📱",
                color: "bg-indigo-100 text-indigo-700",
                ring: "ring-indigo-200",
                title: "Student Scans QR",
                desc: "Student opens the app and scans the QR code shown on the classroom display. Takes less than 3 seconds."
              },
              {
                step: "03",
                icon: "🛡️",
                color: "bg-blue-100 text-blue-700",
                ring: "ring-blue-200",
                title: "3 Checks Run Instantly",
                desc: "PresenceX checks: ① Is student physically near the class? ② On campus Wi-Fi? ③ Is their identity confirmed?"
              },
              {
                step: "04",
                icon: "✅",
                color: "bg-emerald-100 text-emerald-700",
                ring: "ring-emerald-200",
                title: "Attendance Marked!",
                desc: "If all 3 checks pass, attendance is saved instantly. Teacher's dashboard updates live. Student gets a confirmation."
              }
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className={`w-20 h-20 rounded-2xl ${item.color} ring-4 ${item.ring} flex items-center justify-center text-3xl shadow-sm`}>
                  {item.icon}
                </div>
                <span className="text-[9px] font-black font-mono text-neutral-400 uppercase tracking-widest">Step {item.step}</span>
                <h4 className="text-sm font-extrabold text-neutral-800 leading-tight">{item.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-[180px]">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Security highlights row */}
          <div className="bg-[#faf9f6] rounded-3xl border border-black/5 p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <span className="text-2xl">🚫</span>
              <h5 className="text-sm font-extrabold text-neutral-800">No Proxies Possible</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">A friend can't mark attendance for you. The app verifies your location, device, and identity — all at once.</p>
            </div>
            <div className="text-center space-y-2 border-y sm:border-y-0 sm:border-x border-black/5 py-6 sm:py-0 sm:px-6">
              <span className="text-2xl">⚡</span>
              <h5 className="text-sm font-extrabold text-neutral-800">Under 5 Seconds</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">The entire verification — location, Wi-Fi, identity — completes in under 5 seconds so class isn't disrupted.</p>
            </div>
            <div className="text-center space-y-2">
              <span className="text-2xl">📊</span>
              <h5 className="text-sm font-extrabold text-neutral-800">Always Up to Date</h5>
              <p className="text-xs text-neutral-500 leading-relaxed">Teachers see attendance update live as students scan. No waiting, no paperwork, no manual counting.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Redesigned Asymmetric FAQ & Help Dashboard */}
      <section className="py-24 border-t border-black/5 bg-[#faf9f6]">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Help Center Copy & Search Mock */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono">FAQ</span>
            <h2 className="font-display text-4xl font-black text-[#1c1a22] leading-tight">
              Got Questions?<br />We’ve Got Answers.
            </h2>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              Browse the most common questions below. Can't find what you need? Reach out to our support team anytime.
            </p>

            {/* Mock Search input */}
            <div className="bg-white border border-black/5 rounded-xl p-3 flex items-center justify-between shadow-xs max-w-sm">
              <span className="text-neutral-400 text-xs pl-1">Search questions...</span>
              <span className="bg-[#1c1a22] text-white text-[9px] font-bold px-2 py-1 rounded font-mono">⌘K</span>
            </div>
          </div>

          {/* Right Column: Custom FAQ cards */}
          <div className="lg:col-span-7 space-y-4">
            {[
              {
                q: "What happens if a student has no internet during class?",
                a: "No problem! The QR scan still works in low-connectivity areas. Your attendance is saved locally on the device and automatically uploaded as soon as internet is restored.",
                ref: "TIP: Offline Mode"
              },
              {
                q: "Can the teacher mark attendance manually?",
                a: "Yes. Teachers have a simple dashboard to manually mark or adjust any student's attendance — perfect for situations where a student forgot their phone or had a technical issue.",
                ref: "TIP: Manual Override"
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-black/5 rounded-2xl p-5 hover:shadow-xs transition-shadow">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs text-neutral-800 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="mt-4 pt-4 border-t border-black/5 text-[11px] text-neutral-500 leading-relaxed space-y-3">
                    <p>{faq.a}</p>
                    <span className="inline-block bg-purple-500/5 text-purple-700 text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-purple-500/10 uppercase">
                      Reference: {faq.ref}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Rebuilt Architectural Oatmeal Footer Console */}
      <footer className="bg-[#eae6db] text-[#333038] border-t border-black/5 pt-24 pb-16 font-mono text-[10px]">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-black/10 pb-16 mb-12">

          {/* Col 1: Brand & Status (4/12) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5">
              <Logo className="h-6.5 w-7 text-purple-700" />
              <span className="font-display font-black text-sm tracking-tight text-[#1c1a22]">PresenceX</span>
            </div>
            <p className="text-[#615c6b] text-[10px] leading-relaxed font-sans max-w-sm">
              Smart attendance for colleges and universities. Students check in instantly with a QR scan — no proxies, no spreadsheets, no hassle.
            </p>

            {/* Status Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/10 border border-emerald-600/20 text-[8px] text-emerald-800 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ALL SYSTEMS: 100% OPERATIONAL</span>
            </div>
          </div>

          {/* Col 2: Directory Links (3/12) */}
          <div className="md:col-span-3 space-y-5">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">NAVIGATE</span>
            <ul className="space-y-3 text-[#615c6b]">
              <li><a href="#sandbox" className="hover:text-purple-700 transition-colors whitespace-nowrap">Live Demo</a></li>
              <li><a href="#configurator" className="hover:text-purple-700 transition-colors whitespace-nowrap">Settings Preview</a></li>
              <li><a href="#modules" className="hover:text-purple-700 transition-colors whitespace-nowrap">Features</a></li>
              <li><a href="#testimonials" className="hover:text-purple-700 transition-colors whitespace-nowrap">Reviews</a></li>
            </ul>
          </div>

          {/* Col 3: Specifications Specs (2/12) */}
          <div className="md:col-span-2 space-y-5">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">SECURITY</span>
            <ul className="space-y-3 text-[#615c6b]">
              <li><a href="#architecture" className="hover:text-purple-700 transition-colors whitespace-nowrap">Data Protection</a></li>
              <li><a href="#architecture" className="hover:text-purple-700 transition-colors whitespace-nowrap">Proxy Detection</a></li>
              <li><span className="text-neutral-400 block whitespace-nowrap">Secure Login</span></li>
              <li><span className="text-neutral-400 block whitespace-nowrap">Input Validation</span></li>
            </ul>
          </div>

          {/* Col 4: Interactive Newsletter Terminal command (3/12) */}
          <div className="md:col-span-3 space-y-5">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">STAY UPDATED</span>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  setNewsletterStatus("success");
                  setNewsletterEmail("");
                }
              }}
              className="bg-white/80 border border-black/5 rounded-xl p-4 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-neutral-500">
                <span>📬</span>
                <span className="text-purple-700 font-bold">Subscribe</span>
                <span>for updates</span>
              </div>

              {newsletterStatus === "idle" ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="enter email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-0 outline-hidden focus:ring-0 text-[10px] p-0 text-[#1c1a22] placeholder-neutral-400"
                  />
                  <button
                    type="submit"
                    className="bg-[#1c1a22] hover:bg-neutral-800 text-white text-[8px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    JOIN
                  </button>
                </div>
              ) : (
                <p className="text-emerald-700 text-[8.5px] font-bold">
                  ✓ You're in! We'll keep you posted.
                </p>
              )}
            </form>
            <p className="text-[8px] text-neutral-500">Enter your email and press JOIN to subscribe.</p>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="mx-auto max-w-7xl px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-500 text-[9px]">
          <p>© {new Date().getFullYear()} PresenceX. All rights reserved. Smart attendance for modern institutions.</p>
          <div className="flex gap-6">
            <span className="cursor-not-allowed hover:text-purple-700 transition-colors">MIT License</span>
            <span className="cursor-not-allowed hover:text-purple-700 transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Dashed Radar Range Ring */}
      <circle
        cx="24"
        cy="23"
        r="18"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Dynamic Coordinate Target Corners (Framing the Lock) */}
      <path
        d="M 6 12 L 6 6 L 12 6"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 42 12 L 42 6 L 36 6"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 6 34 L 6 40 L 12 40"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 42 34 L 42 40 L 36 40"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Intersecting Sweep Beams (Forming the X) */}
      <path
        d="M 12 11 L 18 17 M 30 29 L 36 35"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 36 11 L 30 17 M 18 29 L 12 35"
        stroke="url(#landing-logo-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Central Verified Lock Beacon (Radar center core) */}
      <circle
        cx="24"
        cy="23"
        r="5.5"
        fill="url(#landing-logo-gradient)"
        className="animate-pulse"
      />

      <defs>
        <linearGradient id="landing-logo-gradient" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
