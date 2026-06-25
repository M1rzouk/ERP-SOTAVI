import { Box, Typography, keyframes } from '@mui/material';
import SotaviLogo from '../../assets/images/logos/SotaviLogo.png';
import { useState, useEffect } from 'react';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const logoFloat = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-7px) scale(1.03); }
`;

const logoPulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,193,7,0.0), 0 0 40px rgba(255,193,7,0.12); }
  50%       { box-shadow: 0 0 0 14px rgba(255,193,7,0.06), 0 0 60px rgba(255,193,7,0.22); }
`;

const spinCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const spinCCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

const progressSweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
`;

const progressGlow = keyframes`
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
`;

const dotBounce = keyframes`
  0%, 80%, 100% { transform: scaleY(0.4); opacity: 0.4; }
  40%           { transform: scaleY(1);   opacity: 1; }
`;

const particleRise = keyframes`
  0%   { transform: translateY(0) scale(0); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 0.6; }
  100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
`;

const scanLine = keyframes`
  0%   { top: 0%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const gridPan = keyframes`
  from { transform: translate(0, 0); }
  to   { transform: translate(56px, 56px); }
`;

const shimmerText = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(255,193,7,0.2); }
  50%       { text-shadow: 0 0 28px rgba(255,193,7,0.55), 0 0 60px rgba(255,193,7,0.2); }
`;

const cornerPulse = keyframes`
  0%, 100% { opacity: 0.25; }
  50%       { opacity: 0.7; }
`;

const hexRotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const orbitDot = keyframes`
  from { transform: rotate(0deg) translateX(58px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(58px) rotate(-360deg); }
`;

const orbitDot2 = keyframes`
  from { transform: rotate(120deg) translateX(72px) rotate(-120deg); }
  to   { transform: rotate(480deg) translateX(72px) rotate(-480deg); }
`;

const orbitDot3 = keyframes`
  from { transform: rotate(240deg) translateX(88px) rotate(-240deg); }
  to   { transform: rotate(600deg) translateX(88px) rotate(-600deg); }
`;

const stepFadeIn = keyframes`
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Particle data ────────────────────────────────────────────────────────────

const PARTICLES = [
  { size: 2.5, left: '8%', delay: '0s', dur: '10s', opacity: 0.7 },
  { size: 3, left: '18%', delay: '1.5s', dur: '13s', opacity: 0.5 },
  { size: 2, left: '27%', delay: '3s', dur: '9s', opacity: 0.8 },
  { size: 3.5, left: '38%', delay: '0.8s', dur: '15s', opacity: 0.45 },
  { size: 2, left: '49%', delay: '4.2s', dur: '11s', opacity: 0.65 },
  { size: 2.5, left: '58%', delay: '2.1s', dur: '12s', opacity: 0.6 },
  { size: 3, left: '67%', delay: '5s', dur: '14s', opacity: 0.5 },
  { size: 2, left: '76%', delay: '1.2s', dur: '10.5s', opacity: 0.75 },
  { size: 3, left: '85%', delay: '6s', dur: '13.5s', opacity: 0.4 },
  { size: 2.5, left: '93%', delay: '3.5s', dur: '9.5s', opacity: 0.6 },
];

const LOAD_STEPS = [
  { label: 'Authentification', icon: '◈' },
  { label: 'Configuration', icon: '◈' },
  { label: 'Chargement données', icon: '◈' },
  { label: 'Interface prête', icon: '◈' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoadingFallback() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % LOAD_STEPS.length);
    }, 900); // ← change this number to control speed between steps

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: theme =>
          theme.palette.mode === 'dark'
            ? '#030712'
            : '#0B1120',
      }}
    >

      {/* ── Grid background ────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,193,7,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,193,7,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          animation: `${gridPan} 18s linear infinite`,
          zIndex: 0,
        }}
      />

      {/* ── Radial ambient light ────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% -5%, rgba(255,193,7,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 15% 90%, rgba(255,160,0,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 45% 45% at 88% 75%, rgba(255,193,7,0.06) 0%, transparent 55%)
          `,
          zIndex: 0,
        }}
      />

      {/* ── Vignette ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, #030712 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Scan line ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,193,7,0.18) 20%, rgba(255,193,7,0.35) 50%, rgba(255,193,7,0.18) 80%, transparent 100%)',
          animation: `${scanLine} 6s ease-in-out infinite`,
          zIndex: 2,
        }}
      />

      {/* ── Particles ──────────────────────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            bottom: '-10px',
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: '#FFC107',
            opacity: p.opacity,
            animation: `${particleRise} ${p.dur} ${p.delay} ease-in infinite`,
            zIndex: 2,
          }}
        />
      ))}

      {/* ── Corner brackets ────────────────────────────────────────────────── */}
      {[
        { top: 20, left: 20, borderTop: '1.5px solid rgba(255,193,7,0.5)', borderLeft: '1.5px solid rgba(255,193,7,0.5)', borderRadius: 0 },
        { top: 20, right: 20, borderTop: '1.5px solid rgba(255,193,7,0.5)', borderRight: '1.5px solid rgba(255,193,7,0.5)', borderRadius: 0 },
        { bottom: 20, left: 20, borderBottom: '1.5px solid rgba(255,193,7,0.5)', borderLeft: '1.5px solid rgba(255,193,7,0.5)', borderRadius: 0 },
        { bottom: 20, right: 20, borderBottom: '1.5px solid rgba(255,193,7,0.5)', borderRight: '1.5px solid rgba(255,193,7,0.5)', borderRadius: 0 },
      ].map((style, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 36,
            height: 36,
            animation: `${cornerPulse} 3s ${i * 0.4}s ease-in-out infinite`,
            zIndex: 3,
            ...style,
          }}
        />
      ))}

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >

        {/* ── Logo orbit system ─────────────────────────────────────────── */}
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            animation: `${fadeInUp} 0.8s ease both`,
          }}
        >
          {/* Outer orbit ring */}
          <Box
            sx={{
              position: 'absolute',
              width: 192,
              height: 192,
              borderRadius: '50%',
              border: '1px solid rgba(255,193,7,0.12)',
              animation: `${spinCW} 20s linear infinite`,
            }}
          />

          {/* Mid orbit ring */}
          <Box
            sx={{
              position: 'absolute',
              width: 152,
              height: 152,
              borderRadius: '50%',
              border: '1px dashed rgba(255,193,7,0.1)',
              animation: `${spinCCW} 14s linear infinite`,
            }}
          />

          {/* Inner orbit ring */}
          <Box
            sx={{
              position: 'absolute',
              width: 116,
              height: 116,
              borderRadius: '50%',
              border: '1px solid rgba(255,193,7,0.08)',
              animation: `${spinCW} 9s linear infinite`,
            }}
          />

          {/* Orbit dot 1 — outer */}
          <Box
            sx={{
              position: 'absolute',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#FFC107',
              boxShadow: '0 0 10px 4px rgba(255,193,7,0.7)',
              animation: `${orbitDot} 20s linear infinite`,
            }}
          />

          {/* Orbit dot 2 — mid */}
          <Box
            sx={{
              position: 'absolute',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#FFD54F',
              boxShadow: '0 0 8px 3px rgba(255,213,79,0.6)',
              animation: `${orbitDot2} 14s linear infinite`,
            }}
          />

          {/* Orbit dot 3 — inner */}
          <Box
            sx={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#FFECB3',
              boxShadow: '0 0 6px 2px rgba(255,236,179,0.7)',
              animation: `${orbitDot3} 9s linear infinite`,
            }}
          />

          {/* Logo core */}
          <Box
            sx={{
              position: 'relative',
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, rgba(255,193,7,0.03) 100%)',
              border: '1px solid rgba(255,193,7,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${logoFloat} 4s ease-in-out infinite, ${logoPulseGlow} 3s ease-in-out infinite`,
              zIndex: 5,
            }}
          >
            <Box
              component="img"
              src={SotaviLogo}
              alt="SOTAVI"
              sx={{
                width: 48,
                height: 48,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 14px rgba(255,193,7,0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              }}
            />
          </Box>
        </Box>

        {/* ── Brand name ────────────────────────────────────────────────── */}
        <Box
          sx={{
            textAlign: 'center',
            animation: `${fadeInUp} 0.9s 0.15s ease both`,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Syne", "Rajdhani", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 44px)',
              letterSpacing: '10px',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 35%, #FFB300 60%, #FF8F00 100%)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              animation: `${shimmerText} 4s linear infinite, ${glowPulse} 2.5s ease-in-out infinite`,
              mb: 0.5,
            }}
          >
            SOTAVI
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <Box sx={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,193,7,0.4))', maxWidth: 60 }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 300,
                fontSize: 10,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: 'rgba(255,193,7,0.45)',
              }}
            >
              Enterprise Resource Planning
            </Typography>
            <Box sx={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,193,7,0.4), transparent)', maxWidth: 60 }} />
          </Box>
        </Box>

        {/* ── Status messages ───────────────────────────────────────────── */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 3.5,
            animation: `${fadeInUp} 0.9s 0.3s ease both`,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: 'rgba(203,213,225,0.85)',
              letterSpacing: '0.4px',
              mb: 0.5,
            }}
          >
            Préparation de votre espace de travail
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 300,
              fontSize: 12.5,
              color: 'rgba(148,163,184,0.55)',
              letterSpacing: '0.3px',
            }}
          >
            Nous chargeons les dernières données…
          </Typography>
        </Box>

        {/* ── Animated loading bar ──────────────────────────────────────── */}

        {/* Track */}
        <Box
          sx={{
            width: 'fit-content',  // ← shrinks to whatever the steps row needs
            animation: `${fadeInUp} 0.9s 0.45s ease both`,
            mb: 2,
          }}
        >
          {/* Track */}
          <Box
            sx={{
              width: '100%',  // ← now stretches to match steps row below
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(255,193,7,0.1)',
              overflow: 'hidden',
              mb: 1.5,
            }}
          >
            {/* sweeping shimmer stays the same */}
          </Box>

          {/* Step dots with labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {LOAD_STEPS.map((step, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  animation: `${stepFadeIn} 0.5s ${i * 0.18}s ease both`,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: i === activeStep          // ← was: i === 0
                      ? '#FFC107'
                      : 'rgba(255,193,7,0.2)',
                    boxShadow: i === activeStep           // ← was: i === 0
                      ? '0 0 8px 3px rgba(255,193,7,0.5)'
                      : 'none',
                  }}
                />
                <Typography
                  sx={{
                    color: i === activeStep              // ← was: i === 0
                      ? 'rgba(255,193,7,0.7)'
                      : 'rgba(100,116,139,0.5)',
                    mx: 2,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 9.5,
                    fontWeight: 400,
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Wave bars indicator ───────────────────────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '4px',
            height: 28,
            animation: `${fadeInUp} 0.9s 0.55s ease both`,
            mb: 3,
          }}
        >
          {[0, 0.12, 0.24, 0.36, 0.48, 0.36, 0.24, 0.12, 0].map((delay, i) => (
            <Box
              key={i}
              sx={{
                width: 3,
                height: '100%',
                borderRadius: '2px',
                background: 'linear-gradient(180deg, #FFC107 0%, rgba(255,193,7,0.3) 100%)',
                animation: `${dotBounce} 1.1s ${delay}s ease-in-out infinite`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </Box>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            animation: `${fadeInUp} 0.9s 0.65s ease both`,
          }}
        >
          {[
            { val: '99.9%', label: 'Disponibilité' },
            { val: '256-bit', label: 'Chiffrement' },
            { val: 'v4.2.1', label: 'Version' },
          ].map((stat, i) => (
            <Box key={i} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontFamily: '"Syne", sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'rgba(255,193,7,0.65)',
                  letterSpacing: '0.5px',
                  lineHeight: 1.2,
                }}
              >
                {stat.val}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 10,
                  fontWeight: 300,
                  color: 'rgba(100,116,139,0.6)',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Footer quote ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          width: '90%',
          maxWidth: 480,
          animation: `${fadeInUp} 1s 0.8s ease both`,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 0.75,
            borderRadius: '100px',
            border: '1px solid rgba(255,193,7,0.1)',
            background: 'rgba(255,193,7,0.03)',
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#FFC107',
              flexShrink: 0,
              animation: `${progressGlow} 2s ease-in-out infinite`,
            }}
          />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 300,
              fontSize: 11.5,
              color: 'rgba(100,116,139,0.65)',
              letterSpacing: '0.4px',
              whiteSpace: 'nowrap',
            }}
          >
            Ensemble, construisons un avenir meilleur — Votre travail fait la différence
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#FFC107',
              flexShrink: 0,
              animation: `${progressGlow} 2s 1s ease-in-out infinite`,
            }}
          />
        </Box>
      </Box>

    </Box>
  );
}
