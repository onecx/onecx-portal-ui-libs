export * from 'primeng/types/select';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, InjectionToken, forwardRef, inject, EventEmitter, booleanAttribute, numberAttribute, Output, Input, Component, input, computed, signal, effect, ContentChildren, ContentChild, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { deepEquals, isNotEmpty, isEmpty, uuid, findSingle, scrollInView, equals, resolveFieldData, focus, isPrintableCharacter, findLastIndex, getFirstFocusableElement, getLastFocusableElement, getFocusableElements } from '@primeuix/utils';
import * as i3 from 'primeng/api';
import { SharedModule, TranslationKeys, PrimeTemplate } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';
import { BaseComponent, PARENT_INSTANCE } from 'primeng/basecomponent';
import { BaseInput } from 'primeng/baseinput';
import * as i2 from 'primeng/bind';
import { BindModule, Bind } from 'primeng/bind';
import { unblockBodyScroll } from 'primeng/dom';
import { IconField } from 'primeng/iconfield';
import { CheckIcon, BlankIcon, TimesIcon, ChevronDownIcon, SearchIcon } from 'primeng/icons';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Overlay } from 'primeng/overlay';
import { Ripple } from 'primeng/ripple';
import { Scroller } from 'primeng/scroller';
import { Tooltip } from 'primeng/tooltip';
import { style as style$1 } from '@primeuix/styles/select';
import { BaseStyle } from 'primeng/base';

const style = /*css*/ `
    ${style$1}

    /* For PrimeNG */
    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.ng-invalid.ng-dirty {
        border-color: dt('select.invalid.border.color');
    }

    .p-dropdown.ng-invalid.ng-dirty .p-dropdown-label.p-placeholder,
    .p-select.ng-invalid.ng-dirty .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }
`;
const classes = {
    root: ({ instance }) => [
        'p-select p-component p-inputwrapper',
        {
            'p-disabled': instance.$disabled(),
            'p-variant-filled': instance.$variant() === 'filled',
            'p-focus': instance.focused,
            'p-invalid': instance.invalid(),
            'p-inputwrapper-filled': instance.$filled(),
            'p-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'p-select-open': instance.overlayVisible,
            'p-select-fluid': instance.hasFluid,
            'p-select-sm p-inputfield-sm': instance.size() === 'small',
            'p-select-lg p-inputfield-lg': instance.size() === 'large'
        }
    ],
    label: ({ instance }) => [
        'p-select-label',
        {
            'p-placeholder': instance.placeholder() && instance.label() === instance.placeholder(),
            'p-select-label-empty': !instance.editable && !instance.selectedItemTemplate && (instance.label() === undefined || instance.label() === null || instance.label() === 'p-emptylabel' || instance.label().length === 0)
        }
    ],
    clearIcon: 'p-select-clear-icon',
    dropdown: 'p-select-dropdown',
    loadingIcon: 'p-select-loading-icon',
    dropdownIcon: 'p-select-dropdown-icon',
    overlay: 'p-select-overlay p-component-overlay p-component',
    header: 'p-select-header',
    pcFilter: 'p-select-filter',
    listContainer: 'p-select-list-container',
    list: 'p-select-list',
    optionGroup: 'p-select-option-group',
    optionGroupLabel: 'p-select-option-group-label',
    option: ({ instance }) => [
        'p-select-option',
        {
            'p-select-option-selected': instance.selected && !instance.checkmark,
            'p-disabled': instance.disabled,
            'p-focus': instance.focused
        }
    ],
    optionLabel: 'p-select-option-label',
    optionCheckIcon: 'p-select-option-check-icon',
    optionBlankIcon: 'p-select-option-blank-icon',
    emptyMessage: 'p-select-empty-message'
};
class SelectStyle extends BaseStyle {
    name = 'select';
    style = style;
    classes = classes;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectStyle, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectStyle });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectStyle, decorators: [{
            type: Injectable
        }] });
/**
 *
 * Select also known as Select, is used to choose an item from a collection of options.
 *
 * [Live Demo](https://www.primeng.org/select/)
 *
 * @module selectstyle
 *
 */
var SelectClasses;
(function (SelectClasses) {
    /**
     * Class name of the root element
     */
    SelectClasses["root"] = "p-select";
    /**
     * Class name of the label element
     */
    SelectClasses["label"] = "p-select-label";
    /**
     * Class name of the clear icon element
     */
    SelectClasses["clearIcon"] = "p-select-clear-icon";
    /**
     * Class name of the dropdown element
     */
    SelectClasses["dropdown"] = "p-select-dropdown";
    /**
     * Class name of the loadingicon element
     */
    SelectClasses["loadingIcon"] = "p-select-loading-icon";
    /**
     * Class name of the dropdown icon element
     */
    SelectClasses["dropdownIcon"] = "p-select-dropdown-icon";
    /**
     * Class name of the overlay element
     */
    SelectClasses["overlay"] = "p-select-overlay";
    /**
     * Class name of the header element
     */
    SelectClasses["header"] = "p-select-header";
    /**
     * Class name of the filter element
     */
    SelectClasses["pcFilter"] = "p-select-filter";
    /**
     * Class name of the list container element
     */
    SelectClasses["listContainer"] = "p-select-list-container";
    /**
     * Class name of the list element
     */
    SelectClasses["list"] = "p-select-list";
    /**
     * Class name of the option group element
     */
    SelectClasses["optionGroup"] = "p-select-option-group";
    /**
     * Class name of the option group label element
     */
    SelectClasses["optionGroupLabel"] = "p-select-option-group-label";
    /**
     * Class name of the option element
     */
    SelectClasses["option"] = "p-select-option";
    /**
     * Class name of the option label element
     */
    SelectClasses["optionLabel"] = "p-select-option-label";
    /**
     * Class name of the option check icon element
     */
    SelectClasses["optionCheckIcon"] = "p-select-option-check-icon";
    /**
     * Class name of the option blank icon element
     */
    SelectClasses["optionBlankIcon"] = "p-select-option-blank-icon";
    /**
     * Class name of the empty message element
     */
    SelectClasses["emptyMessage"] = "p-select-empty-message";
})(SelectClasses || (SelectClasses = {}));

const SELECT_INSTANCE = new InjectionToken('SELECT_INSTANCE');
const SELECT_ITEM_INSTANCE = new InjectionToken('SELECT_ITEM_INSTANCE');
const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select),
    multi: true
};
class SelectItem extends BaseComponent {
    hostName = 'select';
    $pcSelectItem = inject(SELECT_ITEM_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;
    $pcSelect = inject(SELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;
    id;
    option;
    selected;
    focused;
    label;
    disabled;
    visible;
    itemSize;
    ariaPosInset;
    ariaSetSize;
    template;
    checkmark;
    index;
    scrollerOptions;
    onClick = new EventEmitter();
    onMouseEnter = new EventEmitter();
    _componentStyle = inject(SelectStyle);
    onOptionClick(event) {
        this.onClick.emit(event);
    }
    onOptionMouseEnter(event) {
        this.onMouseEnter.emit(event);
    }
    getPTOptions() {
        return (this.$pcSelect?.getPTItemOptions?.(this.option, this.scrollerOptions, this.index ?? 0, 'option') ??
            this.$pcSelect?.ptm('option', {
                context: {
                    option: this.option,
                    selected: this.selected,
                    focused: this.focused,
                    disabled: this.disabled
                }
            }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectItem, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "21.0.5", type: SelectItem, isStandalone: true, selector: "p-selectItem", inputs: { id: "id", option: "option", selected: ["selected", "selected", booleanAttribute], focused: ["focused", "focused", booleanAttribute], label: "label", disabled: ["disabled", "disabled", booleanAttribute], visible: ["visible", "visible", booleanAttribute], itemSize: ["itemSize", "itemSize", numberAttribute], ariaPosInset: "ariaPosInset", ariaSetSize: "ariaSetSize", template: "template", checkmark: ["checkmark", "checkmark", booleanAttribute], index: "index", scrollerOptions: "scrollerOptions" }, outputs: { onClick: "onClick", onMouseEnter: "onMouseEnter" }, providers: [SelectStyle, { provide: PARENT_INSTANCE, useExisting: SelectItem }], usesInheritance: true, ngImport: i0, template: `
        <li
            [id]="id"
            [pBind]="getPTOptions()"
            (click)="onOptionClick($event)"
            (mouseenter)="onOptionMouseEnter($event)"
            role="option"
            pRipple
            [attr.aria-label]="label"
            [attr.aria-setsize]="ariaSetSize"
            [attr.aria-posinset]="ariaPosInset"
            [attr.aria-selected]="selected"
            [attr.data-p-focused]="focused"
            [attr.data-p-highlight]="selected"
            [attr.data-p-selected]="selected"
            [attr.data-p-disabled]="disabled"
            [ngStyle]="{ height: scrollerOptions?.itemSize + 'px' }"
            [class]="cx('option')"
        >
            <ng-container *ngIf="checkmark">
                <svg data-p-icon="check" *ngIf="selected" [class]="cx('optionCheckIcon')" [pBind]="$pcSelect?.ptm('optionCheckIcon')" />
                <svg data-p-icon="blank" *ngIf="!selected" [class]="cx('optionBlankIcon')" [pBind]="$pcSelect?.ptm('optionBlankIcon')" />
            </ng-container>
            <span *ngIf="!template" [pBind]="$pcSelect?.ptm('optionLabel')">{{ label ?? 'empty' }}</span>
            <ng-container *ngTemplateOutlet="template; context: { $implicit: option }"></ng-container>
        </li>
    `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: SharedModule }, { kind: "directive", type: Ripple, selector: "[pRipple]" }, { kind: "component", type: CheckIcon, selector: "[data-p-icon=\"check\"]" }, { kind: "component", type: BlankIcon, selector: "[data-p-icon=\"blank\"]" }, { kind: "ngmodule", type: BindModule }, { kind: "directive", type: i2.Bind, selector: "[pBind]", inputs: ["pBind"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-selectItem',
                    standalone: true,
                    imports: [CommonModule, SharedModule, Ripple, CheckIcon, BlankIcon, BindModule],
                    template: `
        <li
            [id]="id"
            [pBind]="getPTOptions()"
            (click)="onOptionClick($event)"
            (mouseenter)="onOptionMouseEnter($event)"
            role="option"
            pRipple
            [attr.aria-label]="label"
            [attr.aria-setsize]="ariaSetSize"
            [attr.aria-posinset]="ariaPosInset"
            [attr.aria-selected]="selected"
            [attr.data-p-focused]="focused"
            [attr.data-p-highlight]="selected"
            [attr.data-p-selected]="selected"
            [attr.data-p-disabled]="disabled"
            [ngStyle]="{ height: scrollerOptions?.itemSize + 'px' }"
            [class]="cx('option')"
        >
            <ng-container *ngIf="checkmark">
                <svg data-p-icon="check" *ngIf="selected" [class]="cx('optionCheckIcon')" [pBind]="$pcSelect?.ptm('optionCheckIcon')" />
                <svg data-p-icon="blank" *ngIf="!selected" [class]="cx('optionBlankIcon')" [pBind]="$pcSelect?.ptm('optionBlankIcon')" />
            </ng-container>
            <span *ngIf="!template" [pBind]="$pcSelect?.ptm('optionLabel')">{{ label ?? 'empty' }}</span>
            <ng-container *ngTemplateOutlet="template; context: { $implicit: option }"></ng-container>
        </li>
    `,
                    providers: [SelectStyle, { provide: PARENT_INSTANCE, useExisting: SelectItem }]
                }]
        }], propDecorators: { id: [{
                type: Input
            }], option: [{
                type: Input
            }], selected: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], focused: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], visible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], itemSize: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], ariaPosInset: [{
                type: Input
            }], ariaSetSize: [{
                type: Input
            }], template: [{
                type: Input
            }], checkmark: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], index: [{
                type: Input
            }], scrollerOptions: [{
                type: Input
            }], onClick: [{
                type: Output
            }], onMouseEnter: [{
                type: Output
            }] } });
/**
 * Select is used to choose an item from a collection of options.
 * @group Components
 */
class Select extends BaseInput {
    zone;
    filterService;
    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * Unique identifier of the component
     * @group Props
     */
    id;
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = '200px';
    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    filter;
    /**
     * Inline style of the overlay panel element.
     * @group Props
     */
    panelStyle;
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass;
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    panelStyleClass;
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly;
    /**
     * When present, custom value instead of predefined options can be entered using the editable input field.
     * @group Props
     */
    editable;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = 0;
    /**
     * Default text to display when no option is selected.
     * @group Props
     */
    set placeholder(val) {
        this._placeholder.set(val);
    }
    get placeholder() {
        return this._placeholder.asReadonly();
    }
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon;
    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    filterPlaceholder;
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale;
    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    inputId;
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey;
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy;
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    filterFields;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * Clears the filter value when hiding the select.
     * @group Props
     */
    resetFilterOnHide = false;
    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     */
    checkmark = false;
    /**
     * Icon class of the select icon.
     * @group Props
     */
    dropdownIcon;
    /**
     * Whether the select is in loading state.
     * @group Props
     */
    loading = false;
    /**
     * Name of the label field of an option.
     * @group Props
     */
    optionLabel;
    /**
     * Name of the value field of an option.
     * @group Props
     */
    optionValue;
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled;
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    optionGroupLabel = 'label';
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    optionGroupChildren = 'items';
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group;
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear;
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyFilterMessage = '';
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = '';
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = false;
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll;
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize;
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions;
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions;
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel;
    /**
     * Used to define a aria label attribute the current element.
     * @group Props
     */
    ariaLabel;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode = 'contains';
    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    tooltip = '';
    /**
     * Position of the tooltip.
     * @group Props
     */
    tooltipPosition = 'right';
    /**
     * Type of CSS position.
     * @group Props
     */
    tooltipPositionStyle = 'absolute';
    /**
     * Style class of the tooltip.
     * @group Props
     */
    tooltipStyleClass;
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    focusOnHover = true;
    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    selectOnFocus = false;
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    autoOptionFocus = false;
    /**
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    autofocusFilter = true;
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    get filterValue() {
        return this._filterValue();
    }
    set filterValue(val) {
        setTimeout(() => {
            this._filterValue.set(val);
        });
    }
    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    get options() {
        const options = this._options();
        return options;
    }
    set options(val) {
        if (!deepEquals(val, this._options())) {
            this._options.set(val);
        }
    }
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input(undefined, ...(ngDevMode ? [{ debugName: "appendTo" }] : []));
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input(undefined, ...(ngDevMode ? [{ debugName: "motionOptions" }] : []));
    /**
     * Callback to invoke when value of select changes.
     * @param {SelectChangeEvent} event - custom change event.
     * @group Emits
     */
    onChange = new EventEmitter();
    /**
     * Callback to invoke when data is filtered.
     * @param {SelectFilterEvent} event - custom filter event.
     * @group Emits
     */
    onFilter = new EventEmitter();
    /**
     * Callback to invoke when select gets focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = new EventEmitter();
    /**
     * Callback to invoke when select loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = new EventEmitter();
    /**
     * Callback to invoke when component is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick = new EventEmitter();
    /**
     * Callback to invoke when select overlay gets visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    onShow = new EventEmitter();
    /**
     * Callback to invoke when select overlay gets hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    onHide = new EventEmitter();
    /**
     * Callback to invoke when select clears the value.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onClear = new EventEmitter();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {SelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    onLazyLoad = new EventEmitter();
    _componentStyle = inject(SelectStyle);
    filterViewChild;
    focusInputViewChild;
    editableInputViewChild;
    itemsViewChild;
    scroller;
    overlayViewChild;
    firstHiddenFocusableElementOnOverlay;
    lastHiddenFocusableElementOnOverlay;
    itemsWrapper;
    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo(), ...(ngDevMode ? [{ debugName: "$appendTo" }] : []));
    /**
     * Custom item template.
     * @group Templates
     */
    itemTemplate;
    /**
     * Custom group template.
     * @group Templates
     */
    groupTemplate;
    /**
     * Custom loader template.
     * @group Templates
     */
    loaderTemplate;
    /**
     * Custom selected item template.
     * @group Templates
     */
    selectedItemTemplate;
    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate;
    /**
     * Custom filter template.
     * @group Templates
     */
    filterTemplate;
    /**
     * Custom footer template.
     * @group Templates
     */
    footerTemplate;
    /**
     * Custom empty filter template.
     * @group Templates
     */
    emptyFilterTemplate;
    /**
     * Custom empty template.
     * @group Templates
     */
    emptyTemplate;
    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    dropdownIconTemplate;
    /**
     * Custom loading icon template.
     * @group Templates
     */
    loadingIconTemplate;
    /**
     * Custom clear icon template.
     * @group Templates
     */
    clearIconTemplate;
    /**
     * Custom filter icon template.
     * @group Templates
     */
    filterIconTemplate;
    /**
     * Custom on icon template.
     * @group Templates
     */
    onIconTemplate;
    /**
     * Custom off icon template.
     * @group Templates
     */
    offIconTemplate;
    /**
     * Custom cancel icon template.
     * @group Templates
     */
    cancelIconTemplate;
    templates;
    _itemTemplate;
    _selectedItemTemplate;
    _headerTemplate;
    _filterTemplate;
    _footerTemplate;
    _emptyFilterTemplate;
    _emptyTemplate;
    _groupTemplate;
    _loaderTemplate;
    _dropdownIconTemplate;
    _loadingIconTemplate;
    _clearIconTemplate;
    _filterIconTemplate;
    _cancelIconTemplate;
    _onIconTemplate;
    _offIconTemplate;
    filterOptions;
    _options = signal(null, ...(ngDevMode ? [{ debugName: "_options" }] : []));
    _placeholder = signal(undefined, ...(ngDevMode ? [{ debugName: "_placeholder" }] : []));
    value;
    hover;
    focused;
    overlayVisible;
    optionsChanged;
    panel;
    dimensionsUpdated;
    hoveredItem;
    selectedOptionUpdated;
    _filterValue = signal(null, ...(ngDevMode ? [{ debugName: "_filterValue" }] : []));
    searchValue;
    searchIndex;
    searchTimeout;
    previousSearchChar;
    currentSearchChar;
    preventModelTouched;
    focusedOptionIndex = signal(-1, ...(ngDevMode ? [{ debugName: "focusedOptionIndex" }] : []));
    labelId;
    listId;
    clicked = signal(false, ...(ngDevMode ? [{ debugName: "clicked" }] : []));
    get emptyMessageLabel() {
        return this.emptyMessage || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE);
    }
    get emptyFilterMessageLabel() {
        return this.emptyFilterMessage || this.config.getTranslation(TranslationKeys.EMPTY_FILTER_MESSAGE);
    }
    get isVisibleClearIcon() {
        return this.modelValue() != null && this.hasSelectedOption() && this.showClear && !this.$disabled();
    }
    get listLabel() {
        return this.config.getTranslation(TranslationKeys.ARIA)['listLabel'];
    }
    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? `${this.id}_${this.focusedOptionIndex()}` : null;
    }
    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();
        if (this._filterValue()) {
            const _filterBy = this.filterBy || this.optionLabel;
            const filteredOptions = !_filterBy && !this.filterFields && !this.optionValue
                ? this.options?.filter((option) => {
                    if (option.label) {
                        return option.label.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim()) !== -1;
                    }
                    return option.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim()) !== -1;
                })
                : this.filterService.filter(options, this.searchFields(), this._filterValue().trim(), this.filterMatchMode, this.filterLocale);
            if (this.group) {
                const optionGroups = this.options || [];
                const filtered = [];
                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions?.includes(item));
                    if (filteredItems.length > 0)
                        filtered.push({
                            ...group,
                            [typeof this.optionGroupChildren === 'string' ? this.optionGroupChildren : 'items']: [...filteredItems]
                        });
                });
                return this.flatOptions(filtered);
            }
            return filteredOptions;
        }
        return options;
    }, ...(ngDevMode ? [{ debugName: "visibleOptions" }] : []));
    label = computed(() => {
        // use  getAllVisibleAndNonVisibleOptions verses just visible options
        // this will find the selected option whether or not the user is currently filtering  because the filtered (i.e. visible) options, are a subset of all the options
        const options = this.getAllVisibleAndNonVisibleOptions();
        // use isOptionEqualsModelValue for the use case where the dropdown is initalized with a disabled option
        const selectedOptionIndex = options.findIndex((option) => {
            const isEqual = this.isOptionValueEqualsModelValue(option);
            return isEqual;
        });
        if (selectedOptionIndex !== -1) {
            const selectedOption = options[selectedOptionIndex];
            // Always show the label for selected options, even if disabled
            return this.getOptionLabel(selectedOption);
        }
        return this.placeholder() || 'p-emptylabel';
    }, ...(ngDevMode ? [{ debugName: "label" }] : []));
    selectedOption;
    constructor(zone, filterService) {
        super();
        this.zone = zone;
        this.filterService = filterService;
        effect(() => {
            const modelValue = this.modelValue();
            const visibleOptions = this.visibleOptions();
            if (visibleOptions && isNotEmpty(visibleOptions)) {
                const selectedOptionIndex = this.findSelectedOptionIndex();
                if (selectedOptionIndex !== -1 || modelValue === undefined || (typeof modelValue === 'string' && modelValue.length === 0) || this.isModelValueNotSet() || this.editable) {
                    this.selectedOption = visibleOptions[selectedOptionIndex];
                }
                else {
                    // If no valid selected option found but we have a model value,
                    // try to find the option including disabled ones for template display
                    const disabledSelectedIndex = visibleOptions.findIndex((option) => this.isSelected(option));
                    if (disabledSelectedIndex !== -1) {
                        this.selectedOption = visibleOptions[disabledSelectedIndex];
                    }
                }
            }
            if (isEmpty(visibleOptions) && (modelValue === undefined || this.isModelValueNotSet()) && isNotEmpty(this.selectedOption)) {
                this.selectedOption = null;
            }
            if (modelValue !== undefined && this.editable) {
                this.updateEditableLabel();
            }
            this.cd.markForCheck();
        });
    }
    isModelValueNotSet() {
        return this.modelValue() === null && !this.isOptionValueEqualsModelValue(this.selectedOption);
    }
    getAllVisibleAndNonVisibleOptions() {
        return this.group ? this.flatOptions(this.options) : this.options || [];
    }
    onInit() {
        this.id = this.id || uuid('pn_id_');
        this.autoUpdateModel();
        if (this.filterBy) {
            this.filterOptions = {
                filter: (value) => this.onFilterInputChange(value),
                reset: () => this.resetFilter()
            };
        }
    }
    onAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;
                case 'selectedItem':
                    this._selectedItemTemplate = item.template;
                    break;
                case 'header':
                    this._headerTemplate = item.template;
                    break;
                case 'filter':
                    this._filterTemplate = item.template;
                    break;
                case 'footer':
                    this._footerTemplate = item.template;
                    break;
                case 'emptyfilter':
                    this._emptyFilterTemplate = item.template;
                    break;
                case 'empty':
                    this._emptyTemplate = item.template;
                    break;
                case 'group':
                    this._groupTemplate = item.template;
                    break;
                case 'loader':
                    this._loaderTemplate = item.template;
                    break;
                case 'dropdownicon':
                    this._dropdownIconTemplate = item.template;
                    break;
                case 'loadingicon':
                    this._loadingIconTemplate = item.template;
                    break;
                case 'clearicon':
                    this._clearIconTemplate = item.template;
                    break;
                case 'filtericon':
                    this._filterIconTemplate = item.template;
                    break;
                case 'cancelicon':
                    this._cancelIconTemplate = item.template;
                    break;
                case 'onicon':
                    this._onIconTemplate = item.template;
                    break;
                case 'officon':
                    this._offIconTemplate = item.template;
                    break;
                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }
    onAfterViewChecked() {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        if (this.optionsChanged && this.overlayVisible) {
            this.optionsChanged = false;
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    if (this.overlayViewChild) {
                        this.overlayViewChild.alignOverlay();
                    }
                }, 1);
            });
        }
        if (this.selectedOptionUpdated && this.itemsWrapper) {
            let selectedItem = findSingle(this.overlayViewChild?.overlayViewChild?.nativeElement, 'li[data-p-selected="true"]');
            if (selectedItem) {
                scrollInView(this.itemsWrapper, selectedItem);
            }
            this.selectedOptionUpdated = false;
        }
    }
    flatOptions(options) {
        return (options || []).reduce((result, option, index) => {
            result.push({ optionGroup: option, group: true, index });
            const optionGroupChildren = this.getOptionGroupChildren(option);
            optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));
            return result;
        }, []);
    }
    autoUpdateModel() {
        if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption()) {
            this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()], false);
        }
    }
    onOptionSelect(event, option, isHide = true, preventChange = false) {
        // Check if option is disabled before proceeding
        if (this.isOptionDisabled(option)) {
            return;
        }
        if (!this.isSelected(option)) {
            const value = this.getOptionValue(option);
            this.updateModel(value, event);
            this.focusedOptionIndex.set(this.findSelectedOptionIndex());
            preventChange === false && this.onChange.emit({ originalEvent: event, value: value });
        }
        if (isHide) {
            this.hide(true);
        }
    }
    onOptionMouseEnter(event, index) {
        if (this.focusOnHover) {
            this.changeFocusedOptionIndex(event, index);
        }
    }
    updateModel(value, event) {
        this.value = value;
        this.onModelChange(value);
        this.writeModelValue(value);
        this.selectedOptionUpdated = true;
    }
    allowModelChange() {
        return !!this.modelValue() && !this.placeholder() && (this.modelValue() === undefined || this.modelValue() === null) && !this.editable && this.options && this.options.length;
    }
    isSelected(option) {
        return this.isOptionValueEqualsModelValue(option);
    }
    isOptionValueEqualsModelValue(option) {
        // Don't check isValidOption here since we need to match disabled options too
        return option !== undefined && option !== null && !this.isOptionGroup(option) && equals(this.modelValue(), this.getOptionValue(option), this.equalityKey());
    }
    onAfterViewInit() {
        if (this.editable) {
            this.updateEditableLabel();
        }
        this.updatePlaceHolderForFloatingLabel();
    }
    updatePlaceHolderForFloatingLabel() {
        const parentElement = this.el.nativeElement.parentElement;
        const isInFloatingLabel = parentElement?.classList.contains('p-float-label');
        if (parentElement && isInFloatingLabel && !this.selectedOption) {
            const label = parentElement.querySelector('label');
            if (label) {
                this._placeholder.set(label.textContent);
            }
        }
    }
    updateEditableLabel() {
        if (this.editableInputViewChild) {
            this.editableInputViewChild.nativeElement.value = this.getOptionLabel(this.selectedOption) || this.modelValue() || '';
        }
    }
    clearEditableLabel() {
        if (this.editableInputViewChild) {
            this.editableInputViewChild.nativeElement.value = '';
        }
    }
    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }
    getOptionLabel(option) {
        return this.optionLabel !== undefined && this.optionLabel !== null ? resolveFieldData(option, this.optionLabel) : option && option.label !== undefined ? option.label : option;
    }
    getOptionValue(option) {
        return this.optionValue && this.optionValue !== null ? resolveFieldData(option, this.optionValue) : !this.optionLabel && option && option.value !== undefined ? option.value : option;
    }
    getPTItemOptions(option, itemOptions, index, key) {
        return this.ptm(key, {
            context: {
                option,
                index,
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }
    isSelectedOptionEmpty() {
        return isEmpty(this.selectedOption);
    }
    isOptionDisabled(option) {
        return this.optionDisabled ? resolveFieldData(option, this.optionDisabled) : option && option.disabled !== undefined ? option.disabled : false;
    }
    getOptionGroupLabel(optionGroup) {
        return this.optionGroupLabel !== undefined && this.optionGroupLabel !== null ? resolveFieldData(optionGroup, this.optionGroupLabel) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }
    getOptionGroupChildren(optionGroup) {
        return this.optionGroupChildren !== undefined && this.optionGroupChildren !== null ? resolveFieldData(optionGroup, this.optionGroupChildren) : optionGroup.items;
    }
    getAriaPosInset(index) {
        return ((this.optionGroupLabel
            ? index -
                this.visibleOptions()
                    .slice(0, index)
                    .filter((option) => this.isOptionGroup(option)).length
            : index) + 1);
    }
    get ariaSetSize() {
        return this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length;
    }
    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    resetFilter() {
        this._filterValue.set(null);
        if (this.filterViewChild && this.filterViewChild.nativeElement) {
            this.filterViewChild.nativeElement.value = '';
        }
    }
    onContainerClick(event) {
        if (this.$disabled() || this.readonly || this.loading) {
            return;
        }
        if (event.target.tagName === 'INPUT' || event.target.getAttribute('data-pc-section') === 'clearicon' || event.target.closest('[data-pc-section="clearicon"]')) {
            return;
        }
        else if (!this.overlayViewChild || !this.overlayViewChild.el.nativeElement.contains(event.target)) {
            this.overlayVisible ? this.hide(true) : this.show(true);
        }
        this.focusInputViewChild?.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
        this.clicked.set(true);
        this.cd.detectChanges();
    }
    isEmpty() {
        return !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0);
    }
    onEditableInput(event) {
        const value = event.target.value;
        this.searchValue = '';
        const matched = this.searchOptions(event, value);
        !matched && this.focusedOptionIndex.set(-1);
        this.onModelChange(value);
        this.updateModel(value || null, event);
        setTimeout(() => {
            this.onChange.emit({ originalEvent: event, value: value });
        }, 1);
        !this.overlayVisible && isNotEmpty(value) && this.show();
    }
    /**
     * Displays the panel.
     * @group Method
     */
    show(isFocus) {
        this.overlayVisible = true;
        this.focusedOptionIndex.set(this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex());
        if (isFocus) {
            focus(this.focusInputViewChild?.nativeElement);
        }
        this.cd.markForCheck();
    }
    onOverlayBeforeEnter(event) {
        this.itemsWrapper = findSingle(this.overlayViewChild?.overlayViewChild?.nativeElement, this.virtualScroll ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]');
        this.virtualScroll && this.scroller?.setContentEl(this.itemsViewChild?.nativeElement);
        if (this.options && this.options.length) {
            if (this.virtualScroll) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    setTimeout(() => {
                        this.scroller?.scrollToIndex(selectedIndex);
                    }, 10);
                }
            }
            else {
                let selectedListItem = findSingle(this.itemsWrapper, '[data-p-selected="true"]');
                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }
        if (this.filterViewChild && this.filterViewChild.nativeElement) {
            this.preventModelTouched = true;
            if (this.autofocusFilter && !this.editable) {
                this.filterViewChild.nativeElement.focus();
            }
        }
        this.onShow.emit(event);
    }
    onOverlayAfterLeave(event) {
        this.itemsWrapper = null;
        this.onModelTouched();
        this.onHide.emit(event);
    }
    /**
     * Hides the panel.
     * @group Method
     */
    hide(isFocus) {
        this.overlayVisible = false;
        this.focusedOptionIndex.set(-1);
        this.clicked.set(false);
        this.searchValue = '';
        if (this.overlayOptions?.mode === 'modal') {
            unblockBodyScroll();
        }
        if (this.filter && this.resetFilterOnHide) {
            this.resetFilter();
        }
        if (isFocus) {
            if (this.focusInputViewChild) {
                focus(this.focusInputViewChild?.nativeElement);
            }
            if (this.editable && this.editableInputViewChild) {
                focus(this.editableInputViewChild?.nativeElement);
            }
        }
        this.cd.markForCheck();
    }
    onInputFocus(event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }
        this.focused = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.overlayVisible && this.scrollInView(this.focusedOptionIndex());
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.focused = false;
        this.onBlur.emit(event);
        if (!this.preventModelTouched && !this.overlayVisible) {
            this.onModelTouched();
        }
        this.preventModelTouched = false;
    }
    onKeyDown(event, search = false) {
        if (this.$disabled() || this.readonly || this.loading) {
            return;
        }
        switch (event.code) {
            //down
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;
            //up
            case 'ArrowUp':
                this.onArrowUpKey(event, this.editable);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, this.editable);
                break;
            case 'Delete':
                this.onDeleteKey(event);
                break;
            case 'Home':
                this.onHomeKey(event, this.editable);
                break;
            case 'End':
                this.onEndKey(event, this.editable);
                break;
            case 'PageDown':
                this.onPageDownKey(event);
                break;
            case 'PageUp':
                this.onPageUpKey(event);
                break;
            //space
            case 'Space':
                this.onSpaceKey(event, search);
                break;
            //enter
            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;
            //escape and tab
            case 'Escape':
                this.onEscapeKey(event);
                break;
            case 'Tab':
                this.onTabKey(event);
                break;
            case 'Backspace':
                this.onBackspaceKey(event, this.editable);
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;
            default:
                if (!event.metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible && this.show();
                    !this.editable && this.searchOptions(event, event.key);
                }
                break;
        }
        this.clicked.set(false);
    }
    onFilterKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;
            case 'ArrowUp':
                this.onArrowUpKey(event, true);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, true);
                break;
            case 'Home':
                this.onHomeKey(event, true);
                break;
            case 'End':
                this.onEndKey(event, true);
                break;
            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event, true);
                break;
            case 'Escape':
                this.onEscapeKey(event);
                break;
            case 'Tab':
                this.onTabKey(event, true);
                break;
            default:
                break;
        }
    }
    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }
    onArrowDownKey(event) {
        if (!this.overlayVisible) {
            this.show();
            this.editable && this.changeFocusedOptionIndex(event, this.findSelectedOptionIndex());
        }
        else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();
            this.changeFocusedOptionIndex(event, optionIndex);
        }
        // const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();
        // this.changeFocusedOptionIndex(event, optionIndex);
        // !this.overlayVisible && this.show();
        event.preventDefault();
        event.stopPropagation();
    }
    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();
            if (this.selectOnFocus) {
                const option = this.visibleOptions()[index];
                this.onOptionSelect(event, option, false);
            }
        }
    }
    get virtualScrollerDisabled() {
        return !this.virtualScroll;
    }
    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
        if (this.itemsViewChild && this.itemsViewChild.nativeElement) {
            const element = findSingle(this.itemsViewChild.nativeElement, `li[id="${id}"]`);
            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
            else if (!this.virtualScrollerDisabled) {
                setTimeout(() => {
                    this.virtualScroll && this.scroller?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
                }, 0);
            }
        }
    }
    hasSelectedOption() {
        return this.modelValue() !== undefined;
    }
    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }
    equalityKey() {
        return this.optionValue ? undefined : this.dataKey;
    }
    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }
    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }
    findSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }
    findNextOptionIndex(index) {
        const matchedOptionIndex = index < this.visibleOptions().length - 1
            ? this.visibleOptions()
                .slice(index + 1)
                .findIndex((option) => this.isValidOption(option))
            : -1;
        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }
    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;
        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }
    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }
    findLastFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }
    isValidOption(option) {
        return option !== undefined && option !== null && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }
    isOptionGroup(option) {
        return this.optionGroupLabel !== undefined && this.optionGroupLabel !== null && option.optionGroup !== undefined && option.optionGroup !== null && option.group;
    }
    onArrowUpKey(event, pressedInInputText = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }
            this.overlayVisible && this.hide();
        }
        else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
            this.changeFocusedOptionIndex(event, optionIndex);
            !this.overlayVisible && this.show();
        }
        event.preventDefault();
        event.stopPropagation();
    }
    onArrowLeftKey(event, pressedInInputText = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }
    onDeleteKey(event) {
        if (this.showClear) {
            this.clear(event);
            event.preventDefault();
        }
    }
    onHomeKey(event, pressedInInputText = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;
            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            }
            else {
                target.setSelectionRange(0, 0);
                this.focusedOptionIndex.set(-1);
            }
        }
        else {
            this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());
            !this.overlayVisible && this.show();
        }
        event.preventDefault();
    }
    onEndKey(event, pressedInInputText = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;
            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            }
            else {
                const len = target.value.length;
                target.setSelectionRange(len, len);
                this.focusedOptionIndex.set(-1);
            }
        }
        else {
            this.changeFocusedOptionIndex(event, this.findLastOptionIndex());
            !this.overlayVisible && this.show();
        }
        event.preventDefault();
    }
    onPageDownKey(event) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }
    onPageUpKey(event) {
        this.scrollInView(0);
        event.preventDefault();
    }
    onSpaceKey(event, pressedInInputText = false) {
        !this.editable && !pressedInInputText && this.onEnterKey(event);
    }
    onEnterKey(event, pressedInInput = false) {
        if (!this.overlayVisible) {
            this.focusedOptionIndex.set(-1);
            this.onArrowDownKey(event);
        }
        else {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }
            !pressedInInput && this.hide();
        }
        event.preventDefault();
    }
    onEscapeKey(event) {
        if (this.overlayVisible) {
            this.hide(true);
            event.preventDefault();
            event.stopPropagation();
        }
    }
    onTabKey(event, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.overlayVisible && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay?.nativeElement : this.firstHiddenFocusableElementOnOverlay?.nativeElement);
                event.preventDefault();
            }
            else {
                if (this.focusedOptionIndex() !== -1 && this.overlayVisible) {
                    const option = this.visibleOptions()[this.focusedOptionIndex()];
                    this.onOptionSelect(event, option);
                }
                this.overlayVisible && this.hide(this.filter);
            }
        }
        event.stopPropagation();
    }
    onFirstHiddenFocus(event) {
        const focusableEl = event.relatedTarget === this.focusInputViewChild?.nativeElement ? getFirstFocusableElement(this.overlayViewChild?.el?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInputViewChild?.nativeElement;
        focus(focusableEl);
    }
    onLastHiddenFocus(event) {
        const focusableEl = event.relatedTarget === this.focusInputViewChild?.nativeElement ? getLastFocusableElement(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInputViewChild?.nativeElement;
        focus(focusableEl);
    }
    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }
    onBackspaceKey(event, pressedInInputText = false) {
        if (pressedInInputText) {
            !this.overlayVisible && this.show();
        }
    }
    searchFields() {
        return this.filterBy?.split(',') || this.filterFields || [this.optionLabel];
    }
    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;
        let optionIndex = -1;
        let matched = false;
        optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));
        if (optionIndex !== -1) {
            matched = true;
        }
        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }
        if (optionIndex !== -1) {
            setTimeout(() => {
                this.changeFocusedOptionIndex(event, optionIndex);
            });
        }
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            this.searchValue = '';
            this.searchTimeout = null;
        }, 500);
        return matched;
    }
    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale));
    }
    onFilterInputChange(event) {
        let value = event.target.value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });
        !this.virtualScrollerDisabled && this.scroller?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild?.alignOverlay();
        });
        this.cd.markForCheck();
    }
    applyFocus() {
        if (this.editable)
            findSingle(this.el.nativeElement, '[data-pc-section="label"]').focus();
        else
            focus(this.focusInputViewChild?.nativeElement);
    }
    /**
     * Applies focus.
     * @group Method
     */
    focus() {
        this.applyFocus();
    }
    /**
     * Clears the model.
     * @group Method
     */
    clear(event) {
        this.updateModel(null, event);
        this.clearEditableLabel();
        this.onModelTouched();
        this.onChange.emit({ originalEvent: event, value: this.value });
        this.onClear.emit(event);
        this.resetFilter();
    }
    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value, setModelValue) {
        if (this.filter) {
            this.resetFilter();
        }
        this.value = value;
        this.allowModelChange() && this.onModelChange(value);
        setModelValue(this.value);
        this.updateEditableLabel();
        this.cd.markForCheck();
    }
    get containerDataP() {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused,
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            [this.size()]: this.size()
        });
    }
    get labelDataP() {
        return this.cn({
            placeholder: this.label === this.placeholder,
            clearable: this.showClear,
            disabled: this.$disabled(),
            [this.size()]: this.size(),
            empty: !this.editable && !this.selectedItemTemplate && (!this.label?.() || this.label() === 'p-emptylabel' || this.label()?.length === 0)
        });
    }
    get dropdownIconDataP() {
        return this.cn({
            [this.size()]: this.size()
        });
    }
    get overlayDataP() {
        return this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: Select, deps: [{ token: i0.NgZone }, { token: i3.FilterService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.5", type: Select, isStandalone: true, selector: "p-select", inputs: { id: { classPropertyName: "id", publicName: "id", isSignal: false, isRequired: false, transformFunction: null }, scrollHeight: { classPropertyName: "scrollHeight", publicName: "scrollHeight", isSignal: false, isRequired: false, transformFunction: null }, filter: { classPropertyName: "filter", publicName: "filter", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, panelStyle: { classPropertyName: "panelStyle", publicName: "panelStyle", isSignal: false, isRequired: false, transformFunction: null }, styleClass: { classPropertyName: "styleClass", publicName: "styleClass", isSignal: false, isRequired: false, transformFunction: null }, panelStyleClass: { classPropertyName: "panelStyleClass", publicName: "panelStyleClass", isSignal: false, isRequired: false, transformFunction: null }, readonly: { classPropertyName: "readonly", publicName: "readonly", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, editable: { classPropertyName: "editable", publicName: "editable", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, tabindex: { classPropertyName: "tabindex", publicName: "tabindex", isSignal: false, isRequired: false, transformFunction: numberAttribute }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: false, isRequired: false, transformFunction: null }, loadingIcon: { classPropertyName: "loadingIcon", publicName: "loadingIcon", isSignal: false, isRequired: false, transformFunction: null }, filterPlaceholder: { classPropertyName: "filterPlaceholder", publicName: "filterPlaceholder", isSignal: false, isRequired: false, transformFunction: null }, filterLocale: { classPropertyName: "filterLocale", publicName: "filterLocale", isSignal: false, isRequired: false, transformFunction: null }, inputId: { classPropertyName: "inputId", publicName: "inputId", isSignal: false, isRequired: false, transformFunction: null }, dataKey: { classPropertyName: "dataKey", publicName: "dataKey", isSignal: false, isRequired: false, transformFunction: null }, filterBy: { classPropertyName: "filterBy", publicName: "filterBy", isSignal: false, isRequired: false, transformFunction: null }, filterFields: { classPropertyName: "filterFields", publicName: "filterFields", isSignal: false, isRequired: false, transformFunction: null }, autofocus: { classPropertyName: "autofocus", publicName: "autofocus", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, resetFilterOnHide: { classPropertyName: "resetFilterOnHide", publicName: "resetFilterOnHide", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, checkmark: { classPropertyName: "checkmark", publicName: "checkmark", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, dropdownIcon: { classPropertyName: "dropdownIcon", publicName: "dropdownIcon", isSignal: false, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, optionLabel: { classPropertyName: "optionLabel", publicName: "optionLabel", isSignal: false, isRequired: false, transformFunction: null }, optionValue: { classPropertyName: "optionValue", publicName: "optionValue", isSignal: false, isRequired: false, transformFunction: null }, optionDisabled: { classPropertyName: "optionDisabled", publicName: "optionDisabled", isSignal: false, isRequired: false, transformFunction: null }, optionGroupLabel: { classPropertyName: "optionGroupLabel", publicName: "optionGroupLabel", isSignal: false, isRequired: false, transformFunction: null }, optionGroupChildren: { classPropertyName: "optionGroupChildren", publicName: "optionGroupChildren", isSignal: false, isRequired: false, transformFunction: null }, group: { classPropertyName: "group", publicName: "group", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, showClear: { classPropertyName: "showClear", publicName: "showClear", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, emptyFilterMessage: { classPropertyName: "emptyFilterMessage", publicName: "emptyFilterMessage", isSignal: false, isRequired: false, transformFunction: null }, emptyMessage: { classPropertyName: "emptyMessage", publicName: "emptyMessage", isSignal: false, isRequired: false, transformFunction: null }, lazy: { classPropertyName: "lazy", publicName: "lazy", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, virtualScroll: { classPropertyName: "virtualScroll", publicName: "virtualScroll", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, virtualScrollItemSize: { classPropertyName: "virtualScrollItemSize", publicName: "virtualScrollItemSize", isSignal: false, isRequired: false, transformFunction: numberAttribute }, virtualScrollOptions: { classPropertyName: "virtualScrollOptions", publicName: "virtualScrollOptions", isSignal: false, isRequired: false, transformFunction: null }, overlayOptions: { classPropertyName: "overlayOptions", publicName: "overlayOptions", isSignal: false, isRequired: false, transformFunction: null }, ariaFilterLabel: { classPropertyName: "ariaFilterLabel", publicName: "ariaFilterLabel", isSignal: false, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: false, isRequired: false, transformFunction: null }, ariaLabelledBy: { classPropertyName: "ariaLabelledBy", publicName: "ariaLabelledBy", isSignal: false, isRequired: false, transformFunction: null }, filterMatchMode: { classPropertyName: "filterMatchMode", publicName: "filterMatchMode", isSignal: false, isRequired: false, transformFunction: null }, tooltip: { classPropertyName: "tooltip", publicName: "tooltip", isSignal: false, isRequired: false, transformFunction: null }, tooltipPosition: { classPropertyName: "tooltipPosition", publicName: "tooltipPosition", isSignal: false, isRequired: false, transformFunction: null }, tooltipPositionStyle: { classPropertyName: "tooltipPositionStyle", publicName: "tooltipPositionStyle", isSignal: false, isRequired: false, transformFunction: null }, tooltipStyleClass: { classPropertyName: "tooltipStyleClass", publicName: "tooltipStyleClass", isSignal: false, isRequired: false, transformFunction: null }, focusOnHover: { classPropertyName: "focusOnHover", publicName: "focusOnHover", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, selectOnFocus: { classPropertyName: "selectOnFocus", publicName: "selectOnFocus", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, autoOptionFocus: { classPropertyName: "autoOptionFocus", publicName: "autoOptionFocus", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, autofocusFilter: { classPropertyName: "autofocusFilter", publicName: "autofocusFilter", isSignal: false, isRequired: false, transformFunction: booleanAttribute }, filterValue: { classPropertyName: "filterValue", publicName: "filterValue", isSignal: false, isRequired: false, transformFunction: null }, options: { classPropertyName: "options", publicName: "options", isSignal: false, isRequired: false, transformFunction: null }, appendTo: { classPropertyName: "appendTo", publicName: "appendTo", isSignal: true, isRequired: false, transformFunction: null }, motionOptions: { classPropertyName: "motionOptions", publicName: "motionOptions", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { onChange: "onChange", onFilter: "onFilter", onFocus: "onFocus", onBlur: "onBlur", onClick: "onClick", onShow: "onShow", onHide: "onHide", onClear: "onClear", onLazyLoad: "onLazyLoad" }, host: { listeners: { "click": "onContainerClick($event)" }, properties: { "class": "cn(cx('root'), styleClass)", "attr.id": "id", "attr.data-p": "containerDataP" } }, providers: [SELECT_VALUE_ACCESSOR, SelectStyle, { provide: SELECT_INSTANCE, useExisting: Select }, { provide: PARENT_INSTANCE, useExisting: Select }], queries: [{ propertyName: "itemTemplate", first: true, predicate: ["item"] }, { propertyName: "groupTemplate", first: true, predicate: ["group"] }, { propertyName: "loaderTemplate", first: true, predicate: ["loader"] }, { propertyName: "selectedItemTemplate", first: true, predicate: ["selectedItem"] }, { propertyName: "headerTemplate", first: true, predicate: ["header"] }, { propertyName: "filterTemplate", first: true, predicate: ["filter"] }, { propertyName: "footerTemplate", first: true, predicate: ["footer"] }, { propertyName: "emptyFilterTemplate", first: true, predicate: ["emptyfilter"] }, { propertyName: "emptyTemplate", first: true, predicate: ["empty"] }, { propertyName: "dropdownIconTemplate", first: true, predicate: ["dropdownicon"] }, { propertyName: "loadingIconTemplate", first: true, predicate: ["loadingicon"] }, { propertyName: "clearIconTemplate", first: true, predicate: ["clearicon"] }, { propertyName: "filterIconTemplate", first: true, predicate: ["filtericon"] }, { propertyName: "onIconTemplate", first: true, predicate: ["onicon"] }, { propertyName: "offIconTemplate", first: true, predicate: ["officon"] }, { propertyName: "cancelIconTemplate", first: true, predicate: ["cancelicon"] }, { propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "filterViewChild", first: true, predicate: ["filter"], descendants: true }, { propertyName: "focusInputViewChild", first: true, predicate: ["focusInput"], descendants: true }, { propertyName: "editableInputViewChild", first: true, predicate: ["editableInput"], descendants: true }, { propertyName: "itemsViewChild", first: true, predicate: ["items"], descendants: true }, { propertyName: "scroller", first: true, predicate: ["scroller"], descendants: true }, { propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }, { propertyName: "firstHiddenFocusableElementOnOverlay", first: true, predicate: ["firstHiddenFocusableEl"], descendants: true }, { propertyName: "lastHiddenFocusableElementOnOverlay", first: true, predicate: ["lastHiddenFocusableEl"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i2.Bind }], ngImport: i0, template: `
        <span
            #focusInput
            [class]="cx('label')"
            *ngIf="!editable"
            [pBind]="ptm('label')"
            [pTooltip]="tooltip"
            [pTooltipUnstyled]="unstyled()"
            [tooltipPosition]="tooltipPosition"
            [positionStyle]="tooltipPositionStyle"
            [tooltipStyleClass]="tooltipStyleClass"
            [attr.aria-disabled]="$disabled()"
            [attr.id]="inputId"
            role="combobox"
            [attr.aria-label]="ariaLabel || (label() === 'p-emptylabel' ? undefined : label())"
            [attr.aria-labelledby]="ariaLabelledBy"
            [attr.aria-haspopup]="'listbox'"
            [attr.aria-expanded]="overlayVisible ?? false"
            [attr.aria-controls]="overlayVisible ? id + '_list' : null"
            [attr.tabindex]="!$disabled() ? tabindex : -1"
            [pAutoFocus]="autofocus"
            [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (keydown)="onKeyDown($event)"
            [attr.aria-required]="required()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.data-p]="labelDataP"
        >
            <ng-container *ngIf="!selectedItemTemplate && !_selectedItemTemplate; else defaultPlaceholder">{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</ng-container>
            <ng-container *ngIf="(selectedItemTemplate || _selectedItemTemplate) && !isSelectedOptionEmpty()" [ngTemplateOutlet]="selectedItemTemplate || _selectedItemTemplate" [ngTemplateOutletContext]="{ $implicit: selectedOption }"></ng-container>
            <ng-template #defaultPlaceholder>
                <span *ngIf="isSelectedOptionEmpty()">{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</span>
            </ng-template>
        </span>
        <input
            *ngIf="editable"
            #editableInput
            type="text"
            [attr.id]="inputId"
            [class]="cx('label')"
            [pBind]="ptm('label')"
            [attr.aria-haspopup]="'listbox'"
            [attr.placeholder]="modelValue() === undefined || modelValue() === null ? placeholder() : undefined"
            [attr.aria-label]="ariaLabel || (label() === 'p-emptylabel' ? undefined : label())"
            (input)="onEditableInput($event)"
            (keydown)="onKeyDown($event)"
            [pAutoFocus]="autofocus"
            [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            [attr.name]="name()"
            [attr.minlength]="minlength()"
            [attr.min]="min()"
            [attr.max]="max()"
            [attr.pattern]="pattern()"
            [attr.size]="inputSize()"
            [attr.maxlength]="maxlength()"
            [attr.required]="required() ? '' : undefined"
            [attr.readonly]="readonly ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.data-p]="labelDataP"
        />
        <ng-container *ngIf="isVisibleClearIcon">
            <svg data-p-icon="times" [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" *ngIf="!clearIconTemplate && !_clearIconTemplate" [attr.data-pc-section]="'clearicon'" />
            <span [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" *ngIf="clearIconTemplate || _clearIconTemplate" [attr.data-pc-section]="'clearicon'">
                <ng-template *ngTemplateOutlet="clearIconTemplate || _clearIconTemplate; context: { class: cx('clearIcon') }"></ng-template>
            </span>
        </ng-container>

        <div [class]="cx('dropdown')" [pBind]="ptm('dropdown')" role="button" aria-label="dropdown trigger" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible ?? false" [attr.data-pc-section]="'trigger'">
            <ng-container *ngIf="loading; else elseBlock">
                <ng-container *ngIf="loadingIconTemplate || _loadingIconTemplate">
                    <ng-container *ngTemplateOutlet="loadingIconTemplate || _loadingIconTemplate"></ng-container>
                </ng-container>
                <ng-container *ngIf="!loadingIconTemplate && !_loadingIconTemplate">
                    <span *ngIf="loadingIcon" [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon)" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                    <span *ngIf="!loadingIcon" [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                </ng-container>
            </ng-container>

            <ng-template #elseBlock>
                <ng-container *ngIf="!dropdownIconTemplate && !_dropdownIconTemplate">
                    <span [class]="cn(cx('dropdownIcon'), dropdownIcon)" [pBind]="ptm('dropdownIcon')" *ngIf="dropdownIcon"></span>
                    <svg data-p-icon="chevron-down" *ngIf="!dropdownIcon" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" />
                </ng-container>
                <span *ngIf="dropdownIconTemplate || _dropdownIconTemplate" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')">
                    <ng-template *ngTemplateOutlet="dropdownIconTemplate || _dropdownIconTemplate; context: { class: cx('dropdownIcon') }"></ng-template>
                </span>
            </ng-template>
        </div>

        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="hide()"
        >
            <ng-template #content>
                <div [class]="cn(cx('overlay'), panelStyleClass)" [ngStyle]="panelStyle" [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('hiddenFirstFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate || _headerTemplate"></ng-container>
                    <div [class]="cx('header')" *ngIf="filter" (click)="$event.stopPropagation()" [pBind]="ptm('header')">
                        <ng-container *ngIf="filterTemplate || _filterTemplate; else builtInFilterElement">
                            <ng-container *ngTemplateOutlet="filterTemplate || _filterTemplate; context: { options: filterOptions }"></ng-container>
                        </ng-container>
                        <ng-template #builtInFilterElement>
                            <p-iconfield [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                                <input
                                    #filter
                                    pInputText
                                    [pSize]="size()"
                                    type="text"
                                    role="searchbox"
                                    autocomplete="off"
                                    [value]="_filterValue() || ''"
                                    [class]="cx('pcFilter')"
                                    [variant]="$variant()"
                                    [attr.placeholder]="filterPlaceholder"
                                    [attr.aria-owns]="id + '_list'"
                                    (input)="onFilterInputChange($event)"
                                    [attr.aria-label]="ariaFilterLabel"
                                    [attr.aria-activedescendant]="focusedOptionId"
                                    (keydown)="onFilterKeyDown($event)"
                                    (blur)="onFilterBlur($event)"
                                    [pt]="ptm('pcFilter')"
                                    [unstyled]="unstyled()"
                                />
                                <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                    <svg data-p-icon="search" *ngIf="!filterIconTemplate && !_filterIconTemplate" [pBind]="ptm('filterIcon')" />
                                    <span *ngIf="filterIconTemplate || _filterIconTemplate" [pBind]="ptm('filterIcon')">
                                        <ng-template *ngTemplateOutlet="filterIconTemplate || _filterIconTemplate"></ng-template>
                                    </span>
                                </p-inputicon>
                            </p-iconfield>
                        </ng-template>
                    </div>
                    <div [class]="cx('listContainer')" [style.max-height]="virtualScroll ? 'auto' : scrollHeight || 'auto'" [pBind]="ptm('listContainer')">
                        <p-scroller
                            *ngIf="virtualScroll"
                            hostName="select"
                            #scroller
                            [items]="visibleOptions()"
                            [style]="{ height: scrollHeight }"
                            [itemSize]="virtualScrollItemSize"
                            [autoSize]="true"
                            [lazy]="lazy"
                            (onLazyLoad)="onLazyLoad.emit($event)"
                            [options]="virtualScrollOptions"
                            [pt]="ptm('virtualScroller')"
                        >
                            <ng-template #content let-items let-scrollerOptions="options">
                                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                            </ng-template>
                            <ng-container *ngIf="loaderTemplate || _loaderTemplate">
                                <ng-template #loader let-scrollerOptions="options">
                                    <ng-container *ngTemplateOutlet="loaderTemplate || _loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                                </ng-template>
                            </ng-container>
                        </p-scroller>
                        <ng-container *ngIf="!virtualScroll">
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                        </ng-container>

                        <ng-template #buildInItems let-items let-scrollerOptions="options">
                            <ul #items [attr.id]="id + '_list'" [attr.aria-label]="listLabel" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [pBind]="ptm('list')">
                                <ng-template ngFor let-option [ngForOf]="items" let-i="index">
                                    <ng-container *ngIf="isOptionGroup(option)">
                                        <li [class]="cx('optionGroup')" [attr.id]="id + '_' + getOptionIndex(i, scrollerOptions)" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('optionGroup')">
                                            <span *ngIf="!groupTemplate && !_groupTemplate" [class]="cx('optionGroupLabel')" [pBind]="ptm('optionGroupLabel')">{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            <ng-container *ngTemplateOutlet="groupTemplate || _groupTemplate; context: { $implicit: option.optionGroup }"></ng-container>
                                        </li>
                                    </ng-container>
                                    <ng-container *ngIf="!isOptionGroup(option)">
                                        <p-selectItem
                                            [id]="id + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [checkmark]="checkmark"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="itemTemplate || _itemTemplate"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize"
                                            [index]="i"
                                            [unstyled]="unstyled()"
                                            [scrollerOptions]="scrollerOptions"
                                            (onClick)="onOptionSelect($event, option)"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                        ></p-selectItem>
                                    </ng-container>
                                </ng-template>
                                <li *ngIf="filterValue && isEmpty()" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                    @if (!emptyFilterTemplate && !_emptyFilterTemplate && !emptyTemplate) {
                                        {{ emptyFilterMessageLabel }}
                                    } @else {
                                        <ng-container #emptyFilter *ngTemplateOutlet="emptyFilterTemplate || _emptyFilterTemplate || emptyTemplate || _emptyTemplate"></ng-container>
                                    }
                                </li>
                                <li *ngIf="!filterValue && isEmpty()" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                    @if (!emptyTemplate && !_emptyTemplate) {
                                        {{ emptyMessageLabel || emptyFilterMessageLabel }}
                                    } @else {
                                        <ng-container #empty *ngTemplateOutlet="emptyTemplate || _emptyTemplate"></ng-container>
                                    }
                                </li>
                            </ul>
                        </ng-template>
                    </div>
                    <ng-container *ngTemplateOutlet="footerTemplate || _footerTemplate"></ng-container>
                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [pBind]="ptm('hiddenLastFocusableEl')"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: SelectItem, selector: "p-selectItem", inputs: ["id", "option", "selected", "focused", "label", "disabled", "visible", "itemSize", "ariaPosInset", "ariaSetSize", "template", "checkmark", "index", "scrollerOptions"], outputs: ["onClick", "onMouseEnter"] }, { kind: "component", type: Overlay, selector: "p-overlay", inputs: ["hostName", "visible", "mode", "style", "styleClass", "contentStyle", "contentStyleClass", "target", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "listener", "responsive", "options", "appendTo", "inline", "motionOptions", "hostAttrSelector"], outputs: ["visibleChange", "onBeforeShow", "onShow", "onBeforeHide", "onHide", "onAnimationStart", "onAnimationDone", "onBeforeEnter", "onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"] }, { kind: "directive", type: Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions", "appendTo", "ptTooltip", "pTooltipPT", "pTooltipUnstyled"] }, { kind: "directive", type: AutoFocus, selector: "[pAutoFocus]", inputs: ["pAutoFocus"] }, { kind: "component", type: TimesIcon, selector: "[data-p-icon=\"times\"]" }, { kind: "component", type: ChevronDownIcon, selector: "[data-p-icon=\"chevron-down\"]" }, { kind: "component", type: SearchIcon, selector: "[data-p-icon=\"search\"]" }, { kind: "directive", type: InputText, selector: "[pInputText]", inputs: ["hostName", "ptInputText", "pInputTextPT", "pInputTextUnstyled", "pSize", "variant", "fluid", "invalid"] }, { kind: "component", type: IconField, selector: "p-iconfield, p-iconField, p-icon-field", inputs: ["hostName", "iconPosition", "styleClass"] }, { kind: "component", type: InputIcon, selector: "p-inputicon, p-inputIcon", inputs: ["hostName", "styleClass"] }, { kind: "component", type: Scroller, selector: "p-scroller, p-virtualscroller, p-virtual-scroller, p-virtualScroller", inputs: ["hostName", "id", "style", "styleClass", "tabindex", "items", "itemSize", "scrollHeight", "scrollWidth", "orientation", "step", "delay", "resizeDelay", "appendOnly", "inline", "lazy", "disabled", "loaderDisabled", "columns", "showSpacer", "showLoader", "numToleratedItems", "loading", "autoSize", "trackBy", "options"], outputs: ["onLazyLoad", "onScroll", "onScrollIndexChange"] }, { kind: "ngmodule", type: SharedModule }, { kind: "ngmodule", type: BindModule }, { kind: "directive", type: i2.Bind, selector: "[pBind]", inputs: ["pBind"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: Select, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-select',
                    standalone: true,
                    imports: [CommonModule, SelectItem, Overlay, Tooltip, AutoFocus, TimesIcon, ChevronDownIcon, SearchIcon, InputText, IconField, InputIcon, Scroller, SharedModule, BindModule],
                    template: `
        <span
            #focusInput
            [class]="cx('label')"
            *ngIf="!editable"
            [pBind]="ptm('label')"
            [pTooltip]="tooltip"
            [pTooltipUnstyled]="unstyled()"
            [tooltipPosition]="tooltipPosition"
            [positionStyle]="tooltipPositionStyle"
            [tooltipStyleClass]="tooltipStyleClass"
            [attr.aria-disabled]="$disabled()"
            [attr.id]="inputId"
            role="combobox"
            [attr.aria-label]="ariaLabel || (label() === 'p-emptylabel' ? undefined : label())"
            [attr.aria-labelledby]="ariaLabelledBy"
            [attr.aria-haspopup]="'listbox'"
            [attr.aria-expanded]="overlayVisible ?? false"
            [attr.aria-controls]="overlayVisible ? id + '_list' : null"
            [attr.tabindex]="!$disabled() ? tabindex : -1"
            [pAutoFocus]="autofocus"
            [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (keydown)="onKeyDown($event)"
            [attr.aria-required]="required()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.data-p]="labelDataP"
        >
            <ng-container *ngIf="!selectedItemTemplate && !_selectedItemTemplate; else defaultPlaceholder">{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</ng-container>
            <ng-container *ngIf="(selectedItemTemplate || _selectedItemTemplate) && !isSelectedOptionEmpty()" [ngTemplateOutlet]="selectedItemTemplate || _selectedItemTemplate" [ngTemplateOutletContext]="{ $implicit: selectedOption }"></ng-container>
            <ng-template #defaultPlaceholder>
                <span *ngIf="isSelectedOptionEmpty()">{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</span>
            </ng-template>
        </span>
        <input
            *ngIf="editable"
            #editableInput
            type="text"
            [attr.id]="inputId"
            [class]="cx('label')"
            [pBind]="ptm('label')"
            [attr.aria-haspopup]="'listbox'"
            [attr.placeholder]="modelValue() === undefined || modelValue() === null ? placeholder() : undefined"
            [attr.aria-label]="ariaLabel || (label() === 'p-emptylabel' ? undefined : label())"
            (input)="onEditableInput($event)"
            (keydown)="onKeyDown($event)"
            [pAutoFocus]="autofocus"
            [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            [attr.name]="name()"
            [attr.minlength]="minlength()"
            [attr.min]="min()"
            [attr.max]="max()"
            [attr.pattern]="pattern()"
            [attr.size]="inputSize()"
            [attr.maxlength]="maxlength()"
            [attr.required]="required() ? '' : undefined"
            [attr.readonly]="readonly ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.data-p]="labelDataP"
        />
        <ng-container *ngIf="isVisibleClearIcon">
            <svg data-p-icon="times" [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" *ngIf="!clearIconTemplate && !_clearIconTemplate" [attr.data-pc-section]="'clearicon'" />
            <span [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" *ngIf="clearIconTemplate || _clearIconTemplate" [attr.data-pc-section]="'clearicon'">
                <ng-template *ngTemplateOutlet="clearIconTemplate || _clearIconTemplate; context: { class: cx('clearIcon') }"></ng-template>
            </span>
        </ng-container>

        <div [class]="cx('dropdown')" [pBind]="ptm('dropdown')" role="button" aria-label="dropdown trigger" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible ?? false" [attr.data-pc-section]="'trigger'">
            <ng-container *ngIf="loading; else elseBlock">
                <ng-container *ngIf="loadingIconTemplate || _loadingIconTemplate">
                    <ng-container *ngTemplateOutlet="loadingIconTemplate || _loadingIconTemplate"></ng-container>
                </ng-container>
                <ng-container *ngIf="!loadingIconTemplate && !_loadingIconTemplate">
                    <span *ngIf="loadingIcon" [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon)" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                    <span *ngIf="!loadingIcon" [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                </ng-container>
            </ng-container>

            <ng-template #elseBlock>
                <ng-container *ngIf="!dropdownIconTemplate && !_dropdownIconTemplate">
                    <span [class]="cn(cx('dropdownIcon'), dropdownIcon)" [pBind]="ptm('dropdownIcon')" *ngIf="dropdownIcon"></span>
                    <svg data-p-icon="chevron-down" *ngIf="!dropdownIcon" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" />
                </ng-container>
                <span *ngIf="dropdownIconTemplate || _dropdownIconTemplate" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')">
                    <ng-template *ngTemplateOutlet="dropdownIconTemplate || _dropdownIconTemplate; context: { class: cx('dropdownIcon') }"></ng-template>
                </span>
            </ng-template>
        </div>

        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="hide()"
        >
            <ng-template #content>
                <div [class]="cn(cx('overlay'), panelStyleClass)" [ngStyle]="panelStyle" [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('hiddenFirstFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate || _headerTemplate"></ng-container>
                    <div [class]="cx('header')" *ngIf="filter" (click)="$event.stopPropagation()" [pBind]="ptm('header')">
                        <ng-container *ngIf="filterTemplate || _filterTemplate; else builtInFilterElement">
                            <ng-container *ngTemplateOutlet="filterTemplate || _filterTemplate; context: { options: filterOptions }"></ng-container>
                        </ng-container>
                        <ng-template #builtInFilterElement>
                            <p-iconfield [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                                <input
                                    #filter
                                    pInputText
                                    [pSize]="size()"
                                    type="text"
                                    role="searchbox"
                                    autocomplete="off"
                                    [value]="_filterValue() || ''"
                                    [class]="cx('pcFilter')"
                                    [variant]="$variant()"
                                    [attr.placeholder]="filterPlaceholder"
                                    [attr.aria-owns]="id + '_list'"
                                    (input)="onFilterInputChange($event)"
                                    [attr.aria-label]="ariaFilterLabel"
                                    [attr.aria-activedescendant]="focusedOptionId"
                                    (keydown)="onFilterKeyDown($event)"
                                    (blur)="onFilterBlur($event)"
                                    [pt]="ptm('pcFilter')"
                                    [unstyled]="unstyled()"
                                />
                                <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                    <svg data-p-icon="search" *ngIf="!filterIconTemplate && !_filterIconTemplate" [pBind]="ptm('filterIcon')" />
                                    <span *ngIf="filterIconTemplate || _filterIconTemplate" [pBind]="ptm('filterIcon')">
                                        <ng-template *ngTemplateOutlet="filterIconTemplate || _filterIconTemplate"></ng-template>
                                    </span>
                                </p-inputicon>
                            </p-iconfield>
                        </ng-template>
                    </div>
                    <div [class]="cx('listContainer')" [style.max-height]="virtualScroll ? 'auto' : scrollHeight || 'auto'" [pBind]="ptm('listContainer')">
                        <p-scroller
                            *ngIf="virtualScroll"
                            hostName="select"
                            #scroller
                            [items]="visibleOptions()"
                            [style]="{ height: scrollHeight }"
                            [itemSize]="virtualScrollItemSize"
                            [autoSize]="true"
                            [lazy]="lazy"
                            (onLazyLoad)="onLazyLoad.emit($event)"
                            [options]="virtualScrollOptions"
                            [pt]="ptm('virtualScroller')"
                        >
                            <ng-template #content let-items let-scrollerOptions="options">
                                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                            </ng-template>
                            <ng-container *ngIf="loaderTemplate || _loaderTemplate">
                                <ng-template #loader let-scrollerOptions="options">
                                    <ng-container *ngTemplateOutlet="loaderTemplate || _loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                                </ng-template>
                            </ng-container>
                        </p-scroller>
                        <ng-container *ngIf="!virtualScroll">
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                        </ng-container>

                        <ng-template #buildInItems let-items let-scrollerOptions="options">
                            <ul #items [attr.id]="id + '_list'" [attr.aria-label]="listLabel" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [pBind]="ptm('list')">
                                <ng-template ngFor let-option [ngForOf]="items" let-i="index">
                                    <ng-container *ngIf="isOptionGroup(option)">
                                        <li [class]="cx('optionGroup')" [attr.id]="id + '_' + getOptionIndex(i, scrollerOptions)" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('optionGroup')">
                                            <span *ngIf="!groupTemplate && !_groupTemplate" [class]="cx('optionGroupLabel')" [pBind]="ptm('optionGroupLabel')">{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            <ng-container *ngTemplateOutlet="groupTemplate || _groupTemplate; context: { $implicit: option.optionGroup }"></ng-container>
                                        </li>
                                    </ng-container>
                                    <ng-container *ngIf="!isOptionGroup(option)">
                                        <p-selectItem
                                            [id]="id + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [checkmark]="checkmark"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="itemTemplate || _itemTemplate"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize"
                                            [index]="i"
                                            [unstyled]="unstyled()"
                                            [scrollerOptions]="scrollerOptions"
                                            (onClick)="onOptionSelect($event, option)"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                        ></p-selectItem>
                                    </ng-container>
                                </ng-template>
                                <li *ngIf="filterValue && isEmpty()" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                    @if (!emptyFilterTemplate && !_emptyFilterTemplate && !emptyTemplate) {
                                        {{ emptyFilterMessageLabel }}
                                    } @else {
                                        <ng-container #emptyFilter *ngTemplateOutlet="emptyFilterTemplate || _emptyFilterTemplate || emptyTemplate || _emptyTemplate"></ng-container>
                                    }
                                </li>
                                <li *ngIf="!filterValue && isEmpty()" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                    @if (!emptyTemplate && !_emptyTemplate) {
                                        {{ emptyMessageLabel || emptyFilterMessageLabel }}
                                    } @else {
                                        <ng-container #empty *ngTemplateOutlet="emptyTemplate || _emptyTemplate"></ng-container>
                                    }
                                </li>
                            </ul>
                        </ng-template>
                    </div>
                    <ng-container *ngTemplateOutlet="footerTemplate || _footerTemplate"></ng-container>
                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [pBind]="ptm('hiddenLastFocusableEl')"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `,
                    host: {
                        '[class]': "cn(cx('root'), styleClass)",
                        '[attr.id]': 'id',
                        '[attr.data-p]': 'containerDataP',
                        '(click)': 'onContainerClick($event)'
                    },
                    providers: [SELECT_VALUE_ACCESSOR, SelectStyle, { provide: SELECT_INSTANCE, useExisting: Select }, { provide: PARENT_INSTANCE, useExisting: Select }],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    hostDirectives: [Bind]
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i3.FilterService }], propDecorators: { id: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], filter: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], panelStyle: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], readonly: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], editable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], placeholder: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], filterPlaceholder: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], inputId: [{
                type: Input
            }], dataKey: [{
                type: Input
            }], filterBy: [{
                type: Input
            }], filterFields: [{
                type: Input
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], resetFilterOnHide: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], checkmark: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], dropdownIcon: [{
                type: Input
            }], loading: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], optionLabel: [{
                type: Input
            }], optionValue: [{
                type: Input
            }], optionDisabled: [{
                type: Input
            }], optionGroupLabel: [{
                type: Input
            }], optionGroupChildren: [{
                type: Input
            }], group: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showClear: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], emptyFilterMessage: [{
                type: Input
            }], emptyMessage: [{
                type: Input
            }], lazy: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], virtualScroll: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], virtualScrollItemSize: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], virtualScrollOptions: [{
                type: Input
            }], overlayOptions: [{
                type: Input
            }], ariaFilterLabel: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], filterMatchMode: [{
                type: Input
            }], tooltip: [{
                type: Input
            }], tooltipPosition: [{
                type: Input
            }], tooltipPositionStyle: [{
                type: Input
            }], tooltipStyleClass: [{
                type: Input
            }], focusOnHover: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selectOnFocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], autoOptionFocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], autofocusFilter: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], filterValue: [{
                type: Input
            }], options: [{
                type: Input
            }], appendTo: [{ type: i0.Input, args: [{ isSignal: true, alias: "appendTo", required: false }] }], motionOptions: [{ type: i0.Input, args: [{ isSignal: true, alias: "motionOptions", required: false }] }], onChange: [{
                type: Output
            }], onFilter: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], onClick: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onLazyLoad: [{
                type: Output
            }], filterViewChild: [{
                type: ViewChild,
                args: ['filter']
            }], focusInputViewChild: [{
                type: ViewChild,
                args: ['focusInput']
            }], editableInputViewChild: [{
                type: ViewChild,
                args: ['editableInput']
            }], itemsViewChild: [{
                type: ViewChild,
                args: ['items']
            }], scroller: [{
                type: ViewChild,
                args: ['scroller']
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], firstHiddenFocusableElementOnOverlay: [{
                type: ViewChild,
                args: ['firstHiddenFocusableEl']
            }], lastHiddenFocusableElementOnOverlay: [{
                type: ViewChild,
                args: ['lastHiddenFocusableEl']
            }], itemTemplate: [{
                type: ContentChild,
                args: ['item', { descendants: false }]
            }], groupTemplate: [{
                type: ContentChild,
                args: ['group', { descendants: false }]
            }], loaderTemplate: [{
                type: ContentChild,
                args: ['loader', { descendants: false }]
            }], selectedItemTemplate: [{
                type: ContentChild,
                args: ['selectedItem', { descendants: false }]
            }], headerTemplate: [{
                type: ContentChild,
                args: ['header', { descendants: false }]
            }], filterTemplate: [{
                type: ContentChild,
                args: ['filter', { descendants: false }]
            }], footerTemplate: [{
                type: ContentChild,
                args: ['footer', { descendants: false }]
            }], emptyFilterTemplate: [{
                type: ContentChild,
                args: ['emptyfilter', { descendants: false }]
            }], emptyTemplate: [{
                type: ContentChild,
                args: ['empty', { descendants: false }]
            }], dropdownIconTemplate: [{
                type: ContentChild,
                args: ['dropdownicon', { descendants: false }]
            }], loadingIconTemplate: [{
                type: ContentChild,
                args: ['loadingicon', { descendants: false }]
            }], clearIconTemplate: [{
                type: ContentChild,
                args: ['clearicon', { descendants: false }]
            }], filterIconTemplate: [{
                type: ContentChild,
                args: ['filtericon', { descendants: false }]
            }], onIconTemplate: [{
                type: ContentChild,
                args: ['onicon', { descendants: false }]
            }], offIconTemplate: [{
                type: ContentChild,
                args: ['officon', { descendants: false }]
            }], cancelIconTemplate: [{
                type: ContentChild,
                args: ['cancelicon', { descendants: false }]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class SelectModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.5", ngImport: i0, type: SelectModule, imports: [Select, SharedModule], exports: [Select, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectModule, imports: [Select, SharedModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.5", ngImport: i0, type: SelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [Select, SharedModule],
                    exports: [Select, SharedModule]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { SELECT_VALUE_ACCESSOR, Select, SelectClasses, SelectItem, SelectModule, SelectStyle };
//# sourceMappingURL=primeng-select.mjs.map
