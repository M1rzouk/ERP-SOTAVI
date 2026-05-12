import * as React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SotaviLogo from "./../assets/images/logos/SotaviLogo.png";
import userIcon from "./../assets/icons/police-id.png";
import lockIcon from "./../assets/icons/reset-password.png";
import eyeIcon from "./../assets/icons/eye.png";
import eyeOffIcon from "./../assets/icons/eyebrow.png";

// ── Slide content ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    emoji: "👋",
    title: ["Hello,", "Welcome", "Back"],
    sub: "Sign in to your account and pick up right where you left off.",
  },
  {
    emoji: "🚀",
    title: ["Track,", "Manage,", "Succeed"],
    sub: "Everything you need to run your operations — all in one place.",
  },
  {
    emoji: "🔒",
    title: ["Secure,", "Reliable,", "Fast"],
    sub: "Your data is protected with enterprise-grade security. Always.",
  },
];

// ── Animated Slider ───────────────────────────────────────────────────────────
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const INTERVAL = 3500;

export function PanelSlider() {
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // autoplay loop
  React.useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);

    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[current];

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{ position: "relative", zIndex: 1 }}
    >
      <AnimatePresence mode="wait">
        <MotionBox
          key={current}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Emoji badge */}
          <MotionBox
            whileHover={{ scale: 1.12, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "18px",
              fontSize: 28,
              mb: 3,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            {slide.emoji}
          </MotionBox>

          {/* Title */}
          <Box sx={{ mb: 2 }}>
            {slide.title.map((word, i) => (
              <MotionTypography
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.08,
                  type: "spring",
                  stiffness: 120,
                }}
                sx={{
                  fontSize: { md: 36, lg: 44 },
                  fontWeight:
                    i === slide.title.length - 1 ? 900 : 400,
                  color:
                    i === slide.title.length - 1
                      ? "#FFC107"
                      : "rgba(255,255,255,0.9)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.5px",
                }}
              >
                {word}
              </MotionTypography>
            ))}
          </Box>

          {/* Subtitle */}
          <MotionTypography
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              lineHeight: 1.8,
              maxWidth: 280,
            }}
          >
            {slide.sub}
          </MotionTypography>
        </MotionBox>
      </AnimatePresence>

      {/* Progress bar indicators */}
      <Box sx={{ display: "flex", gap: 1, mt: 5 }}>
        {SLIDES.map((_, i) => (
          <Box
            key={i}
            onClick={() => setCurrent(i)}
            sx={{
              position: "relative",
              height: 4,
              width: 32,
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {i === current && (
              <MotionBox
                key={current}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: paused ? 0 : INTERVAL / 1000,
                  ease: "linear",
                }}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(90deg, #FFC107, #FFD54F)",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
// ── Custom Input ──────────────────────────────────────────────────────────────
const CustomInput = ({ icon, rightIcon, onRightClick, type = "text", placeholder, value, onChange }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      background: "#F8FAFC",
      border: "1.5px solid #E2E8F0",
      borderRadius: "12px",
      px: 2,
      height: 50,
      transition: "all 0.2s",
      "&:focus-within": {
        borderColor: "#FFC107",
        background: "#FFFDF0",
        boxShadow: "0 0 0 3px rgba(255,193,7,0.12)",
      },
    }}
  >
    <Box component="img" src={icon} alt="" sx={{ width: 18, height: 18, opacity: 0.5, flexShrink: 0 }} />
    <Box
      component="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: 14,
        color: "#1E293B",
        fontFamily: "inherit",
        "&::placeholder": { color: "#94A3B8" },
      }}
    />
    {rightIcon && (
      <Box
        component="img"
        src={rightIcon}
        alt=""
        onClick={onRightClick}
        sx={{ width: 18, height: 18, opacity: 0.45, flexShrink: 0, cursor: "pointer", "&:hover": { opacity: 0.8 }, transition: "opacity 0.2s" }}
      />
    )}
  </Box>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", letterSpacing: "0.8px", textTransform: "uppercase", mb: 0.75 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [matricule, setMatricule] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  // Load previously saved matricule from localStorage when component mounts
  React.useEffect(() => {
    const savedMatricule = localStorage.getItem("lastMatricule");
    if (savedMatricule) {
      setMatricule(savedMatricule);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matricule === "2037" && password === "00") {
      // Save the successfully used matricule to localStorage
      localStorage.setItem("lastMatricule", matricule);
      onLogin();
      navigate("/");
    } else {
      setError("Invalid matricule or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(145deg, #F0F4FF 0%, #FFF8E7 50%, #F0FDF4 100%)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          display: "flex",
          width: { xs: "100%", sm: 480, md: 900 },
          maxWidth: 900,
          borderRadius: "24px !important",
          overflow: "hidden",
          border: "none !important",
          boxShadow: "0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06) !important",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: "0 0 42%",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(160deg, #1E293B 0%, #0F172A 100%)",
            p: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,193,7,0.12)", top: -80, right: -80 }} />
          <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,193,7,0.07)", bottom: 40, left: -60 }} />
          <Box sx={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,193,7,0.15)", bottom: 120, right: 40 }} />

          {/* Brand */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <img src={SotaviLogo} alt="SOTAVI" width={36} height={36} style={{ objectFit: "contain" }} />
              <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
                SOTAVI
              </Typography>
            </Box>
          </Box>

          {/* Animated slider */}
          <PanelSlider />
        </Box>

        {/* ── RIGHT FORM PANEL ── */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#FFFFFF",
            px: { xs: 3, sm: 5, md: 6 },
            py: { xs: 5, sm: 6, md: 7 },
          }}
        >
          {/* Mobile brand */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 4 }}>
            <img src={SotaviLogo} alt="SOTAVI" width={28} height={28} style={{ objectFit: "contain" }} />
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#1E293B" }}>SOTAVI</Typography>
          </Box>

          <Typography sx={{ fontSize: { xs: 22, sm: 26 }, fontWeight: 700, color: "#1E293B", mb: 0.5 }}>
            Sign in
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: 13.5, mb: 4 }}>
            Enter your credentials to continue
          </Typography>

          <Field label="Matricule">
            <CustomInput
              icon={userIcon}
              placeholder="Enter your matricule"
              value={matricule}
              onChange={(e) => { setMatricule(e.target.value); setError(""); }}
            />
          </Field>

          <Field label="Password">
            <CustomInput
              icon={lockIcon}
              rightIcon={showPassword ? eyeOffIcon : eyeIcon}
              onRightClick={() => setShowPassword(!showPassword)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
          </Field>

          <Fade in={!!error}>
            <Typography sx={{ color: "#EF4444", fontSize: 12.5, mt: -1, mb: 1, minHeight: 18 }}>
              {error}
            </Typography>
          </Fade>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2.5 }}>
            <Typography sx={{ fontSize: 12.5, color: "#64748B", cursor: "pointer", "&:hover": { color: "#FFC107" }, transition: "color 0.2s" }}>
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            disableElevation
            sx={{
              height: 50,
              borderRadius: "12px !important",
              background: "#FFC107",
              color: "#1A1A1A",
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(255,193,7,0.35)",
              transition: "all 0.25s",
              "&:hover": {
                background: "#FFB300",
                boxShadow: "0 10px 28px rgba(255,193,7,0.5)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0)" },
            }}
          >
            Sign In →
          </Button>

          <Typography sx={{ textAlign: "center", mt: 3, fontSize: 13, color: "#94A3B8" }}>
            Don't have an account?{" "}
            <Box component="span" sx={{ color: "#1E293B", fontWeight: 600, cursor: "pointer", "&:hover": { color: "#FFC107" }, transition: "color 0.2s" }}>
              Create one →
            </Box>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}