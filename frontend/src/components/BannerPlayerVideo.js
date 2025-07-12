import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const BannerPlayerVideo = ({ 
  show, 
  isVisible, 
  isMuted, 
  onToggleMute,
  onVideoLoad,
  onVideoError,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const getTeaserPath = (teaser) => {
    if (!teaser) return null;
    return `http://localhost:5000/BannerVideos/${teaser}`;
  };

  const getBannerPath = (banner) => {
    if (!banner) return 'http://localhost:5000/banners/placeholder.jpg';
    return `http://localhost:5000/banners/${banner}`;
  };

  // Handle video visibility and autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && show.TEASER) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch(error => {
            console.error('Video play failed:', error);
            setHasError(true);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, show.TEASER]);

  // Handle mute state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
      }
    };

    const handleTimeUpdate = () => updateProgress();
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      updateProgress();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [showControls]);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onVideoLoad?.(show.SHOW_ID);
  };

  const handleVideoError = (error) => {
    console.error('Video loading error:', error);
    setIsLoading(false);
    setHasError(true);
    onVideoError?.(show.SHOW_ID, error);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error('Video play failed:', error);
            setHasError(true);
          });
      }
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * video.duration;
    
    video.currentTime = newTime;
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If no teaser, show static banner
  if (!show.TEASER) {
    return (
      <div className={`banner-player-video static ${className}`}>
        <div 
          className="static-banner"
          style={{ backgroundImage: `url(${getBannerPath(show.BANNER)})` }}
        />
        <div className="static-overlay" />
      </div>
    );
  }

  return (
    <div 
      className={`banner-player-video ${className} ${isVisible ? 'visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="teaser-video"
        src={getTeaserPath(show.TEASER)}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        onCanPlay={handleVideoLoad}
        onError={handleVideoError}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Fallback Banner */}
      <div 
        className="fallback-banner"
        style={{ backgroundImage: `url(${getBannerPath(show.BANNER)})` }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <span className="loading-text">Loading preview...</span>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="error-overlay">
          <div className="error-content">
            <Play size={24} />
            <span>Preview unavailable</span>
          </div>
        </div>
      )}

      {/* Video Controls */}
      {!isLoading && !hasError && (
        <div className={`video-controls ${showControls ? 'visible' : ''}`}>
          <div className="controls-content">
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="progress-container"
              onClick={handleSeek}
            >
              <div className="progress-background" />
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="progress-handle"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="control-buttons">
              <button
                className="control-btn play-pause"
                onClick={handlePlayPause}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <div className="time-display">
                <span className="time-current">
                  {formatTime(videoRef.current?.currentTime || 0)}
                </span>
                <span className="time-separator">/</span>
                <span className="time-total">
                  {formatTime(duration)}
                </span>
              </div>

              <button
                className="control-btn mute-toggle"
                onClick={onToggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="gradient-overlay-top" />
      <div className="gradient-overlay-bottom" />

      <style>{`
        .banner-player-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
          z-index: 1;
        }

        .banner-player-video.static {
          z-index: 1;
        }

        .banner-player-video.visible {
          z-index: 2;
        }

        .teaser-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }

        .fallback-banner,
        .static-banner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          z-index: 1;
        }

        .static-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 2;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 3;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
        }

        .error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            transparent 100%
          );
          padding: 20px;
          z-index: 4;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .video-controls.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .controls-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .progress-container {
          position: relative;
          height: 6px;
          cursor: pointer;
          padding: 4px 0;
        }

        .progress-background {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          transform: translateY(-50%);
        }

        .progress-fill {
          position: absolute;
          top: 50%;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
          transform: translateY(-50%);
          transition: width 0.1s ease;
        }

        .progress-handle {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          background: #667eea;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .progress-container:hover .progress-handle {
          opacity: 1;
        }

        .control-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        .time-display {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          margin-left: auto;
        }

        .time-separator {
          color: rgba(255, 255, 255, 0.5);
        }

        .gradient-overlay-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.6) 0%,
            transparent 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        .gradient-overlay-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 150px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .video-controls {
            padding: 15px;
          }
          
          .control-btn {
            width: 28px;
            height: 28px;
          }
          
          .time-display {
            font-size: 11px;
          }
        }

        /* Accessibility */
        .control-btn:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .teaser-video,
          .video-controls,
          .progress-fill,
          .progress-handle {
            transition: none !important;
          }
          
          .loading-spinner {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerPlayerVideo;