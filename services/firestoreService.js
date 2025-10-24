const { db } = require('../config/firebase');

class FirestoreService {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  // Create a new document
  async create(data, docId = null) {
    try {
      if (docId) {
        await this.collection.doc(docId).set(data);
        return { id: docId, ...data };
      } else {
        const docRef = await this.collection.add(data);
        return { id: docRef.id, ...data };
      }
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Get a document by ID
  async getById(docId) {
    try {
      const doc = await this.collection.doc(docId).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get all documents
  async getAll() {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Query documents
  async query(field, operator, value) {
    try {
      const snapshot = await this.collection.where(field, operator, value).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Update a document
  async update(docId, data) {
    try {
      await this.collection.doc(docId).update(data);
      return { id: docId, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  async delete(docId) {
    try {
      await this.collection.doc(docId).delete();
      return { id: docId, deleted: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Add item to array field
  async arrayAdd(docId, field, value) {
    try {
      const admin = require('firebase-admin');
      await this.collection.doc(docId).update({
        [field]: admin.firestore.FieldValue.arrayUnion(value)
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding to array:', error);
      throw error;
    }
  }

  // Remove item from array field
  async arrayRemove(docId, field, value) {
    try {
      const admin = require('firebase-admin');
      await this.collection.doc(docId).update({
        [field]: admin.firestore.FieldValue.arrayRemove(value)
      });
      return { success: true };
    } catch (error) {
      console.error('Error removing from array:', error);
      throw error;
    }
  }
}

module.exports = FirestoreService;
