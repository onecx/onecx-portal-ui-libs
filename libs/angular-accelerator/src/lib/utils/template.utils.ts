import { PrimeTemplate } from 'primeng/api'

export function findTemplate(templates: PrimeTemplate[], names: string[]): PrimeTemplate | undefined {
  for (let index = 0; index < names.length; index++) {
    const name = names[index]
    const template = templates.find((template) => template.name === name)
    if (template) {
      return template
    }
  }
  return undefined
}
