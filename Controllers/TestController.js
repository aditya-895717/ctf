import TestSettings from "../models/TestControl.model.js";
let testTimeout = null;

export const TestController = async (req, res) => {
    const { isTestEnabled } = req.body;

    try {
        const settings = await TestSettings.findOneAndUpdate(
            {},
            { isTestEnabled, startTime: isTestEnabled ? Date.now() : null }, // Store start time
            { new: true, upsert: true }
        );

        if (isTestEnabled) {
            // Start the timer for 30 minutes (1800000 ms)
            if (testTimeout) {
                clearTimeout(testTimeout); // Clear existing timeout
            }

            testTimeout = setTimeout(async () => {
                try {
                    await TestSettings.findOneAndUpdate(
                        {},
                        { isTestEnabled: false, startTime: null }, // Clear start time and disable test
                        { new: true }
                    );
                    console.log('Test automatically disabled after 30 minutes.');
                } catch (err) {
                    console.error('Error auto-disabling the test:', err);
                }
            }, 1800000); // 30 minutes in milliseconds
        } else {
            // If the test is disabled manually, clear the timeout
            if (testTimeout) {
                clearTimeout(testTimeout);
                testTimeout = null;
            }
        }

        res.json({ success: true, settings });
    } catch (err) {
        console.error('Error updating test status:', err);
        res.status(403).json({ success: false, message: "Unauthorized: " + err });
    }
};

// Endpoint to get remaining time
export const GetRemainingTime = async (req, res) => {
    try {
        const settings = await TestSettings.findOne();

        if (!settings || !settings.isTestEnabled) {
            return res.json({ remainingTime: 0 }); // Test not enabled
        }

        const currentTime = Date.now();
        const elapsedTime = currentTime - new Date(settings.startTime).getTime();
        const duration = 30 * 60 * 1000; // Duration in milliseconds (30 minutes)
        const remainingTime = Math.max(0, duration - elapsedTime); // Calculate remaining time

        res.json({ remainingTime });
    } catch (error) {
        console.error('Error fetching remaining time:', error);
        res.status(500).json({ error: 'Error fetching remaining time' });
    }
};

// Route to get the test status (for the frontend)
export const checkTestSettings = async(req,res)=>{
    TestSettings.findOne({})
        .then((settings) => {
            if (settings) {
                res.json({ isTestEnabled: settings.isTestEnabled });
            } else {
                res.json({ isTestEnabled: false });
            }
        })
        .catch((error) => res.status(500).json({ success: false, error }));
};

