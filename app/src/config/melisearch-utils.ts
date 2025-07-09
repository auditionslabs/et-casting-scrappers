import indexConfig from './melisearch-index-config.json';

export interface MeilisearchIndexConfig {
  index: {
    uid: string;
    primaryKey: string;
  };
  settings: {
    searchableAttributes: string[];
    filterableAttributes: string[];
    sortableAttributes: string[];
    rankingRules: string[];
    pagination: {
      maxTotalHits: number;
    };
    distinctAttribute: string | null;
    typoTolerance: {
      enabled: boolean;
      minWordSizeForTypos: {
        oneTypo: number;
        twoTypos: number;
      };
      disableOnWords: string[];
      disableOnAttributes: string[];
    };
    faceting: {
      maxValuesPerFacet: number;
    };
  };
  documentSchema: any;
  exampleDocument: any;
}

// Export the configuration
export const meilisearchConfig: MeilisearchIndexConfig = indexConfig;

// Helper function to create index using the configuration
export async function createMeilisearchIndex(meilisearchUrl: string, masterKey: string) {
  try {
    // Create the index
    const createResponse = await fetch(`${meilisearchUrl}/indexes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify({
        uid: meilisearchConfig.index.uid,
        primaryKey: meilisearchConfig.index.primaryKey
      })
    });

    if (!createResponse.ok && createResponse.status !== 409) {
      throw new Error(`Failed to create index: ${createResponse.statusText}`);
    }

    // Update searchable attributes
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/searchable-attributes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.searchableAttributes)
    });

    // Update filterable attributes
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/filterable-attributes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.filterableAttributes)
    });

    // Update sortable attributes
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/sortable-attributes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.sortableAttributes)
    });

    // Update ranking rules
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/ranking-rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.rankingRules)
    });

    // Update pagination settings
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/pagination`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.pagination)
    });

    // Update typo tolerance
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/typo-tolerance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.typoTolerance)
    });

    // Update faceting settings
    await fetch(`${meilisearchUrl}/indexes/${meilisearchConfig.index.uid}/settings/faceting`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
      },
      body: JSON.stringify(meilisearchConfig.settings.faceting)
    });

    console.log(`✅ Meilisearch index '${meilisearchConfig.index.uid}' configured successfully`);
    return true;
  } catch (error) {
    console.error('❌ Error creating Meilisearch index:', error);
    throw error;
  }
}

// Helper function to validate document against schema
export function validateDocument(document: any): boolean {
  const required = meilisearchConfig.documentSchema.required;
  
  for (const field of required) {
    if (document[field] === undefined || document[field] === null) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  return true;
}

// Helper function to get index settings
export function getIndexSettings() {
  return meilisearchConfig.settings;
}

// Helper function to get document schema
export function getDocumentSchema() {
  return meilisearchConfig.documentSchema;
}

// Helper function to get example document
export function getExampleDocument() {
  return meilisearchConfig.exampleDocument;
} 