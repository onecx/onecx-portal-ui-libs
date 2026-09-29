import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { OcxSkeletonComponent } from './skeleton.component'
import { StorybookThemeModule } from '../../storybook-theme.module'

export default {
  title: 'Components/OcxSkeletonComponent',
  component: OcxSkeletonComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [OcxSkeletonComponent],
      imports: [StorybookTranslateModule],
    }),
  ],
} as Meta<OcxSkeletonComponent>

const Template: StoryFn<OcxSkeletonComponent> = (args: OcxSkeletonComponent) => ({
  props: args,
})

export const Basic = {
  render: Template,
  args: {
    width: '10rem',
    height: '1rem',
  },
}

export const Circle = {
  render: Template,
  args: {
    width: '3rem',
    height: '3rem',
    shape: 'circle',
  },
}

export const NoAnimation = {
  render: Template,
  args: {
    width: '10rem',
    height: '1rem',
    animated: false,
  },
}

export const CustomColors = {
  render: Template,
  args: {
    width: '10rem',
    height: '1rem',
  },
  decorators: [
    moduleMetadata({
      declarations: [OcxSkeletonComponent],
      imports: [StorybookTranslateModule],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Colors can be restyled by setting `--ocx-skeleton-background` and `--ocx-skeleton-highlight` on an ancestor element.',
      },
    },
  },
}

