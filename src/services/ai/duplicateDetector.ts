import { Ticket, DuplicateDetectionResult } from '../../types';
import { vectorStore } from '../vector/vectorStore';

export class DuplicateDetectorService {
  /**
   * Compares a candidate ticket against active campus tickets for semantic duplication
   */
  public detectDuplicates(
    title: string,
    description: string,
    location: string,
    category: string,
    existingTickets: Ticket[]
  ): DuplicateDetectionResult {
    const candidateText = `${title} ${description} ${location} ${category}`.toLowerCase();
    const candidateVec = vectorStore.generateEmbedding(candidateText);

    let highestScore = 0;
    let matchedTicket: Ticket | null = null;

    for (const t of existingTickets) {
      if (t.status === 'Resolved' || t.status === 'Closed') continue;

      const existingText = `${t.title} ${t.description} ${t.location} ${t.category}`.toLowerCase();
      const existingVec = vectorStore.generateEmbedding(existingText);

      // Semantic cosine similarity
      let sim = vectorStore.computeCosineSimilarity(candidateVec, existingVec);

      // Boost if same location and same category
      if (location && t.location && (location.toLowerCase().includes(t.location.toLowerCase()) || t.location.toLowerCase().includes(location.toLowerCase()))) {
        sim += 0.15;
      }
      if (category === t.category) {
        sim += 0.1;
      }

      // Check key common nouns
      const keywords = ['wifi', 'wi-fi', 'internet', 'bus', 'route 14', 'fan', 'hall ticket', 'admit card', 'light', 'water'];
      const sharedCount = keywords.filter((kw) => candidateText.includes(kw) && existingText.includes(kw)).length;
      if (sharedCount > 0) {
        sim += sharedCount * 0.08;
      }

      sim = Math.min(0.99, sim);

      if (sim > highestScore) {
        highestScore = sim;
        matchedTicket = t;
      }
    }

    const similarityPercentage = Math.round(highestScore * 100);

    if (similarityPercentage >= 70 && matchedTicket) {
      return {
        isDuplicate: true,
        similarityScore: similarityPercentage,
        duplicateTicketId: matchedTicket.id,
        duplicateTicketTitle: matchedTicket.title,
        reason: `High semantic alignment (${similarityPercentage}%) with active ticket ${matchedTicket.id} in ${matchedTicket.location}. Both report ${matchedTicket.category} anomalies.`,
        actionRecommendation: similarityPercentage >= 85 ? 'Link to Existing Ticket' : 'View Related Ticket',
      };
    }

    return {
      isDuplicate: false,
      similarityScore: similarityPercentage,
      reason: 'No statistically significant overlap with currently open tickets.',
      actionRecommendation: 'Create New Ticket',
    };
  }
}

export const duplicateDetector = new DuplicateDetectorService();
