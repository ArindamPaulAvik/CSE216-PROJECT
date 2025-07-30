import React from 'react';

function VideoPlayer({
  showVideoPlayer,
  selectedEpisode, // This should now be an episode object with VIDEO_URL
  videoRef,
  closeVideoPlayer,
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
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,30,0.98) 100%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1400px',
        height: '85vh',
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        
        {/* Animated Background Particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 30%, rgba(120,119,198,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,119,198,0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(119,198,255,0.2) 0%, transparent 50%)
          `,
          zIndex: 1,
          opacity: 0.6
        }} />

        {/* Header */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(180deg, 
            rgba(0,0,0,0.8) 0%, 
            rgba(0,0,0,0.6) 50%, 
            transparent 100%
          )`,
          padding: '25px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ 
              color: '#fff', 
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '0.5px'
            }}>
              {selectedEpisode.SHOW_EPISODE_TITLE || 'Video Player'}
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              margin: '5px 0 0 0',
              fontSize: '0.9rem',
              fontWeight: '400'
            }}>
              Episode {selectedEpisode.EPISODE_NUMBER} • {formatDuration(selectedEpisode?.SHOW_EPISODE_DURATION) || 'Duration unknown'}
            </p>
          </div>
          
          <button
            onClick={() => {
              closeVideoPlayer();
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,69,58,0.8)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Video Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getVideoSrc() ? (
            <iframe
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '20px'
              }}
              src={getVideoSrc()}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(255,69,58,0.1) 0%, rgba(255,159,10,0.1) 100%)',
              color: '#fff',
              fontSize: '1.2rem',
              textAlign: 'center',
              padding: '40px'
            }}>
              <div>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  opacity: 0.7
                }}>
                  📹
                </div>
                <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>
                  No video source available
                </h3>
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: 'rgba(255,255,255,0.7)',
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  Episode ID: {selectedEpisode.SHOW_EPISODE_ID || 'Unknown'}<br/>
                  VIDEO_URL: {selectedEpisode.VIDEO_URL || 'Not set'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
