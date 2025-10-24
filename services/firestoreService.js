const { db, isFirestoreAvailable } = require('../config/firebase');
const { readJSON, writeJSON } = require('../utils/fileHandler');

class FirestoreService {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.jsonFileName = `${collectionName}.json`;
    
    // Only initialize Firestore collection if available
    if (isFirestoreAvailable && db) {
      this.collection = db.collection(collectionName);
      this.useFirestore = true;
    } else {
      this.useFirestore = false;
    }
  }

  // Create a new document
  async create(data, docId = null) {
    try {
      if (this.useFirestore) {
        if (docId) {
          await this.collection.doc(docId).set(data);
          return { id: docId, ...data };
        } else {
          const docRef = await this.collection.add(data);
          return { id: docRef.id, ...data };
        }
      } else {
        // Fall back to JSON file
        const items = await readJSON(this.jsonFileName);
        const newItem = {
          id: docId || (items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1),
          ...data
        };
        items.push(newItem);
        await writeJSON(this.jsonFileName, items);
        return newItem;
      }
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Get a document by ID
  async getById(docId) {
    try {
      if (this.useFirestore) {
        const doc = await this.collection.doc(docId).get();
        if (!doc.exists) {
          return null;
        }
        return { id: doc.id, ...doc.data() };
      } else {
        // Fall back to JSON file
        const items = await readJSON(this.jsonFileName);
        return items.find(item => item.id == docId) || null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get all documents
  async getAll() {
    try {
      if (this.useFirestore) {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        // Fall back to JSON file
        return await readJSON(this.jsonFileName);
      }
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Query documents
  async query(field, operator, value) {
    try {
      if (this.useFirestore) {
        const snapshot = await this.collection.where(field, operator, value).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        // Fall back to JSON file with simple filtering
        const items = await readJSON(this.jsonFileName);
        return items.filter(item => {
          if (operator === '==') return item[field] === value;
          if (operator === '!=') return item[field] !== value;
          if (operator === '>') return item[field] > value;
          if (operator === '<') return item[field] < value;
          if (operator === '>=') return item[field] >= value;
          if (operator === '<=') return item[field] <= value;
          return false;
        });
      }
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Update a document
  async update(docId, data) {
    try {
      if (this.useFirestore) {
        await this.collection.doc(docId).update(data);
        return { id: docId, ...data };
      } else {
        // Fall back to JSON file
        const items = await readJSON(this.jsonFileName);
        const index = items.findIndex(item => item.id == docId);
        if (index !== -1) {
          items[index] = { ...items[index], ...data };
          await writeJSON(this.jsonFileName, items);
          return items[index];
        }
        return null;
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  async delete(docId) {
    try {
      if (this.useFirestore) {
        await this.collection.doc(docId).delete();
        return { id: docId, deleted: true };
      } else {
        // Fall back to JSON file
        const items = await readJSON(this.jsonFileName);
        const filtered = items.filter(item => item.id != docId);
        await writeJSON(this.jsonFileName, filtered);
        return { id: docId, deleted: true };
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Add item to array field
  async arrayAdd(docId, field, value) {
    try {
      if (this.useFirestore) {
        const admin = require('firebase-admin');
        await this.collection.doc(docId).update({
          [field]: admin.firestore.FieldValue.arrayUnion(value)
        });
        return { success: true };
      } else {
        // Fall back to JSON file
        const items = await readJSON(this.jsonFileName);
        const index = items.findIndex(item => item.id == docId);
        if (index !== -1) {
          if (!items[index][field]) {
            items[index][field] = [];
          }
          if (!items[index][field].includes(value)) {
            items[index][field].push(value);
          }
          await writeJSON(this.jsonFileName, items);
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to array:', error);
      throw error;
    }
  }

  // Remove item from array field
  async arrayRemove(docId, field, value) {
    try {
      if (this.useFirestore) {
        const admin = require('firebase-admin');
        await this.collection.doc(docId).update({
          [field]: admin.firestore.FieldValue.arrayRemove(value)
        });
        return { success: true };
      } else {
        // Fall back to JSON file
        const items = await readJSON(this.jsonFileName);
        const index = items.findIndex(item => item.id == docId);
        if (index !== -1 && items[index][field]) {
          items[index][field] = items[index][field].filter(item => item !== value);
          await writeJSON(this.jsonFileName, items);
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from array:', error);
      throw error;
    }
  }
}

module.exports = FirestoreService;
