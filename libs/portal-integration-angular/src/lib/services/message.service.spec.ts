import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { PortalMessageService } from './message.service'
import { TranslateTestingModule } from 'ngx-translate-testing'

describe('PortalMessageService', () => {
  let service: PortalMessageService

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
      imports: [TranslateTestingModule.withTranslations('en', translations)],
      providers: [PortalMessageService],
    }).compileComponents()
    service = TestBed.inject(PortalMessageService)
  })

  describe('success', () => {
    it('with summary adds correct data', fakeAsync(() => {
      jest.spyOn(service, 'add')
      service.success({ summaryKey: 'unit.test.message' })
      tick()
      expect(service.add).toBeCalledWith(
        expect.objectContaining({ severity: 'success', summary: 'Hello {{username}}' })
      )
    }))

    it('with summary and detail adds correct data', fakeAsync(() => {
      jest.spyOn(service, 'add')
      service.success({ summaryKey: 'unit.test.message', detailKey: 'unit.test.message' })
      tick()
      expect(service.add).toBeCalledWith(
        expect.objectContaining({ severity: 'success', summary: 'Hello {{username}}', detail: 'Hello {{username}}' })
      )
    }))

    it('with summary with parameter adds correct data', fakeAsync(() => {
      jest.spyOn(service, 'add')
      service.success({ summaryKey: 'unit.test.message', summaryParameters: { username: 'user' } })
      tick()
      expect(service.add).toBeCalledWith(expect.objectContaining({ severity: 'success', summary: 'Hello user' }))
    }))

    it('with summary with parameter and detail with parameter adds correct data', fakeAsync(() => {
      jest.spyOn(service, 'add')
      service.success({
        summaryKey: 'unit.test.message',
        detailKey: 'unit.test.message',
        summaryParameters: { username: 'user1' },
        detailParameters: { username: 'user2' },
      })
      tick()
      expect(service.add).toBeCalledWith(
        expect.objectContaining({ severity: 'success', summary: 'Hello user1', detail: 'Hello user2' })
      )
    }))
  })

  it('info sets correct severity', fakeAsync(() => {
    jest.spyOn(service, 'add')
    service.info({ summaryKey: 'unit.test.message' })
    tick()
    expect(service.add).toBeCalledWith(expect.objectContaining({ severity: 'info' }))
  }))

  it('error sets correct severity', fakeAsync(() => {
    jest.spyOn(service, 'add')
    service.error({ summaryKey: 'unit.test.message' })
    tick()
    expect(service.add).toBeCalledWith(expect.objectContaining({ severity: 'error' }))
  }))

  it('warning sets correct severity', fakeAsync(() => {
    jest.spyOn(service, 'add')
    service.warning({ summaryKey: 'unit.test.message' })
    tick()
    expect(service.add).toBeCalledWith(expect.objectContaining({ severity: 'warning' }))
  }))
})
