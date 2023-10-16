import { rest } from 'msw'
import { mockMenu } from './mockMenu'

export const mockedGetMenu = rest.get('/portal-api/v1/portals/undefined/menu', (_, response, context) => {
  return response(context.json(mockMenu))
})
