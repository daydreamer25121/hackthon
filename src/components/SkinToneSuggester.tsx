import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SkinToneSuggester.css';

const API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export type SkinToneResult = {
  hex: string;
  palette: string;
  recommendations: { name: string; hex: string }[];
};

export function SkinToneSuggester({ 
  onResult, 
  result 
}: { 
  onResult: (res: SkinToneResult | null) => void;
  result: SkinToneResult | null;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(f);
      onResult(null);
      stopCamera();
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    setImage(null);
    setFile(null);
    onResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Camera access denied. Please check your settings.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
          }
        }, 'image/jpeg');
        
        stopCamera();
      }
    }
  };

  const analyze = async () => {
    if (!file) return;
    onResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/extract-skin-tone`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
    onResult(data);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      alert(err.message || 'Analysis failed. Please ensure your face is clearly visible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <section className="skin-suggester">
      <div className="skin-suggester__head">
        <h2>✨ AI Skin Tone Color Suggester</h2>
        <p>Unlock your perfect color palette with our AI-powered analysis.</p>
      </div>

      <div className="skin-suggester__card">
        <div className="skin-suggester__upload-section">
          {!isCameraOpen && !image && (
            <div className="skin-suggester__modes">
              <label className="skin-suggester__upload-drop">
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
                <div className="upload-icon">📸</div>
                <div className="upload-text">
                  <strong>Upload Photo</strong>
                  <span>Select from your device</span>
                </div>
              </label>
              
              <button className="btn-camera-toggle" onClick={startCamera}>
                <div className="upload-icon">📹</div>
                <div className="upload-text">
                  <strong>Live Camera</strong>
                  <span>Detect from webcam</span>
                </div>
              </button>
            </div>
          )}

          {isCameraOpen && (
            <div className="skin-suggester__video-container">
              <div className="preview-box">
                <video ref={videoRef} autoPlay playsInline className="skin-suggester__img" />
                <div className="video-overlay">
                  <div className="face-guide" />
                </div>
              </div>
              <div className="preview-actions">
                <button onClick={captureFrame} className="btn-analyze">Capture Photo</button>
                <button onClick={stopCamera} className="btn-clear">Cancel</button>
              </div>
            </div>
          )}

          {!isCameraOpen && image && (
            <div className="skin-suggester__preview-container">
              <div className="preview-box">
                <img src={image} alt="Preview" className="skin-suggester__img" />
                {loading && (
                  <motion.div 
                    className="scan-line"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {loading && (
                  <div className="scan-overlay">
                    <p>Analyzing Tone...</p>
                  </div>
                )}
              </div>
              
              {!loading && !result && (
                <div className="preview-actions">
                  <button onClick={analyze} className="btn-analyze">Analyze Now</button>
                  <button onClick={() => {setImage(null); setFile(null);}} className="btn-clear">Start Over</button>
                </div>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="skin-suggester__result-section"
            >
              <div className="result-main">
                <div 
                  className="result-tone-circle" 
                  style={{ backgroundColor: result.hex, boxShadow: `0 0 20px ${result.hex}66` }}
                />
                <div className="result-info">
                  <h3>Your Tone: <span className={`palette-badge ${result.palette.toLowerCase().replace(' ', '-')}`}>{result.palette}</span></h3>
                  <p>Analyzed hex: <span className="hex-text">{result.hex}</span>.</p>
                </div>
              </div>

              <div className="recs-section">
                <h4>Recommended Colors for You:</h4>
                <div className="recs-grid">
                  {result.recommendations.map((color) => (
                    <div key={color.name} className="rec-item">
                      <div className="rec-swatch" style={{ backgroundColor: color.hex }} />
                      <span className="rec-name">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-filter-products" onClick={() => alert('Filtering products for colors: ' + result.recommendations.map(r => r.name).join(', '))}>
                Filter Products for {result.palette} Palette
              </button>
              <button className="btn-retry" onClick={() => {onResult(null); setImage(null); setFile(null);}}>Try Another</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
