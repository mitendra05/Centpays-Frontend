import React, { useEffect } from 'react';

function Test() {
    useEffect(() => {
        // Handle popstate event
        const handlePopState = () => {
            // Check if the user is navigating to another route within your React app
            if (window.location.pathname !== '/acquirertestingenv') {
                // If not navigating within your app, navigate to the external URL
                window.location.href = '/acquirertestingenv';
            }
        };

        // Add event listener for popstate when component mounts
        window.addEventListener('popstate', handlePopState);

        // Handle hashchange event
        const handleHashChange = () => {
            // Set location hash to "noBack"
            window.location.hash = "noBack";
        };

        // Add event listener for hashchange
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup: Remove event listeners when component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div>
            <h1>Test Page</h1>
            <p>This is a test page.</p>
            <p>Clicking the browser's back or forward button will navigate you to /acquirertestingenv.</p>
        </div>
    );
}

export default Test;
