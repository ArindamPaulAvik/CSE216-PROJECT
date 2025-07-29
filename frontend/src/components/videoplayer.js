import React from 'react';

function VideoPlayer({
  showVideoPlayer,
  selectedEpisode, // This should now be an episode object with VIDEO_URL
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

  // Get the video source URL - assumes VIDEO_URL contains Google Drive file ID
  const getVideoSrc = () => {
    console.log('=== DEBUG getVideoSrc ===');
    console.log('selectedEpisode type:', typeof selectedEpisode);
    console.log('selectedEpisode:', selectedEpisode);
    console.log('selectedEpisode keys:', selectedEpisode ? Object.keys(selectedEpisode) : 'null');
    
    // Check for VIDEO_URL in selectedEpisode (if it's an episode object)
    let videoId = selectedEpisode?.VIDEO_URL;
    console.log('Direct VIDEO_URL:', videoId);
    
    // If selectedEpisode is a show object, look for the current episode's video ID
    if (!videoId && selectedEpisode?.EPISODES && selectedEpisode.EPISODES.length > 0) {
      console.log('Checking EPISODES array, length:', selectedEpisode.EPISODES.length);
      console.log('First episode:', selectedEpisode.EPISODES[0]);
      videoId = selectedEpisode.EPISODES[0]?.VIDEO_URL;
      console.log('VIDEO_URL from first episode:', videoId);
    }
    
    // Check if it's an array of episodes (sometimes the API returns an array directly)
    if (!videoId && Array.isArray(selectedEpisode) && selectedEpisode.length > 0) {
      console.log('selectedEpisode is an array, length:', selectedEpisode.length);
      console.log('First item in array:', selectedEpisode[0]);
      videoId = selectedEpisode[0]?.VIDEO_URL;
      console.log('VIDEO_URL from first array item:', videoId);
    }
    
    console.log('Final video ID found:', videoId);
    
    if (videoId) {
      const trimmedId = videoId.toString().trim();
      console.log('Trimmed video ID:', trimmedId);
      console.log('Trimmed ID length:', trimmedId.length);
      console.log('Regex test result:', /^[a-zA-Z0-9_-]+$/.test(trimmedId));
      
      // If it looks like a Google Drive file ID (alphanumeric with dashes/underscores)
      if (/^[a-zA-Z0-9_-]+$/.test(trimmedId) && trimmedId.length > 10) {
        const finalUrl = `https://drive.google.com/file/d/${trimmedId}/preview`;
        console.log('Generated Google Drive URL:', finalUrl);
        return finalUrl;
      }
      // Otherwise, use the original path structure for local files
      const localUrl = `/movies/${trimmedId}`;
      console.log('Generated local URL:', localUrl);
      return localUrl;
    }
    console.log('No video ID found in any location');
    console.log('=== END DEBUG ===');
    return '';
  };

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
        {getVideoSrc() ? (
          <iframe
            ref={videoRef}
            style={{
              width: '100%',
              height: '70vh',
              border: 'none'
            }}
            src={getVideoSrc()}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            fontSize: '1.1rem'
          }}>
            <div>
              <p>No video source available</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#888' }}>
                Episode ID: {selectedEpisode.SHOW_EPISODE_ID} | VIDEO_URL: {selectedEpisode.VIDEO_URL || 'Not set'}
              </p>
            </div>
          </div>
        )}
        
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