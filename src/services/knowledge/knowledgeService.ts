import { KnowledgeArticle, KBSourceCitation } from '../../types';
import { INITIAL_KNOWLEDGE_BASE } from '../../data/mockKnowledgeBase';
import { vectorStore } from '../vector/vectorStore';

export class KnowledgeService {
  private articles: KnowledgeArticle[] = [...INITIAL_KNOWLEDGE_BASE];

  public getAll(): KnowledgeArticle[] {
    return this.articles;
  }

  public getById(id: string): KnowledgeArticle | undefined {
    return this.articles.find((a) => a.id === id);
  }

  public add(article: KnowledgeArticle): void {
    this.articles.unshift(article);
    const corpus = `${article.title} ${article.summary} ${article.content} ${article.tags.join(' ')}`;
    vectorStore.upsert(article.id, corpus, { article });
  }

  public update(id: string, updated: Partial<KnowledgeArticle>): void {
    const idx = this.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.articles[idx] = { ...this.articles[idx], ...updated, lastUpdated: new Date().toISOString() };
      const art = this.articles[idx];
      const corpus = `${art.title} ${art.summary} ${art.content} ${art.tags.join(' ')}`;
      vectorStore.upsert(art.id, corpus, { article: art });
    }
  }

  public delete(id: string): void {
    this.articles = this.articles.filter((a) => a.id !== id);
  }

  public generateCitations(articleIds: string[]): KBSourceCitation[] {
    return articleIds
      .map((id) => this.getById(id))
      .filter((a): a is KnowledgeArticle => Boolean(a))
      .map((a) => ({
        id: a.id,
        title: a.title,
        section: a.sourceReference,
        summary: a.summary,
        department: a.department,
        lastUpdated: a.lastUpdated,
        urlRef: a.contactDesk,
        relevanceScore: 0.95,
      }));
  }
}

export const knowledgeService = new KnowledgeService();
