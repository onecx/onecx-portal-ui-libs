import { DialogMessageContentComponent } from './dialog-message-content.component'

describe('DialogMessageContentComponent', () => {
  let component: DialogMessageContentComponent

  beforeEach(() => {
    component = new DialogMessageContentComponent()
  })

  it('should give every instance a unique message id', () => {
    const other = new DialogMessageContentComponent()

    expect(component.messageId).toMatch(/^ocx-dialog-message-\d+$/)
    expect(other.messageId).not.toEqual(component.messageId)
  })

  describe('iconLabelKey', () => {
    it('should derive the severity key from a known icon', () => {
      component.icon = 'pi pi-exclamation-triangle'

      expect(component.iconLabelKey).toEqual('OCX_BUTTON_DIALOG.SEVERITY.WARNING')
    })

    it('should return undefined for an unknown icon', () => {
      component.icon = 'pi pi-user'

      expect(component.iconLabelKey).toBeUndefined()
    })

    it('should prefer a string iconLabel over the derived key', () => {
      component.icon = 'pi pi-check'
      component.iconLabel = 'CUSTOM.LABEL'

      expect(component.iconLabelKey).toEqual('CUSTOM.LABEL')
    })

    it('should use the key of an iconLabel with parameters', () => {
      component.iconLabel = { key: 'CUSTOM.LABEL', parameters: { value: 1 } }

      expect(component.iconLabelKey).toEqual('CUSTOM.LABEL')
    })
  })

  describe('iconLabelParameters', () => {
    it('should return the parameters of an iconLabel with parameters', () => {
      component.iconLabel = { key: 'CUSTOM.LABEL', parameters: { value: 1 } }

      expect(component.iconLabelParameters).toEqual({ value: 1 })
    })

    it('should return empty parameters for an iconLabel object without parameters', () => {
      component.iconLabel = { key: 'CUSTOM.LABEL' }

      expect(component.iconLabelParameters).toEqual({})
    })

    it('should return empty parameters for a string iconLabel', () => {
      component.iconLabel = 'CUSTOM.LABEL'

      expect(component.iconLabelParameters).toEqual({})
    })

    it('should return empty parameters without an iconLabel', () => {
      expect(component.iconLabelParameters).toEqual({})
    })
  })
})
