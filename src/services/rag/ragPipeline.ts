import { KnowledgeArticle, KBSourceCitation } from '../../types';
import { INITIAL_KNOWLEDGE_BASE } from '../../data/mockKnowledgeBase';
import { vectorStore } from '../vector/vectorStore';

export interface RAGPipelineResult {
  query: string;
  understoodIntent: string;
  retrievedCitations: KBSourceCitation[];
  groundedContext: string;
  aiGroundedAnswer: string;
  relevanceConfidence: number; // 0 - 100
  groundingStatus: 'found' | 'not_found' | 'partial';
  vectorProviderUsed: string;
}

export class RAGPipelineService {
  private isInitialized = false;

  constructor() {
    this.initializeVectorIndex();
  }

  /**
   * Indexes all campus knowledge base articles into the vector store
   */
  public initializeVectorIndex(articles: KnowledgeArticle[] = INITIAL_KNOWLEDGE_BASE) {
    articles.forEach((art) => {
      const textCorpus = `${art.title} ${art.summary} ${art.content} ${art.category} ${art.tags.join(' ')}`;
      vectorStore.upsert(art.id, textCorpus, {
        articleId: art.id,
        title: art.title,
        department: art.department,
        category: art.category,
        sourceReference: art.sourceReference,
        lastUpdated: art.lastUpdated,
        contactDesk: art.contactDesk,
        summary: art.summary,
      });
    });
    this.isInitialized = true;
  }

  /**
   * Step 1: Query Understanding
   */
  public understandQuery(query: string): { intent: string; expandedTerms: string[]; targetCategory?: string } {
    const q = query.toLowerCase();
    const expandedTerms: string[] = [q];

    let intent = 'General Campus Inquiry';
    let targetCategory: string | undefined = undefined;

    if (q.includes('wi-fi') || q.includes('wifi') || q.includes('internet') || q.includes('eduroam') || q.includes('netauth')) {
      intent = 'Network Connectivity & Access Point Troubleshooting';
      targetCategory = 'IT / Wi-Fi';
      expandedTerms.push('campus-secure', 'poe switch', 'mac address', 'tech tower');
    } else if (q.includes('hostel') || q.includes('room') || q.includes('fan') || q.includes('warden') || q.includes('plumbing')) {
      intent = 'Hostel Residential Maintenance & Amenity Resolution';
      targetCategory = 'Hostel';
      expandedTerms.push('electrician', 'hostel block', 'maintenance roster', 'regulator');
    } else if (q.includes('bus') || q.includes('transport') || q.includes('route') || q.includes('pickup') || q.includes('pass')) {
      intent = 'Transport Fleet Timetable & Route Operations';
      targetCategory = 'Transport';
      expandedTerms.push('gate 3', 'morning inbound', 'depot', 'gps telemetry');
    } else if (q.includes('fee') || q.includes('payment') || q.includes('receipt') || q.includes('refund') || q.includes('scholarship')) {
      intent = 'Bursar Financial Settlement & Payment Verification';
      targetCategory = 'Fees & Finance';
      expandedTerms.push('utr number', 'bank reconciliation', 'admin block', 'student accounts');
    } else if (q.includes('exam') || q.includes('hall ticket') || q.includes('admit card') || q.includes('attendance')) {
      intent = 'Examination Cell Admit Card & Eligibility Clearance';
      targetCategory = 'Examination';
      expandedTerms.push('controller of examinations', 'block a-102', 'provisional admit card');
    } else if (q.includes('security') || q.includes('safety') || q.includes('emergency') || q.includes('dark') || q.includes('patrol')) {
      intent = 'Emergency Campus Safety & Security Dispatch';
      targetCategory = 'Security';
      expandedTerms.push('ext 9999', 'gate 1', 'patrol unit', 'night escort');
    } else if (q.includes('id card') || q.includes('smart card') || q.includes('lost id')) {
      intent = 'Student Services Identity Credential Reissuance';
      targetCategory = 'Other';
      expandedTerms.push('room b-12', 'temporary pass', 'rfid replacement');
    }

    return { intent, expandedTerms, targetCategory };
  }

  /**
   * Full RAG Execution:
   * Query → Query Understanding → Document Retrieval → Relevance Ranking → Context Generation → AI Response
   */
  public execute(query: string, articles: KnowledgeArticle[] = INITIAL_KNOWLEDGE_BASE): RAGPipelineResult {
    if (!this.isInitialized) {
      this.initializeVectorIndex(articles);
    }

    const { intent, expandedTerms } = this.understandQuery(query);
    const enrichedQuery = `${query} ${expandedTerms.join(' ')}`;

    // Document Retrieval via Vector Store
    const vectorResults = vectorStore.search(enrichedQuery, 3, 0.22);

    const retrievedCitations: KBSourceCitation[] = [];
    let cumulativeScore = 0;

    vectorResults.forEach((res) => {
      const art = articles.find((a) => a.id === res.id);
      if (art) {
        retrievedCitations.push({
          id: art.id,
          title: art.title,
          section: art.sourceReference,
          summary: art.summary,
          department: art.department,
          lastUpdated: art.lastUpdated,
          urlRef: art.contactDesk,
          relevanceScore: res.similarityPercentage,
        });
        cumulativeScore += res.similarityPercentage;
      }
    });

    const averageConfidence = retrievedCitations.length > 0
      ? Math.round(cumulativeScore / retrievedCitations.length)
      : 0;

    // Strict Guardrail Check: Never invent info when confidence is low or none found
    if (retrievedCitations.length === 0 || averageConfidence < 28) {
      return {
        query,
        understoodIntent: intent,
        retrievedCitations: [],
        groundedContext: 'No matching campus documents passed relevance threshold.',
        aiGroundedAnswer:
          'Relevant campus information was not found. Please contact the appropriate department.',
        relevanceConfidence: 0,
        groundingStatus: 'not_found',
        vectorProviderUsed: vectorStore.getActiveProvider(),
      };
    }

    // Context Generation
    const primaryDoc = retrievedCitations[0];
    const matchingArt = articles.find((a) => a.id === primaryDoc.id);

    const groundedContext = `Source: [${primaryDoc.id}] ${primaryDoc.title}\nDepartment: ${primaryDoc.department}\nSection: ${primaryDoc.section}\nLast Updated: ${primaryDoc.lastUpdated}\n\nExcerpts:\n${matchingArt?.content.slice(0, 450)}...`;

    // Response Generation (Synthesizing answer strictly using retrieved text)
    const aiGroundedAnswer = `According to verified university records (${primaryDoc.section}):\n\n${primaryDoc.summary}\n\nFor official resolution, contact ${primaryDoc.urlRef}.`;

    return {
      query,
      understoodIntent: intent,
      retrievedCitations,
      groundedContext,
      aiGroundedAnswer,
      relevanceConfidence: averageConfidence,
      groundingStatus: retrievedCitations.length >= 2 ? 'found' : 'partial',
      vectorProviderUsed: vectorStore.getActiveProvider(),
    };
  }
}

export const ragPipeline = new RAGPipelineService();
