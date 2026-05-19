export interface Notification {
  type: string,
  address: string,
  headers: { [key: string]: string }
  body: {
    id: string,
    applicationId: string,
    senderId: string,
    receiverId: string,
    persist: boolean,
    creationData: Date,
    contentMeta: [{
      key: string,
      value: string
    }]
  }
}