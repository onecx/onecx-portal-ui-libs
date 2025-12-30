import { TestBed, fakeAsync } from '@angular/core/testing'
import { AngularAcceleratorModule } from '@onecx/angular-accelerator'
import { provideTranslateTestingService } from '@onecx/angular-accelerator/testing'
import { Message } from '@onecx/integration-interface'
import { PortalMessageService } from './portal-message.service'
import { FakeTopic } from '@onecx/accelerator'

describe('PortalMessageService', () => {
  let portalMessageService: PortalMessageService
  let message: Message

  const translations = {
    unit: {
      test: {
        message: 'Hello {{username}}',
      },
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [AngularAcceleratorModule],
      providers: [
        PortalMessageService,
        provideTranslateTestingService({
          en: translations,
        }),
      ],
    }).compileComponents()
    portalMessageService = TestBed.inject(PortalMessageService)
    portalMessageService.message$ = new FakeTopic<Message>() as unknown as MessageTopic
  })

  afterEach(() => {
    message = {}
    portalMessageService.message$.destroy()
  })

  describe('success', () => {
    it('with summary adds correct data', () => {
      portalMessageService.success({ summaryKey: 'unit.test.message' })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(
        expect.objectContaining({
          severity: 'success',
          summary: 'Hello {{username}}',
        })
      )
    })

    it('with summary and detail adds correct data', () => {
      portalMessageService.success({ summaryKey: 'unit.test.message', detailKey: 'unit.test.message' })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(
        expect.objectContaining({
          severity: 'success',
          summary: 'Hello {{username}}',
          detail: 'Hello {{username}}',
        })
      )
    })

    it('with summary with parameter adds correct data', () => {
      portalMessageService.success({ summaryKey: 'unit.test.message', summaryParameters: { username: 'user' } })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(expect.objectContaining({ severity: 'success', summary: 'Hello user' }))
    })

    it('with summary with parameter and detail with parameter adds correct data', () => {
      portalMessageService.success({
        summaryKey: 'unit.test.message',
        detailKey: 'unit.test.message',
        summaryParameters: { username: 'user1' },
        detailParameters: { username: 'user2' },
      })
      portalMessageService.message$.subscribe((m) => (message = m))

      expect(message).toEqual(
        expect.objectContaining({
          severity: 'success',
          summary: 'Hello user1',
          detail: 'Hello user2',
        })
      )
    })
  })

  it('info sets correct severity', fakeAsync(() => {
    portalMessageService.info({ summaryKey: 'unit.test.message' })
    portalMessageService.message$.subscribe((m) => (message = m))

    expect(message).toEqual(expect.objectContaining({ severity: 'info' }))
  }))

  it('error sets correct severity', fakeAsync(() => {
    portalMessageService.error({ summaryKey: 'unit.test.message' })
    portalMessageService.message$.subscribe((m) => (message = m))

    expect(message).toEqual(expect.objectContaining({ severity: 'error' }))
  }))

  it('warning sets correct severity', fakeAsync(() => {
    portalMessageService.warning({ summaryKey: 'unit.test.message' })
    portalMessageService.message$.subscribe((m) => (message = m))

    expect(message).toEqual(expect.objectContaining({ severity: 'warning' }))
  }))
})
