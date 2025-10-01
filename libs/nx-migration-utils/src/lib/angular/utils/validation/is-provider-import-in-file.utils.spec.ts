import { isProviderImportInFile } from './is-provider-import-in-file.utils'
import { Provider } from '../../model/provider.model'

describe('isProviderImportInFile', () => {
  const mockProvider: Provider = {
    name: 'TestProvider',
    importPath: '@test/provider',
  }

  it('should return true when provider is imported', () => {
    const fileContent = 'import { TestProvider } from "@test/provider";'

    const result = isProviderImportInFile(fileContent, mockProvider)

    expect(result).toBe(true)
  })

  it('should return false when provider is not imported', () => {
    const fileContent = 'import { OtherProvider } from "@other/provider";'

    const result = isProviderImportInFile(fileContent, mockProvider)

    expect(result).toBe(false)
  })
})
