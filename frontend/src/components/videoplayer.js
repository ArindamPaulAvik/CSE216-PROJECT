import React from 'react';

function VideoPlayer({
  showVideoPlayer,
  selectedEpisode,
  videoRef,
  isPlaying,
  closeVideoPlayer,
  togglePlayPause,
  handleVideoPlay,
  handleVideoPause,
  handleVideoEnded,
  formatDuration
}) {
  if (!showVideoPlayer || !selectedEpisode) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'relative',
        width: '90%',
        maxWidth: '1200px',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Video Player Header */}
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #333'
        }}>
          <h3 style={{ color: '#fff', margin: 0 }}>
            Episode {selectedEpisode.EPISODE_NUMBER}: {selectedEpisode.SHOW_EPISODE_TITLE}
          </h3>
          <button
            onClick={closeVideoPlayer}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Video Element */}
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh'
          }}
          controls
          autoPlay
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          src={`/movies/${selectedEpisode.VIDEO_URL}`}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 15px',
          borderRadius: '6px',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0'}>
          <button
            onClick={togglePlayPause}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <span style={{ fontSize: '0.9rem' }}>
            {formatDuration(selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;