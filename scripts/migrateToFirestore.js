const { readJSON } = require('../utils/fileHandler');
const FirestoreService = require('../services/firestoreService');

async function migrateData() {
  try {
    console.log('Starting data migration to Firestore...\n');

    // Initialize Firestore services
    const heritageService = new FirestoreService('heritage');
    const craftsService = new FirestoreService('crafts');
    const marketplaceService = new FirestoreService('marketplace');

    // Migrate Heritage Data
    console.log('Migrating heritage data...');
    const heritage = await readJSON('heritage.json');
    for (const site of heritage) {
      await heritageService.create(site, site.id?.toString());
      console.log(`  ✓ Migrated: ${site.name}`);
    }
    console.log(`✅ Heritage data migrated: ${heritage.length} sites\n`);

    // Migrate Crafts Data
    console.log('Migrating crafts data...');
    const crafts = await readJSON('crafts.json');
    for (const craft of crafts) {
      await craftsService.create(craft, craft.id?.toString());
      console.log(`  ✓ Migrated: ${craft.name}`);
    }
    console.log(`✅ Crafts data migrated: ${crafts.length} crafts\n`);

    // Migrate Marketplace Data
    console.log('Migrating marketplace data...');
    const marketplace = await readJSON('marketplace.json');
    for (const item of marketplace) {
      await marketplaceService.create(item, item.id?.toString());
      console.log(`  ✓ Migrated: ${item.name}`);
    }
    console.log(`✅ Marketplace data migrated: ${marketplace.length} items\n`);

    console.log('🎉 Data migration completed successfully!');
    console.log('\nNote: User data will be migrated automatically as users register/login.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
