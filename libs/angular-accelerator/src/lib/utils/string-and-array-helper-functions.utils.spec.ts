import {
  findEntryWithKeyword,
  removeKeyword,
  searchPrefixWithSpecialChars,
} from './string-and-array-helper-functions.utils'

describe('findEntryWithKeyword', () => {
  it('should find the entry containing the keyword', () => {
    expect(findEntryWithKeyword(['entry1', 'entry2', 'keywordEntry'], 'keyword')).toBe('keywordEntry')
    expect(findEntryWithKeyword(['entry1', 'entry2', 'entry3'], 'keyword')).toBe(null)
    expect(findEntryWithKeyword(undefined, 'keyword')).toBe(null)
  })
})

describe('removeKeyword', () => {
  it('should remove the keyword and trailing details from the input string', () => {
    expect(removeKeyword('/ibt-tsg-mgmt-page/keyword/123', 'keyword')).toBe('/ibt-tsg-mgmt-page')
    expect(removeKeyword('/ibt-tsg-mgmt-page/keyword/123/', 'keyword')).toBe('/ibt-tsg-mgmt-page')
    expect(removeKeyword('/ibt-tsg-mgmt-page/search/123', 'keyword')).toBe('/ibt-tsg-mgmt-page/search/123')
  })

  describe('searchPrefixWithSpecialChars', () => {
    it('should return the latest string starting with the prefix followed by ? or #', () => {
      const exampleUrls1 = ['ibt-tsg-mgmt-page?id', 'ibt-tsg-mgmt-page#id', 'ibt-order-mgmt-page#id']
      const exampleUrls2 = ['ibt-tsg-mgmt-page#id', 'ibt-tsg-mgmt-page#id', 'ibt-tsg-mgmt-page?id']
      const prefix = 'ibt-tsg-mgmt-page'
      const expected1 = 'ibt-tsg-mgmt-page#id'
      const expected2 = 'ibt-tsg-mgmt-page?id'
      expect(searchPrefixWithSpecialChars(exampleUrls1, prefix)).toEqual(expected1)
      expect(searchPrefixWithSpecialChars(exampleUrls2, prefix)).toEqual(expected2)
    })

    it('should return the latest string of an array starting with the prefix followed by ? or #', () => {
      const strings = ['test?case', 'test#case', 'test case', 'example?test', 'example#test']
      const prefix = 'test'
      const expected = 'test#case'
      expect(searchPrefixWithSpecialChars(strings, prefix)).toEqual(expected)
    })
  })
})
