# Adding Icon Colours to `custom-theme.scss`

Leveraging the Angular Material theming API setup classes in the `custom-theme.scss` file to make it easy to assign a colour value to a matIcon.

In the `custom-theme.scss` file define the following:

```sass
mat-icon {
  &.primary-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-primary),
      )
    );
  }

  &.primary-container-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-primary-container),
      )
    );
  }

  &.primary-fixed-dim-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-primary-fixed-dim),
      )
    );
  }
}
```

This defines three classes (_primary-color_, _primary-container-color_ and _primary-fixed-dim-color_) that can be used to assign a theme colour to an icon element. Classes for additional theme colours can be defined by simply adding addition class definitions here. For example, extend the definition to support theme colour --mat-sys-error:

```sass
mat-icon {
  &.primary-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-primary),
      )
    );
  }

  &.primary-container-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-primary-container),
      )
    );
  }

  &.primary-fixed-dim-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-primary-fixed-dim),
      )
    );
  }

  &.error-color {
    @include mat.icon-overrides(
      (
        color: var(--mat-sys-error),
      )
    );
  }
}
```

To use these classes in a template:

```html
<mat-icon class="error-color">home</mat-icon>
```

This will display the Material Icon `home` in the theme's error colour.
