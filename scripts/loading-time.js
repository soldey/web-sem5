(() => {
    const start = Date.now();
    window.addEventListener('load', () => {
        const end = Date.now();
        const loadTime = document.getElementById('loadtime')

        loadTime.innerText = `Webpage was loaded in ${end - start}ms`;
    });
})();