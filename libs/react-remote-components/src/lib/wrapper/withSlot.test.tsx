import { render } from '@testing-library/react'
import { type FC, useContext } from 'react'
import { SlotContext } from '../contexts/slotContext'
import { PermissionContext } from '../contexts/permissionContext'
import { withSlot } from './withSlot'

jest.mock('@onecx/integration-interface', () => {
  const { BehaviorSubject } = require('rxjs')
  return {
    RemoteComponentsTopic: jest.fn(() => new BehaviorSubject({ slots: [], components: [] })),
    PermissionsRpcTopic: jest.fn(() => new BehaviorSubject({ appId: '', productName: '', permissions: [] })),
    Technologies: {
      Angular: 'ANGULAR',
      React: 'REACT',
      WebComponentModule: 'WEB_COMPONENT_MODULE',
    },
  }
})

jest.mock('../utils/getShellMfInstance', () => ({
  getShellMfInstance: jest.fn(() => ({
    name: 'onecx-shell-ui',
    registerRemotes: jest.fn(),
    loadRemote: jest.fn(),
  })),
}))

jest.mock('../utils/logger.utils', () => ({
  createLogger: jest.fn(() => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  })),
}))

const TestComponent: FC<{ label?: string }> = ({ label = 'wrapped' }) => <div data-testid="inner">{label}</div>

describe('withSlot', () => {
  it('should return a function component', () => {
    const Wrapped = withSlot(TestComponent)
    expect(typeof Wrapped).toBe('function')
  })

  it('should render the wrapped component', () => {
    const Wrapped = withSlot(TestComponent)
    const { getByTestId } = render(<Wrapped />)
    expect(getByTestId('inner')).toBeDefined()
  })

  it('should pass props through to the wrapped component', () => {
    const Wrapped = withSlot(TestComponent)
    const { getByText } = render(<Wrapped label="hello from hoc" />)
    expect(getByText('hello from hoc')).toBeDefined()
  })

  it('should provide SlotContext to children', () => {
    let capturedSlot: any
    const Inspector: FC = () => {
      capturedSlot = useContext(SlotContext)
      return null
    }

    const Wrapped = withSlot(Inspector)
    render(<Wrapped />)
    expect(capturedSlot).toBeDefined()
    expect(typeof capturedSlot.getComponentsForSlot).toBe('function')
  })

  it('should provide PermissionContext to children', () => {
    let capturedPermission: any
    const Inspector: FC = () => {
      capturedPermission = useContext(PermissionContext)
      return null
    }

    const Wrapped = withSlot(Inspector)
    render(<Wrapped />)
    expect(capturedPermission).toBeDefined()
    expect(typeof capturedPermission.getPermissions).toBe('function')
  })
})
