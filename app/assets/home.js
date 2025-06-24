document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bgVideo');
    let scrollTimeout = null;

    window.addEventListener('scroll', () => {
        if (!video.paused) {
            video.pause();
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (video.paused) {
                video.play();
            }
        }, 200);
    });
});
