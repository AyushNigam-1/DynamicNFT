import mongoose from 'mongoose';

const studyTimeSchema = new mongoose.Schema({
    // The user's wallet address, which acts as a unique ID.
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    // The total study time in seconds.
    totalStudyTime: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    // Add timestamps to track when a record was created or last updated.
    timestamps: true,
});

// Check if the model has already been defined to prevent re-compilation issues.
const StudyTime = mongoose.models.StudyTime || mongoose.model('StudyTime', studyTimeSchema);

export default StudyTime;
