import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { SupportTicket } from '../model/support-ticket'
import { CreateIssueRequest } from '../model/create-issue-request'

@Injectable({
  providedIn: 'root',
})
export class SupportTicketApiService {
  private baseUrl = './portal-api/v1/supportTicket/send'

  constructor(private http: HttpClient) {}

  createSupportTicket(ticket: SupportTicket, appId: string | undefined) {
    const request: CreateIssueRequest = {
      processId: ticket.title,
      processStep: ticket.description,
      source: appId,
      sourceDeepLink: window.location.href,
    }

    return this.http.post(this.baseUrl, request)
  }
}
