import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { CreateIssueRequest } from '../model/create-issue-request'
import { SupportTicket } from '../model/support-ticket'

@Injectable({
  providedIn: 'root',
})
export class SupportTicketApiService {
  private http = inject(HttpClient)

  private baseUrl = './portal-api/v1/supportTicket/send'

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
