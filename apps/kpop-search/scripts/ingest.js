const { ApiV2, streamQueryV2 } = require('@vectara/stream-query-client');
const sampleData = require('../src/data/sample-data.json');

const CUSTOMER_ID = "2213776567";
const CORPUS_ID = "5";
const API_KEY = "zwt_g_OMt8XL9zt7g7lNo5D1Grvff9Llg9kL8127";

async function ingestArticle(client, article) {
  const metadata = {
    ...article.metadata,
    title: article.title,
    url: article.url
  };

  await client.upload({
    customerId: CUSTOMER_ID,
    corpusId: CORPUS_ID,
    document: {
      documentId: `article-${Buffer.from(article.url).toString('base64')}`,
      title: article.title,
      metadata,
      section: [{ text: article.content }]
    }
  });
}

async function ingestSocialMedia(client, post) {
  const metadata = {
    type: 'social_media',
    platform: post.platform,
    username: post.username,
    url: post.url,
    timestamp: post.timestamp
  };

  await client.upload({
    customerId: CUSTOMER_ID,
    corpusId: CORPUS_ID,
    document: {
      documentId: `social-${Buffer.from(post.url).toString('base64')}`,
      title: `${post.platform} post by ${post.username}`,
      metadata,
      section: [{ text: post.content }]
    }
  });
}

async function ingestData() {
  const streamQueryConfig = {
    apiKey: API_KEY,
    customerId: CUSTOMER_ID,
    corpusKey: CORPUS_ID,
    query: "test"
  };
  
  const onStreamEvent = (event) => {
    console.log('Stream event:', event);
  };

  await streamQueryV2({ streamQueryConfig, onStreamEvent });

  for (const article of sampleData.articles) {
    await ingestArticle(client, article);
  }

  for (const post of sampleData.social_media) {
    await ingestSocialMedia(client, post);
  }
}

ingestData().catch(console.error);
