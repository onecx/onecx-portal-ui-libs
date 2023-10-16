export interface CreateIssueRequest {
  source?: string
  processId: string
  processStep: string
  sourceDeepLink: string
}

export enum IssueType {
  OTHER = 'OTHER',
}
