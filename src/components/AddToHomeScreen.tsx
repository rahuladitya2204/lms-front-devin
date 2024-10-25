
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Modal } from 'antd';
import UAParser from 'ua-parser-js';

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Emotion-styled banner
const Banner = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1890ff;
  color: white;
  text-align: center;
  padding: 10px;
  z-index: 1000;
`;

// Main component
const AddToHomeScreenBanner: React.FC = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isBannerVisible, setIsBannerVisible] = useState(true); // Controls banner visibility
    const [isModalVisible, setIsModalVisible] = useState(false); // Controls modal visibility
    const [browserName, setBrowserName] = useState<string>('unknown'); // Stores detected browser

    useEffect(() => {
        const parser = new UAParser(); // Detect browser
        const result = parser.getResult();
        setBrowserName(result.browser.name?.toLowerCase() || 'unknown');

        // Listen for the 'beforeinstallprompt' event
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault(); // Prevent automatic native prompt
            setInstallPrompt(e); // Store the event to trigger it later
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Trigger the native install prompt on button click
    const triggerInstallPrompt = () => {
        if (installPrompt) {
            installPrompt.prompt(); // Trigger native prompt
            installPrompt.userChoice.then((choice) => {
                if (choice.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                setIsBannerVisible(false); // Hide the banner after interaction
            });
        }
    };

    return (
        <>
            {/* Banner at the bottom of the screen */}
            {isBannerVisible && (
                <Banner>
                    <p>Install our app for a better experience!</p>
                    <Button type="primary" onClick={triggerInstallPrompt}>
                        Install
                    </Button>
                </Banner>
            )}

            {/* Modal with additional instructions */}
            <Modal
                title="Add to Home Screen"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="install" type="primary" onClick={triggerInstallPrompt}>
                        Install App
                    </Button>,
                ]}
            >
                <p>
                    {browserName === 'safari'
                        ? 'Tap the Share button and select "Add to Home Screen".'
                        : `Click the browser's menu and select "Install App".`}
                </p>
            </Modal>
        </>
    );
};

export default AddToHomeScreenBanner;
