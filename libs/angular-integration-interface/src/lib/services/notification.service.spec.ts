import { NotificationService } from './notification.service'
import { NotificationService as NotificationServiceFromIntegrationInterface } from '@onecx/integration-interface'

const createTopic = () => ({})
const createNotificationService = () => ({
	notificationTopic: createTopic(),
	destroy: jest.fn(),
})

jest.mock('@onecx/integration-interface', () => ({
	NotificationService: jest.fn(() => createNotificationService()),
}))

describe('NotificationService', () => {
	let service: NotificationService

	const getIntegrationServiceMock = () => {
		const constructorMock = NotificationServiceFromIntegrationInterface as unknown as jest.Mock
		const results = constructorMock.mock.results
		return results.at(-1)?.value as ReturnType<typeof createNotificationService>
	}

	beforeEach(() => {
		const constructorMock = NotificationServiceFromIntegrationInterface as unknown as jest.Mock
		constructorMock.mockClear()
		service = new NotificationService()
	})

	it('should expose notificationTopic from integration service', () => {
		const integrationService = getIntegrationServiceMock()

		expect(service.notificationTopic).toBe(integrationService.notificationTopic)
	})

	it('should return the same notificationTopic across reads', () => {
		expect(service.notificationTopic).toBe(service.notificationTopic)
	})

	it('should create integration notification service on initialization', () => {
		const constructorMock = NotificationServiceFromIntegrationInterface as unknown as jest.Mock

		expect(constructorMock).toHaveBeenCalledTimes(1)
	})

	it('should destroy integration notification service on destroy', () => {
		const integrationService = getIntegrationServiceMock()

		service.ngOnDestroy()

		expect(integrationService.destroy).toHaveBeenCalledTimes(1)
	})
})
