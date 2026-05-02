document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 23, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 14, 23, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Fetch live user count
    const fetchUserCount = async () => {
        const userCountElement = document.getElementById('live-user-count');
        const ctaUserCountElement = document.getElementById('cta-user-count');
        
        try {
            // Using the provided Google Apps Script URL
            const url = 'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnQFkK4UqF5Vaq_YwJ4C9COr_9PRmy6OTqseIZ4lgoMYSEfkLeaWmxJY4vxYvroamXIkSJDzXWksRCm_0yVxVXzFnnlfr953G-rYI4UQm8OPN6Vj0j8E51-Y3dXlTBRl_J9yZ5Mi9RNUq0UICfSV_NxYpSJ0yhkMZgd_BVyAbx6Fi-jn73nrrg-jnncOa8GQe6AutZrkr2Ln1dL8jxZA1VtoN-HxqKo2fch9olyE5--n4hd78S-2EdcnDZHBwa5KUiptKOSegYTFdYXRUIYgO89dtl-rPblzUGJpy3YN&lib=MVOA5Ksc9sVTGSWB0H5dkoVDLLuzzHBvJ';
            
            // We use a simple fetch. Sometimes GAS URLs require cors mode or block it,
            // but we'll try standard fetch first.
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data && typeof data.total !== 'undefined') {
                    // Animate the counter
                    animateValue(userCountElement, 0, data.total, 2000);
                    ctaUserCountElement.textContent = data.total.toLocaleString() + '+';
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error fetching user count:', error);
            // Fallback value if fetch fails
            userCountElement.textContent = '10,000+';
            ctaUserCountElement.textContent = '10,000+';
        }
    };

    // Counter animation function
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Easing function for smoother counter
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * (end - start) + start);
            
            obj.innerHTML = current.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Call fetch on load
    fetchUserCount();

    // Fetch latest GitHub release for direct downloads
    const fetchLatestRelease = async () => {
        try {
            const response = await fetch('https://api.github.com/repos/mhmdrameez/xcoretechelectron/releases/latest');
            if (response.ok) {
                const data = await response.json();
                
                // Find the .exe asset
                const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
                if (exeAsset) {
                    const downloadUrl = exeAsset.browser_download_url;
                    
                    // Update all download buttons
                    document.querySelectorAll('.github-download-btn').forEach(btn => {
                        btn.href = downloadUrl;
                        // Optionally open in new tab or trigger direct download
                        // btn.target = "_blank"; 
                    });
                    
                    // Update version info dynamically
                    const versionInfo = document.getElementById('app-version-info');
                    if (versionInfo) {
                        const sizeMB = (exeAsset.size / (1024 * 1024)).toFixed(1);
                        const versionText = data.name || data.tag_name;
                        versionInfo.textContent = `Version ${versionText} | Windows 10/11 Compatible | ${sizeMB}MB`;
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching GitHub release:', error);
        }
    };
    fetchLatestRelease();

    // Fetch total junk cleared
    const fetchTotalJunk = async () => {
        const junkElement = document.getElementById('total-junk-cleared');
        const accumulatedJunkElement = document.getElementById('accumulated-junk');

        // Load from cache first
        const cachedJunk = localStorage.getItem('xcore_total_junk_cleared');
        if (cachedJunk) {
            if (junkElement) junkElement.textContent = cachedJunk;
            if (accumulatedJunkElement) accumulatedJunkElement.textContent = cachedJunk;
            window.xcoreCachedJunk = cachedJunk;
        }

        try {
            const url = 'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnRD5JPeFW6I0M9D1HDxpAFNh44QHHBuzdKMhWxsQ2ocT6SJpN8-T-FoWFmvlgx4D4RU8CdvGKbrhkYkZrIfDTExMSI9BrA7jd2F05GfxMd1NWvEQJwRokiydNBzp48ldJr_7atCLV-CP1gm9fjANnxNnhzgljf-e97ggaXADWC08D2HRcWBcaMurJFDlUCD7ob96ai35GueBYyYZrgiQLOMCLlMMc9RVlJcS9KinJCtbGDnyBRsnXehjwoPD8JtEtVbMmVaKxR7q74NG3jBfNNEVIYiX1KdLCeWK6hZqlvgOKX9vHQ&lib=MVOA5Ksc9sVTGSWB0H5dkoVDLLuzzHBvJ';
            // Note: Since the user explicitly provided a single working URL for junk, we'll hit the main url for files
            // but the browser might block it if CORS is not handled. We'll use the main URL the user provided.
            const urlJunk = 'https://script.google.com/macros/s/AKfycbyrao1GQrhzYsO9PE3yzdzgj7T3QbaiT8V06fELWqGFWkIqEqwwqKTbgIT3khlmP0n0/exec?type=total_junk';
            const response = await fetch(urlJunk).catch(() => fetch(url));
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.totalMB) {
                    const totalMB = parseFloat(data.totalMB);
                    let formattedValue;
                    
                    if (totalMB > 1024) {
                        formattedValue = (totalMB / 1024).toFixed(2) + ' GB';
                    } else {
                        formattedValue = totalMB.toFixed(0) + ' MB';
                    }
                    
                    // Update UI
                    if (junkElement) junkElement.textContent = formattedValue;
                    if (accumulatedJunkElement) accumulatedJunkElement.textContent = formattedValue;
                    window.xcoreCachedJunk = formattedValue;
                    
                    // Save to cache
                    localStorage.setItem('xcore_total_junk_cleared', formattedValue);
                }
            }
        } catch (error) {
            console.error('Error fetching total junk:', error);
        }
    };

    fetchTotalJunk();

    // Fetch total files cleared
    const fetchTotalFiles = async () => {
        // Load from cache first
        const cachedFiles = localStorage.getItem('xcore_total_files_cleared');
        if (cachedFiles) {
            window.xcoreCachedFiles = cachedFiles;
        } else {
            window.xcoreCachedFiles = '14,203';
        }

        try {
            const url = 'https://script.google.com/macros/s/AKfycbyrao1GQrhzYsO9PE3yzdzgj7T3QbaiT8V06fELWqGFWkIqEqwwqKTbgIT3khlmP0n0/exec?type=total_files';
            const response = await fetch(url);
            
            if (response.ok) {
                const text = await response.text();
                let totalFiles = null;
                try {
                    const data = JSON.parse(text);
                    totalFiles = data.total || data.total_files || data.totalFiles || data.totalObjects || text;
                } catch (e) {
                    totalFiles = text.trim();
                }
                
                if (totalFiles && totalFiles !== 'OK') {
                    // Update cache
                    const numericValue = parseFloat(totalFiles.toString().replace(/,/g, ''));
                    if (!isNaN(numericValue)) {
                        const formattedValue = numericValue.toLocaleString();
                        window.xcoreCachedFiles = formattedValue;
                        localStorage.setItem('xcore_total_files_cleared', formattedValue);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching total files:', error);
        }
    };

    fetchTotalFiles();

    // Intersection Observer for scroll animations (fade in elements)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to cards and sections
    document.querySelectorAll('.feature-card, .process-step, .stat-box, .pricing-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
    });

    // Mockup UI dynamic updates
    const runMockupSimulation = () => {
        const progressEl = document.querySelector('.highlight-blue');
        const objectsEl = document.querySelector('.mockup-card:nth-child(1) .card-value');
        const junkEl = document.querySelector('.highlight-red');
        
        if (!progressEl || !objectsEl || !junkEl) return;
        
        let progress = 0;
        let objects = 0;
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1;
            if (progress > 100) progress = 100;
            
            // Animate objects value from 0 up to target value
            let targetFilesStr = window.xcoreCachedFiles || '14,203';
            let targetFilesNum = parseInt(targetFilesStr.replace(/,/g, '')) || 14203;
            let currentFiles = Math.floor(targetFilesNum * (progress / 100));
            
            // Animate junk value from 0 up to the target value based on progress
            let targetJunkStr = window.xcoreCachedJunk || '5.52 GB';
            let targetJunkNum = parseFloat(targetJunkStr) || 5.52;
            let targetJunkUnit = targetJunkStr.replace(/[0-9.]/g, '').trim() || 'GB';
            
            let currentJunk = (targetJunkNum * (progress / 100)).toFixed(2);
            
            progressEl.textContent = progress + '%';
            objectsEl.textContent = currentFiles.toLocaleString();
            junkEl.textContent = currentJunk + ' ' + targetJunkUnit;
            
            if (progress === 100) {
                clearInterval(interval);
                junkEl.textContent = targetJunkStr;
                objectsEl.textContent = targetFilesStr;
            }
        }, 100);
    };

    // Run simulation once when mockup comes into view
    const mockupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runMockupSimulation();
                mockupObserver.disconnect();
            }
        });
    });

    const mockupEl = document.querySelector('.dashboard-mockup');
    if (mockupEl) {
        mockupObserver.observe(mockupEl);
    }
});
