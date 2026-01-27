import { Topic, TopicPublisher } from '@onecx/accelerator'

type ParameterValue = boolean | number | string | object

export interface Parameters {
  [key: string]: ParameterValue
}

export interface ApplicationParameters {
  productName: string
  appId: string
  parameters: Parameters
}

export interface ParametersTopicPayload {
  parameters: ApplicationParameters[]
}

export class ParametersTopic extends Topic<ParametersTopicPayload> {
  constructor() {
    super('parameters', 1)
  }
}
