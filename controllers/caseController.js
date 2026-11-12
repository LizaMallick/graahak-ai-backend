const pool = require('../config/db');
const { analyzeCaseData } = require('../services/aiService');

exports.createCase = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { title, issue_category, merchant_name, claimed_amount, user_narrative } = req.body;

    if (!title || !user_narrative) {
      return res.status(400).json({
        success: false,
        message: 'Title and user narrative are required fields.'
      });
    }

    const files = req.files || [];
    const caseNumber = `GRH-${Math.floor(100000 + Math.random() * 900000)}`;

    // First insert the case to get the database-assigned ID
    await connection.beginTransaction();

    const [caseInsertResult] = await connection.execute(
      `INSERT INTO cases (case_number, title, issue_category, merchant_name, claimed_amount, user_narrative, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        caseNumber,
        title,
        issue_category || 'GENERAL',
        merchant_name || 'N/A',
        parseFloat(claimed_amount) || 0.00,
        user_narrative,
        'PENDING'
      ]
    );

    const insertedCaseId = caseInsertResult.insertId;

    // Save evidence files if any are attached
    for (const file of files) {
      await connection.execute(
        `INSERT INTO evidence_files (case_id, original_name, filename, file_path, mimetype, file_size)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [insertedCaseId, file.originalname, file.filename, file.path, file.mimetype, file.size]
      );
    }

    // Call the AI microservice using the newly generated case ID
    const aiResult = await analyzeCaseData(insertedCaseId, user_narrative, files.map(f => f.originalname));

    // Update case with AI intelligence results
    await connection.execute(
      `UPDATE cases SET ai_summary = ?, legal_rights = ?, recommended_action = ?, status = ? WHERE id = ?`,
      [
        aiResult.status || 'ANALYZED',
        JSON.stringify(aiResult.rag_citations || []),
        JSON.stringify(aiResult.timeline || []),
        'ANALYZED',
        insertedCaseId
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Case created and analyzed successfully',
      data: {
        id: insertedCaseId,
        case_number: caseNumber,
        title,
        ai_intelligence: aiResult,
        files_attached: files.length
      }
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error in createCase controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create case',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};