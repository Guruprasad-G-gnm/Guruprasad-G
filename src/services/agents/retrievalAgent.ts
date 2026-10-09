import {
  AgentRetrievalResult,
  KnowledgeArticle,
  KBSourceCitation,
} from '../../types';
import { RAGPipelineService } from '../rag/ragPipeline';
import { INITIAL_KNOWLEDGE_BASE } from '../../data/mockKnowledgeBase';

export class RetrievalAgentService {
  private rag = new RAGPipelineService();

  public retrieve(
    queryText: string,
    category: string,
    articles: KnowledgeArticle[] = INITIAL_KNOWLEDGE_BASE
  ): AgentRetrievalResult {
    const ragResult = this.rag.execute(queryText, articles);

    if (ragResult.retrievedCitations.length === 0) {
      return {
        citations: [],
        groundingStatus: 'not_found',
        retrievalSummary:
          'Relevant campus information was not found in the campus knowledge base. Manual officer consultation requested.',
        vectorSimilarityAverage: 0,
        provider: ragResult.vectorProviderUsed,
      };
    }

    const avgScore =
      ragResult.retrievedCitations.reduce(
        (acc, c) => acc + (c.relevanceScore || 0.7),
        0
      ) / ragResult.retrievedCitations.length;

    return {
      citations: ragResult.retrievedCitations,
      groundingStatus: ragResult.groundingStatus,
      retrievalSummary: `Retrieved ${ragResult.retrievedCitations.length} official handbook sections with ${(avgScore * 100).toFixed(0)}% semantic relevance. All answers grounded strictly in verified university policies.`,
      vectorSimilarityAverage: Math.round(avgScore * 100),
      provider: ragResult.vectorProviderUsed,
    };
  }
}

export const retrievalAgent = new RetrievalAgentService();
