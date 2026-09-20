"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import styles from "./BlogSection.module.css";

interface FeaturePost {
  id: string;
  image: string;
  category: string;
  date: string;
  title: React.ReactNode;
}

interface GreenPost {
  id: string;
  category: string;
  title: React.ReactNode;
  description: string;
  links: string[];
}

interface BluePost {
  id: string;
  category: string;
  hot: string;
  title: React.ReactNode;
  image: string;
}

interface VideoPost {
  id: string;
  category: string;
  image: string;
  time: string;
  title: string;
}

interface BlogSlide {
  feature: FeaturePost;
  green: GreenPost;
  blue: BluePost;
  video: VideoPost;
}

const SLIDES: BlogSlide[] = [
  {
    feature: {
      id: "slide-0-feat",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=92",
      category: "Gym",
      date: "22 Feb",
      title: (
        <>
          BEST FULL-BODY
          <br />
          HOME GYM MACHINES !
        </>
      ),
    },
    green: {
      id: "slide-0-green",
      category: "Gym",
      title: (
        <>
          READY, SET, GO!
          <br />
          HOW TO START
          <br />
          RUNNING TO
          <br />
          STAY FIT
        </>
      ),
      description:
        "Walking Is Recognized As A Safe And Effective Mode Of Exercise When The Goal Is To Improve Fitness, Health, Or Both. Something As Simple As A Daily Brisk Walk Can Help Someone ... ",
      links: [
        "HOW TO READ GOLF GREEN GRAIN LIKE A PRO",
        "HOW TO WORK OUT IN A LIMITED SPACE",
      ],
    },
    blue: {
      id: "slide-0-blue",
      category: "Gym",
      hot: "Hot · 12 Feb",
      title: (
        <>
          OVERCOMING
          <br />
          LAZINESS IN
          <br />
          SPORTS
        </>
      ),
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=92",
    },
    video: {
      id: "slide-0-vid",
      category: "Tutorial",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=92",
      time: "5 Min . 22 Feb",
      title: "ATHLETIC TRAINING | SOFT AND HARD STYLES OF TRAINING",
    },
  },
  {
    feature: {
      id: "slide-1-feat",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=92",
      category: "Training",
      date: "25 Feb",
      title: (
        <>
          STRENGTH MASTERY:
          <br />
          PROGRESSIVE OVERLOAD
          <br />
          UNLOCKED !
        </>
      ),
    },
    green: {
      id: "slide-1-green",
      category: "Endurance",
      title: (
        <>
          THE QUIET POWER
          <br />
          OF ZONE 2<br />
          AEROBIC BASE
          <br />
          BUILDING
        </>
      ),
      description:
        "Eighty percent of your cardio should feel surprisingly conversational. Build mitochondrial density and stamina without exhausting your central nervous system ... ",
      links: [
        "MAXIMIZING DEEP RECOVERY SLEEP CYCLES",
        "HEART RATE VARIABILITY FOR ATHLETES",
      ],
    },
    blue: {
      id: "slide-1-blue",
      category: "Mobility",
      hot: "Hot · 18 Feb",
      title: (
        <>
          NINE MINUTE
          <br />
          DAILY FLOW FOR
          <br />
          DESK WORKERS
        </>
      ),
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=92",
    },
    video: {
      id: "slide-1-vid",
      category: "Tutorial",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=92",
      time: "7 Min . 20 Feb",
      title: "EXPLOSIVE PLYOMETRICS | SPEED & VERTICAL JUMP MECHANICS",
    },
  },
  {
    feature: {
      id: "slide-2-feat",
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=92",
      category: "Agility",
      date: "28 Feb",
      title: (
        <>
          EXPLOSIVE SPEED:
          <br />
          FAST-TWITCH MUSCLE
          <br />
          CONDITIONING !
        </>
      ),
    },
    green: {
      id: "slide-2-green",
      category: "Nutrition",
      title: (
        <>
          FUELING HEAVY
          <br />
          LIFTS ON A<br />
          PACKED WEEKLY
          <br />
          SCHEDULE
        </>
      ),
      description:
        "Strategic protein timing without tedious meal preparation. Optimize glycogen replenishment and muscular recovery between intense training sessions ... ",
      links: [
        "MICRONUTRIENTS FOR JOINT LONGEVITY",
        "EVIDENCE-BASED PRE-WORKOUT PROTOCOLS",
      ],
    },
    blue: {
      id: "slide-2-blue",
      category: "Breathwork",
      hot: "Hot · 21 Feb",
      title: (
        <>
          BREATH PACING
          <br />
          FOR HIGH LACTIC
          <br />
          INTERVALS
        </>
      ),
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=92",
    },
    video: {
      id: "slide-2-vid",
      category: "Recovery",
      image:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=92",
      time: "6 Min . 16 Feb",
      title: "FASCIA RELEASE & TARGETED MOBILITY FOR HEAVY SQUATS",
    },
  },
];

export default function BlogSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [scale, setScale] = useState(1);

  // Resize observer to maintain exact proportions on small screens
  useEffect(() => {
    const handleResize = () => {
      const maxWidth = 1448;
      const vw = window.innerWidth;
      if (vw < maxWidth) {
        setScale(vw / maxWidth);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatic transition every 5.5 seconds, pauses on mouse hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = SLIDES[slideIndex];
  const { feature, green, blue, video } = currentSlide;

  return (
    <section
      id="blog"
      className={styles.scaleWrapper}
      style={{ height: scale < 1 ? 1086 * scale : 1086 }}
    >
      <div
        className={styles.artboard}
        style={{ transform: `scale(${scale})` }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={styles.sheet}>

          <h1 className={styles.blogTitle}>BLOG</h1>

          <Link href="/blog" className={styles.read}>
            Read Our Blog <span>⟶</span>
          </Link>

          {/* 01 FEATURE CARD */}
          <div className={styles.featureCardContainer}>
            <article className={styles.feature}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={feature.image}
                  src={feature.image}
                  alt="Feature"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  loading="lazy"
                />
              </AnimatePresence>

            </article>

            <div className={styles.featureCopy}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <div className={styles.featureMeta}>
                    <strong>Category</strong>
                    <span>·</span>
                    <span>{feature.category}</span>
                    <span className={styles.bar}>|</span>
                    <span className={styles.gray}>{feature.date}</span>
                  </div>
                  <h2 className={styles.featureTitleText}>{feature.title}</h2>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 02 GREEN CARD */}
          <div className={styles.greenCardContainer}>
            <article className={styles.green}>
              <div className={styles.greenRings} />

              <div className={styles.greenContent}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={green.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <div className={styles.meta}>
                      <strong style={{ color: "#050505" }}>Category</strong>
                      <span>·</span>
                      <span>{green.category}</span>
                    </div>
                    <h3 className={styles.greenTitle}>{green.title}</h3>
                    <p className={styles.greenDescription}>
                      {green.description}
                      <u style={{ color: "#000", fontWeight: 600 }}>More</u>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className={styles.greenLinks}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={green.id + "-links"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ width: "100%" }}
                  >
                    {green.links.map((link, idx) => (
                      <div key={idx} className={styles.greenLinkItem}>
                        <span>{link}</span>
                        <span>→</span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </article>

            <button
              type="button"
              className={styles.exactGreenButton}
              aria-label="View article"
            >
              <svg
                viewBox="0 0 24 24"
                className={styles.exactArrowSvg}
                fill="none"
                stroke="#050505"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>

          {/* 03 BLUE CARD */}
          <article className={styles.blue}>
            <AnimatePresence mode="wait">
              <motion.div
                key={blue.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45 }}
                style={{ position: "relative", zIndex: 4 }}
              >
                <div className={styles.meta}>
                  <strong style={{ color: "#050505" }}>Category</strong>
                  <span>·</span>
                  <span>{blue.category}</span>
                </div>
                <div className={styles.hot}>{blue.hot}</div>
                <h3 className={styles.blueTitleText}>{blue.title}</h3>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.img
                key={blue.image}
                src={blue.image}
                alt="Blue card training"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                loading="lazy"
              />
            </AnimatePresence>
          </article>

          {/* 04 VIDEO CARD */}
          <article className={styles.video}>
            <AnimatePresence mode="wait">
              <motion.img
                key={video.image}
                src={video.image}
                alt={video.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                loading="lazy"
              />
            </AnimatePresence>

            <div className={styles.videoOverlay} />
            <div className={styles.videoMeta}>
              <span>Category · {video.category}</span>
            </div>

            <button
              type="button"
              className={styles.play}
              aria-label="Play video"
            >
              ▶
            </button>

            <div className={styles.videoBottom}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.time}>{video.time}</div>
                  <h4 className={styles.videoTitleText}>{video.title}</h4>
                </motion.div>
              </AnimatePresence>
            </div>
          </article>

          {/* 05 CATEGORIES CARD */}
          <article className={styles.categories}>
            <div className={styles.pills}>
              {[
                "Medical Knowledge",
                "Bodybuilding",
                "Reggie Food",
                "Sickness",
                "Life Style",
                "Diet",
                "Diseases",
                "Healthy Food",
              ].map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>

            <Link href="/blog" className={styles.catBottom} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
              <h3>View All Categories</h3>
              <div className={styles.catArrow} aria-hidden="true">
                <svg viewBox="0 0 84 84">
                  <path
                    d="M42 1 C47 1 50 8 50.8 14 C55.5 10.8 63.7 10.7 67.2 14.2 C70.8 17.7 69.9 25.4 67 30.1 C72.7 30.9 81 34.1 81 42 C81 49.4 73.1 52 67.1 53 C70.2 58.1 70.2 66.1 66.4 69.2 C62.7 72.5 55.2 70.9 50.5 67.5 C49.5 73.5 46.9 81 42 81 C36.8 81 34.2 73.5 33.2 67.5 C28.3 71 20.7 72.1 17.2 68.7 C13.7 65.3 14 57.8 17 52.9 C10.9 51.9 3 49.5 3 42 C3 34.8 10.9 31.6 17 30.6 C14.1 25.3 14 18 17.7 14.3 C21.3 10.8 28.6 11.2 33.2 14.3 C34.3 8.2 37 1 42 1 Z"
                    fill="#FFE76A"
                  />
                  <circle cx="42" cy="42" r="27.5" fill="#FFFFFF" />
                  <path
                    d="M30 42 H54 M47.5 35.5 L54 42 L47.5 48.5"
                    fill="none"
                    stroke="#050505"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
