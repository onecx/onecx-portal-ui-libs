# CSS Variables

These CSS variables will be used for the MFE Themes!

# List of Variables

```js
// Top Bar Variables
  --topbar-bg-color: #{$topbarBgColor};
  --topbar-text-color: #{$topbarItemTextColor};
  --topbar-left-bg-color: #{$topbarLeftBgColor};
  --topbar-item-text-color: #{$topbarItemTextColor};
  --topbar-item-text-hover-bg-color: #{$topbarItemTextHoverBgColor};
  --topbar-menu-button-bg-color: #{$topbarMenuButtonBgColor};
  --topbar-menu-button-text-color: #{$topbarMenuButtonTextColor};
  --menu-button-text-color: #{$topbarMenuButtonTextColor};

  // Body Variables
  --body-bg-color: #{$bodyBgColor};
  --text-color: #{$textColor};
  --text-secondary-color: #{$textSecondaryColor};
  --font-size: #{$fontSize};
  --font-family: #{$fontFamily};
  --border-width: #{$border-width};
  --border-radius: #{$borderRadius};
  --transition-duration: #{$transitionDuration};

  // Contens Variables
  --content-bg-color: #{$contentBgColor};
  --content-alt-bg-color: #{$contentAltBgColor};
  --overlay-content-bg-color: #{$overlayContentBgColor};
  --hover-bg-color: #{$hoverBgColor};
  --solid-surface-text-color: #{$solidSurfaceTextColor};
  --divider-color: #{$dividerColor};

  // Animation Variables
  --animation-duration: #{animationDuration};
  --animation-timing: #{animationTimingFunction};

  // Menu Style Variables
  --menu-text-color: #{$rootMenuTextColor};
  --menu-bg-color: #{$menuBgColor};
  --menu-item-text-color: #($menuItemTextColor);
  --menu-item-hover-bg-color: #($menuItemHoverBgColor);
  --inline-menu-border-color: #{inlineMenuBorderColor};
  --mobile-break-point: #{$mobileBreakpoint};
  --submenu-shadow: #{$submenuShadow};
  --menu-shadow: #{$menuShadow};

  // Headings Style Variables
  --h1-font-size: #{$h1FontSize};
  --h2-font-size: #{$h2FontSize};
  --h3-font-size: #{$h3FontSize};
  --h4-font-size: #{$h4FontSize};
  --h5-font-size: #{$h5FontSize};
  --h6-font-size: #{$h6FontSize};

  // General Colors Variables
  --primary-color: #{$primaryColor};
  --secondary-color: #{$secondaryColor};
  --topBar-color: #{$topBarColor};

  //Footer Variables
  --footer-text-color: #{$footerTextColor};
  --footer-bg-color :#{$footerBgColor};
```

# Defining a Variable

The variables can be defined into [CSS Variables](./_variables.scss) file inside root class

```js
// assigning values for the Variables
$primaryColor: #3ed1aa;
$fontSize: 14px !default;
$fontFamily: 'Ubuntu' !default;

// defining variables
:root {
    --primary-color:#{$primaryColor};
    --font-size: #{$fontSize};
    --font-family:#{$fontFamily};
}
```

# Usage

Using in CSS classes.

```js
body{
    background-color: var(--primary-color);
    font-size:var(--font-size);
    font-family:var(--font-family);
}
```

Using in Angular Components.

```js
// In Template
@Component({
  template: ` <h1 [style.--primary-color]="color">CSS vars works!</h1> `,
  styles: [
    `
      h1 {
        color: var(--primary-color);
      }
    `,
  ],
})
// in Component
export class ExmapleComponent {
  @HostBinding('style.(--primary-color')
  @Input()
  color: string
}
```
