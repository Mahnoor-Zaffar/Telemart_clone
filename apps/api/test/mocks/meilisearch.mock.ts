/** Jest stub — meilisearch is ESM-only and breaks ts-jest in e2e runs. */
export class Meilisearch {
  constructor(_opts: { host: string; apiKey?: string }) {}

  index(_name: string) {
    return {
      updateFilterableAttributes: async () => undefined,
      updateSortableAttributes: async () => undefined,
      addDocuments: async () => undefined,
      deleteDocument: async () => undefined,
      search: async () => ({
        hits: [],
        estimatedTotalHits: 0,
        facetDistribution: {},
      }),
    };
  }
}
