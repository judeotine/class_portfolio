(function() {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./Pwa/service-worker.js')
                .then(function(registration) {
                    console.log('Service Worker registered successfully:', registration.scope);

                    setInterval(function() {
                        registration.update();
                    }, 60000);

                    registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        
                        newWorker.addEventListener('statechange', function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('New service worker available');
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                });

            navigator.serviceWorker.addEventListener('controllerchange', function() {
                console.log('Service Worker controller changed');
                // window.location.reload();
            });
        });
    } else {
        console.log('Service Workers are not supported in this browser');
    }

    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--color-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 90%;
        `;
        notification.innerHTML = `
            <span>New version available!</span>
            <button id="sw-update-btn" style="
                background: white;
                color: var(--color-primary);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                cursor: pointer;
                font-weight: 600;
            ">Update</button>
        `;
        document.body.appendChild(notification);

        document.getElementById('sw-update-btn').addEventListener('click', function() {
            window.location.reload();
        });

        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }
})();

