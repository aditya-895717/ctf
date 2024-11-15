import mongoose from "mongoose";

// Define a model or configuration for test settings
const TestSettingsSchema = new mongoose.Schema({
    isTestEnabled: {
        type: Boolean,
        default: false, // Initially, the test is disabled
    },
    startTime: { type: Date },
    duration: { type: Number, required: true }, // Duration in milliseconds
  });

const TestSettings = mongoose.model('TestSettings', TestSettingsSchema);
export default TestSettings;