import { useState, useMemo } from "react";
import styles from "./ModelListing.module.css";
import { MODEL_ENCODINGS, MODEL_DISPLAY_NAMES } from "../utils/modelEncodings";

// --- DATA MANIFEST ---
const MODEL_CATEGORIES = [
  {
    id: "modern",
    title: "Modern Models",
    icon: "🚀",
    encoding: "o200k_base",
    description: "Latest encoding for modern models",
    color: "#FF6600", // Orange
    models: MODEL_ENCODINGS.o200k_base.map(
      (model) => MODEL_DISPLAY_NAMES[model] || model,
    ),
  },
  {
    id: "chat",
    title: "Chat Models",
    icon: "💬",
    encoding: "cl100k_base",
    description: "Standard encoding for chat models",
    color: "#00CC99", // Mint
    models: MODEL_ENCODINGS.cl100k_base.map(
      (model) => MODEL_DISPLAY_NAMES[model] || model,
    ),
  },
  {
    id: "oss",
    title: "OpenAI OSS",
    icon: "🎵",
    encoding: "o200k_harmony",
    description: "Special encoding for open-source",
    color: "#CCFF00", // Volt
    models: MODEL_ENCODINGS.o200k_harmony.map(
      (model) => MODEL_DISPLAY_NAMES[model] || model,
    ),
  },
  {
    id: "code",
    title: "Code Models",
    icon: "📝",
    encoding: "p50k_base",
    description: "Optimized for code generation",
    color: "#0066FF", // Blue
    models: MODEL_ENCODINGS.p50k_base.map(
      (model) => MODEL_DISPLAY_NAMES[model] || model,
    ),
  },
  {
    id: "edit",
    title: "Edit Models",
    icon: "✏️",
    encoding: "p50k_edit",
    description: "Designed for text editing tasks",
    color: "#FF3366", // Red
    models: MODEL_ENCODINGS.p50k_edit.map(
      (model) => MODEL_DISPLAY_NAMES[model] || model,
    ),
  },
  {
    id: "legacy",
    title: "Legacy Models",
    icon: "🏛️",
    encoding: "r50k_base",
    description: "Original GPT-3 encoding",
    color: "#666666", // Grey
    models: MODEL_ENCODINGS.r50k_base.map(
      (model) => MODEL_DISPLAY_NAMES[model] || model,
    ),
  },
].map((category) => ({
  ...category,
  models: category.models.sort((a, b) => a.localeCompare(b)),
}));

export function ModelListing({ onBack }: { onBack?: () => void }) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return MODEL_CATEGORIES;
    const lowerSearch = search.toLowerCase();

    return MODEL_CATEGORIES.map((cat) => ({
      ...cat,
      // Filter models array
      models: cat.models.filter((m) => m.toLowerCase().includes(lowerSearch)),
    })).filter(
      (cat) =>
        // Keep category if it matches title, encoding, or has matching models
        cat.title.toLowerCase().includes(lowerSearch) ||
        cat.encoding.toLowerCase().includes(lowerSearch) ||
        cat.models.length > 0,
    );
  }, [search]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* HEADER BAR */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={handleBack} className={styles.backButton}>
            ← BACK
          </button>
          <h1 className={styles.pageTitle}>System Manifest</h1>
        </div>

        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>⚡</span>
          <input
            type="text"
            placeholder="FILTER MODELS..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* CONTENT GRID */}
      <div className={styles.grid}>
        {filteredCategories.map((cat) => (
          <div key={cat.id} className={styles.card}>
            <div
              className={styles.cardHeader}
              style={{ borderBottom: `2px solid ${cat.color}` }}
            >
              <div className={styles.cardTitleRow}>
                <span className={styles.icon}>{cat.icon}</span>
                <h2 className={styles.cardTitle}>{cat.title}</h2>
              </div>
              <div className={styles.encodingBadge}>{cat.encoding}</div>
            </div>

            <div className={styles.cardMeta}>
              <span className={styles.desc}>{cat.description}</span>
              <span className={styles.count}>{cat.models.length} MODELS</span>
            </div>

            <div className={styles.modelList}>
              {cat.models.map((model) => (
                <div key={model} className={styles.modelItem}>
                  <div
                    className={styles.modelBullet}
                    style={{ background: cat.color }}
                  />
                  <span className={styles.modelName}>{model}</span>
                </div>
              ))}
              {cat.models.length === 0 && (
                <div className={styles.empty}>No matches in this category</div>
              )}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className={styles.noResults}>
            No models found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
