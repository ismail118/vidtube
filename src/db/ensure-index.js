import { userCollectionName, userIndexSpecs } from '../models/user-models.js'
import db from './index.js'

async function ensureIndexs(collectionName, indexSpecs) {
    try {
        const collection = db.collection(collectionName)
        const existingIndexs = await collection.indexes()
        const existingIndexNames = existingIndexs.map(index => index.name)

        for (const indexSpec of indexSpecs) {
            const indexName = Object.keys(indexSpec.key).join('_')

            if (!existingIndexNames.includes(indexName)) {
                try {
                    await collection.createIndex(indexSpec.key, indexSpec.options)
                    console.log(`index created: ${indexName} on ${collectionName}`);
                    
                } catch (err) {
                    console.log(`Error creating index: ${indexName} on ${collectionName}`);
                }
            }
        }
    } catch (err) {
        console.log(`Error ensuring indexs: ${err}`);
    }
}

async function runEnsureIndexs() {
    const dataIndexs = [
        {
            collectionName: userCollectionName,
            indexSpecs: userIndexSpecs
        },
        // add here...
    ]

    for (const index of dataIndexs) {
        ensureIndexs(index.collectionName, index.indexSpecs)
    }
}