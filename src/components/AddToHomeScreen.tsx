import { useEffect, useState } from 'react';
import { Button, Modal, message, notification } from 'antd';
import UAParser from 'ua-parser-js';

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Main component
const AddToHomeScreenBanner: React.FC = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [browserName, setBrowserName] = useState<string>('unknown');

    useEffect(() => {
        const parser = new UAParser();
        const result = parser.getResult();
        setBrowserName(result.browser.name?.toLowerCase() || 'unknown');

        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const triggerInstallPrompt = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choice) => {
                if (choice.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                    displaySuccessNotification();
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
            });
        } else {
            setIsModalVisible(true);
        }
    };

    const displaySuccessNotification = () => {
        notification.success({
            message: 'App Installed!',
            description: 'The app has been successfully installed. You can open it from your home screen.',
            placement: 'top',
            duration: 5,
        });
    };

    return (
        <>
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
