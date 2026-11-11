const pool = require('../config/db');
const { analyzeCaseData } = require('../services/aiService');

// Create a new consumer case
const createCase = async (req, res) => {
    try {
        const { title, issue_category, merchant_name, claimed_amount, user_narrative } = req.body;
        const userId = req.user ? req.user.id : 'demo-user-123'; // Fallback for dev testing
        const caseNumber = `GRH-${Date.now().toString().slice(-6)}`;

        // Trigger AI analysis pipeline asynchronously
        const aiAnalysis = await analyzeCaseData(caseNumber, user_narrative || title);

        res.status(201).json({
            success: true,
            message: "Case created successfully",
            data: {
                case_number: caseNumber,
                title,
                issue_category,
                merchant_name,
                claimed_amount,
                ai_intelligence: aiAnalysis
            }
        });
    } catch (error) {
        console.error("Create Case Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { createCase };