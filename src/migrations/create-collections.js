import {commentCollectionName} from '../models/comment-models.js'
import {likeCollectionName} from '../models/like-models.js'
import {playlistCollectionName} from '../models/playlist-models.js'
import {subscriptionCollectionName} from '../models/subscription-models.js'
import {tweetCollectionName} from '../models/tweet-models.js'
import {userCollectionName, userIndexSpecs} from '../models/user-models.js'
import {videoColletionName} from '../models/video-models.js'

async function up(db, client) {
    // add database here
    const collections = [commentCollectionName, likeCollectionName, playlistCollectionName, subscriptionCollectionName, tweetCollectionName, userCollectionName, videoColletionName]
    for (const collection of collections) {
        try {
            await db.createCollection(collection)
        } catch (err) {
            console.log(`Error create collection: ${collection} error: ${err}`);
        }
    }

    // add indexs here
    const indexSpecs = [...userIndexSpecs]
    
    try {
        for (const indexSpec of indexSpecs) {
            const collection = db.collection(indexSpec.collectionName)
            const keys = Object.keys(indexSpec.key)
            const indexName = `${keys[0]}_${indexSpec.key[keys[0]]}`
            console.log("Index name:", indexName);
            
            try {
                await collection.createIndex(indexSpec.key, indexSpec.options)
                console.log(`index created on ${indexSpec.collectionName}`);
                
            } catch (err) {
                console.log(`Error creating index on ${indexSpec.collectionName}`);
            }
        }
    } catch (err) {
        console.log(`Error ensuring indexs: ${err}`);
    }
}

export {up}