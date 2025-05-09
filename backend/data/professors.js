// routes/professors.js
import express from 'express';
import { universities, professors } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/byUniversity/:universityId', async (req, res) => {
    const { universityId } = req.params;
    console.log('Received request for university ID:', universityId);

    if (!ObjectId.isValid(universityId)) {
      console.error('Invalid ObjectId');
      return res.status(400).json({ error: 'Invalid university ID' });
    }

    try {
      const universityCollection = await universities();
      const professorCollection = await professors();

      const university = await universityCollection.findOne({ _id: new ObjectId(universityId) });

      if (!university) {
        console.error('University not found');
        return res.status(404).json({ error: 'University not found' });
      }

      const professorIds = university.professors || [];

      const profDocs = await professorCollection
        .find({ _id: { $in: professorIds.map(id => new ObjectId(id)) } })
        .toArray();

      return res.json(profDocs);
    } catch (e) {
      console.error('Error in /byUniversity/:universityId route:', e);
      return res.status(500).json({ error: e.message });
    }
  });

  router.post('/:id/review', async (req, res) => {
    const professorId = req.params.id;
    const { reviewerName, comment, score } = req.body;
  
    if (!reviewerName || !comment || typeof score !== 'number') {
      return res.status(400).json({ error: "Invalid review input" });
    }
  
    try {
      const result = await professorsCollection.updateOne(
        { _id: new ObjectId(professorId) },
        { $push: { reviews: { reviewerName, comment, score } } }
      );
      if (result.modifiedCount === 0) throw "Review not added";
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  });

export default router;