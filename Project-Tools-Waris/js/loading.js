document.addEventListener('DOMContentLoaded', () => {
    const progress = document.querySelector('.progress');
    let width = 0;

    // Simulate loading progress
    const interval = setInterval(() => {
        width += 1;
        progress.style.width = width + '%';

        if (width >= 100) {
            clearInterval(interval);
            // Redirect to index.html after loading
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500); // Short delay before redirect
        }
    }, 50); // Adjust the speed of the progress bar here
});
