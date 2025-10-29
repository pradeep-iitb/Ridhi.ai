import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { storage, db } from '../config/firebase.js';
import { summarizeContent, extractInformation } from '../lib/ai.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

/**
 * POST /api/files/upload
 * Upload a file to Firebase Storage and process it
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, category = 'general' } = req.body;
    const file = req.file;
    const fileName = `${userId}/${Date.now()}_${file.originalname}`;
    
    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          userId,
          category,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make file publicly accessible
    await fileUpload.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Extract text if PDF
    let extractedText = '';
    let summary = '';

    if (file.mimetype === 'application/pdf') {
      try {
        const pdfData = await pdfParse(file.buffer);
        extractedText = pdfData.text;
        
        // Generate summary using AI
        const summaryResult = await summarizeContent(extractedText, category);
        summary = summaryResult.text;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
      }
    }

    // Save metadata to Firestore
    const fileDoc = {
      userId,
      fileName: file.originalname,
      fileUrl: publicUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      category,
      extractedText: extractedText.substring(0, 5000), // Store first 5000 chars
      summary,
      uploadedAt: new Date().toISOString()
    };

    const docRef = await db.collection('files').add(fileDoc);

    res.json({
      success: true,
      fileId: docRef.id,
      fileUrl: publicUrl,
      fileName: file.originalname,
      summary: summary || 'No summary available',
      hasText: !!extractedText
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

/**
 * GET /api/files/list/:userId
 * Get all files for a user
 */
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;

    let query = db.collection('files').where('userId', '==', userId);
    
    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.orderBy('uploadedAt', 'desc').get();
    
    const files = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, files });
  } catch (error) {
    console.error('File list error:', error);
    res.status(500).json({ error: 'Failed to fetch files', details: error.message });
  }
});

/**
 * GET /api/files/:fileId
 * Get details of a specific file
 */
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const doc = await db.collection('files').doc(fileId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ success: true, file: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('File fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch file', details: error.message });
  }
});

/**
 * POST /api/files/query
 * Query a file's content with AI
 */
router.post('/query', async (req, res) => {
  try {
    const { fileId, query } = req.body;

    if (!fileId || !query) {
      return res.status(400).json({ error: 'fileId and query are required' });
    }

    const doc = await db.collection('files').doc(fileId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = doc.data();
    
    if (!fileData.extractedText) {
      return res.status(400).json({ error: 'No text content available in this file' });
    }

    // Use AI to answer the query based on file content
    const result = await extractInformation(fileData.extractedText, query);

    res.json({
      success: true,
      answer: result.text,
      fileName: fileData.fileName
    });
  } catch (error) {
    console.error('File query error:', error);
    res.status(500).json({ error: 'Failed to query file', details: error.message });
  }
});

/**
 * DELETE /api/files/:fileId
 * Delete a file
 */
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const doc = await db.collection('files').doc(fileId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = doc.data();
    
    // Delete from Firebase Storage
    const bucket = storage.bucket();
    const fileName = fileData.fileUrl.split('/').pop();
    await bucket.file(`${fileData.userId}/${fileName}`).delete();

    // Delete from Firestore
    await db.collection('files').doc(fileId).delete();

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ error: 'Failed to delete file', details: error.message });
  }
});

export default router;
