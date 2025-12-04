function showPlaylistView() {
    window.location.href = "playlist.html";
}

function showMapView() {
    window.location.href = "index.html";
}

function showQuizView() {
    window.location.href = "quiz.html";
}

// Load and display liked songs
function loadPlaylist() {
    const likedSongs = getLikedSongs();
    const playlistContent = document.getElementById('playlist-content');
    
    if (!playlistContent) return;
    
    if (likedSongs.length === 0) {
        playlistContent.innerHTML = `
            <div class="empty-playlist">
                <p>🎵 Your playlist is empty!</p>
                <p>Go to the map and like some songs to build your playlist.</p>
            </div>
        `;
        return;
    }
    
    // Create grid of playlist items
    let html = '<div class="playlist-grid">';
    
    likedSongs.forEach((song, index) => {
        const trackMatch = song.songUrl.match(/\/track\/([a-zA-Z0-9]+)/);
        if (trackMatch) {
            const trackId = trackMatch[1];
            const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
            
            html += `
                <div class="playlist-item">
                    <h3>${song.country}</h3>
                    <div class="spotify-container">
                        <iframe 
                            style="border-radius:12px" 
                            src="${embedUrl}" 
                            width="100%" 
                            height="152" 
                            frameBorder="0" 
                            allowfullscreen="" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                        </iframe>
                    </div>
                    <button class="remove-btn" onclick="removeSong('${song.country}')">
                        Remove from Playlist
                    </button>
                </div>
            `;
        }
    });
    
    html += '</div>';
    playlistContent.innerHTML = html;
}

function getLikedSongs() {
    const stored = localStorage.getItem('likedSongs');
    return stored ? JSON.parse(stored) : [];
}

function saveLikedSongs(songs) {
    localStorage.setItem('likedSongs', JSON.stringify(songs));
}

function removeSong(countryName) {
    const likedSongs = getLikedSongs();
    const filtered = likedSongs.filter(song => song.country !== countryName);
    saveLikedSongs(filtered);
    loadPlaylist(); // Reload the playlist
}

// Load playlist when page loads
if (document.getElementById('playlist-content')) {
    loadPlaylist();
}