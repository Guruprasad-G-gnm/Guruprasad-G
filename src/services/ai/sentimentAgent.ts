import { SentimentType, AgentSentimentResult } from '../../types';

export class SentimentAgentService {
  public analyzeSentiment(text: string): AgentSentimentResult {
    const lower = text.toLowerCase();

    let sentiment: SentimentType = 'Neutral';
    let urgencyScore = 3;
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    let reason = 'Standard informational inquiry with neutral phrasing.';
    let confidenceScore = 88;

    // Urgent indicators
    const urgentMatches = ['immediate', 'emergency', 'urgent', 'now', 'exam tomorrow', 'starts in 2 hours', 'within 2 hours', 'today itself', 'danger', 'spark'];
    // Angry indicators
    const angryMatches = ['furious', 'ridiculous', 'unacceptable', 'worst', 'pathetic', 'disgusted', 'legal action', 'complaint against'];
    // Frustrated indicators
    const frustratedMatches = ['not solved for', 'three days', 'nobody is responding', 'still pending', 'again and again', 'ignoring', 'delayed', 'repeatedly', 'tired of'];
    // Positive indicators
    const positiveMatches = ['thank you', 'appreciate', 'great help', 'resolved quickly', 'kindly assist', 'grateful'];

    if (urgentMatches.some((w) => lower.includes(w))) {
      sentiment = 'Urgent';
      urgencyScore = 9;
      riskLevel = 'Critical';
      reason = 'Detected high-urgency keywords indicating immediate academic or campus safety impact.';
      confidenceScore = 95;
    } else if (angryMatches.some((w) => lower.includes(w))) {
      sentiment = 'Angry';
      urgencyScore = 8;
      riskLevel = 'High';
      reason = 'Aggressive or dissatisfied language indicating significant escalation risk.';
      confidenceScore = 92;
    } else if (frustratedMatches.some((w) => lower.includes(w))) {
      sentiment = 'Frustrated';
      urgencyScore = 7;
      riskLevel = 'High';
      reason = 'Student mentions unresolved timeframe or lack of responsiveness from campus staff.';
      confidenceScore = 90;
    } else if (positiveMatches.some((w) => lower.includes(w))) {
      sentiment = 'Positive';
      urgencyScore = 2;
      riskLevel = 'Low';
      reason = 'Courteous or appreciative tone with standard request expectations.';
      confidenceScore = 89;
    }

    return {
      sentiment,
      urgencyScore,
      riskLevel,
      reason,
      confidenceScore,
    };
  }
}

export const sentimentAgent = new SentimentAgentService();
