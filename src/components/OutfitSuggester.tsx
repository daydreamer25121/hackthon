import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OutfitSuggester.css';

const API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

const occasions = [
  { id: 'Casual', icon: '👕', label: 'Casual' },
  { id: 'Formal', icon: '👔', label: 'Formal' },
  { id: 'Wedding', icon: '💍', label: 'Wedding' },
  { id: 'Party', icon: '🎉', label: 'Party' },
  { id: 'Sports', icon: '🏃', label: 'Sports' },
  { id: 'Festive', icon: '🪔', label: 'Festive' },
];

export function OutfitSuggester({ skinTone }: { skinTone?: string }) {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    categories: string[];
    message: string;
  } | null>(null);

  const getSuggestion = async (occasion: string) => {
    setSelectedOccasion(occasion);
    setLoading(true);
    setResult(null);

    const payload = {
      occasion,
      notes,
      skin_tone: skinTone || '',
    };

    try {
      const res = await fetch(`${API_URL}/outfit-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Outfit Suggestion Error:", err);
      alert("Failed to get suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="outfit-suggester">
      <div className="outfit-suggester__head">
        <h2>🛍️ AI Outfit Stylist</h2>
        <p>Get personalized outfit ideas {skinTone ? `curated for your ${skinTone} palette` : 'tailored to you'}.</p>
      </div>

      <div className="outfit-suggester__card">
        <div className="occasion-grid">
          {occasions.map((occ) => (
            <button
              key={occ.id}
              className={`occasion-btn ${selectedOccasion === occ.id ? 'active' : ''}`}
              onClick={() => getSuggestion(occ.id)}
              disabled={loading}
              aria-label={`Suggest ${occ.label} outfit`}
            >
              <span className="occ-icon">{occ.icon}</span>
              <span className="occ-label">{occ.label}</span>
            </button>
          ))}
        </div>

        <div className="outfit-suggester__input-group">
          <input 
            type="text" 
            placeholder="Add special notes (e.g., 'outdoor event', 'prefer red')" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="outfit-notes-input"
          />
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="outfit-loading"
            >
              <div className="stylist-spinner" />
              <p>Curating your look...</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="outfit-result"
            >
              <div className="stylist-bubble">
                <span className="sparkle">✨</span>
                <p className="stylist-message">{result.message}</p>
              </div>

              <div className="categories-preview">
                <h4>Essential Categories:</h4>
                <div className="cat-tags">
                  {result.categories.map((cat) => (
                    <motion.span 
                      key={cat} 
                      whileHover={{ scale: 1.05 }}
                      className="cat-tag"
                    >
                      {cat}
                    </motion.span>
                  ))}
                </div>
              </div>

              <button className="btn-apply-outfit" onClick={() => alert('Filtering dashboard for categories: ' + result.categories.join(', '))}>
                View Curated Selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
