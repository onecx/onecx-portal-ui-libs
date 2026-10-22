import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component, ChangeDetectionStrategy } from '@angular/core'
import { By } from '@angular/platform-browser'
import { HarnessLoader } from '@onecx/angular-testing'
import { OcxTooltipDirective } from './tooltip.directive'
import { OcxTooltipHarness } from '@onecx/angular-accelerator/testing'

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
    <button
      class="ocx-tooltip-host ocx-tooltip-host1"
      type="button"
      [ocxTooltip]="tooltipText"
      [tooltipOptions]="tooltipOptions"
      tooltipPosition="top">
      Hover me
    </button>
  `
})
class TestHostComponent {
	tooltipText = 'Tooltip works!'
	tooltipOptions: any = {}
}

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
    <button
      class=" ocx-tooltip-host ocx-tooltip-host2"
      type="button"
      [ocxTooltip]="tooltipText"
      [tooltipOptions]="tooltipOptions"
      tooltipPosition="top">
      Hover me
    </button>
  `
})
class TestHostComponentNoID {
	tooltipText = 'Tooltip works!'
	tooltipOptions: any = { id: '    ' }
}

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
    <button
      class="ocx-tooltip-host ocx-tooltip-host4"
      type="button"
      [ocxTooltip]="tooltipText"
      tooltipPosition="top">
      Hover me 4
    </button>
  `
})
class TestHostComponentNull {
	tooltipText = 'Tooltip with null options'
}

const pressTab = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
    <button id="t-button" class="t-host" type="button" aria-describedby="existing-desc" [ocxTooltip]="text">B</button>
    <span id="existing-desc">existing</span>
    <input id="t-input" class="t-host" [ocxTooltip]="text" />
    <span id="t-span" class="t-host" tabindex="0" [ocxTooltip]="text">S</span>
    <button id="t-icon-btn" type="button"><i id="t-icon" class="pi pi-check t-host" [ocxTooltip]="text"></i></button>
    <table><tr><td id="t-cell" class="t-host" [ocxTooltip]="text"><a id="t-cell-first" href="#a">first</a> <a id="t-cell-link" href="#x">link</a></td></tr></table>
    <div id="t-anc" tabindex="0"><i id="t-ic1" [ocxTooltip]="'One'"></i><i id="t-ic2" [ocxTooltip]="'Two'"></i></div>
    <span id="t-wrapper" class="t-host" [ocxTooltip]="text"><button id="t-wrapped" type="button">W</button></span>
  `
})
class TemplatesHostComponent {
	text = 'Tooltip works!'
}

describe('OcxTooltip', () => {
	const HOST_SELECTOR_1 = '.ocx-tooltip-host1'
	const HOST_SELECTOR_2 = '.ocx-tooltip-host2'
	const HOST_SELECTOR_4 = '.ocx-tooltip-host4'
	const TOOLTIP_TEXT = 'Tooltip works!'
	const TOOLTIP_TEXT_NULL = 'Tooltip with null options'
	const CUSTOM_ID = 'custom-tooltip-id'

	let fixture: ComponentFixture<TestHostComponent>
	let loader: HarnessLoader

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestHostComponent, TestHostComponentNoID, TestHostComponentNull, TemplatesHostComponent],
			imports: [NoopAnimationsModule, OcxTooltipDirective]
		}).compileComponents()

		fixture = TestBed.createComponent(TestHostComponent)
		fixture.detectChanges()

		loader = TestbedHarnessEnvironment.loader(fixture)
	})

	const createFixture = <T>(component: any): { fixture: ComponentFixture<T>; loader: HarnessLoader } => {
		const componentFixture = TestBed.createComponent(component) as ComponentFixture<T>
		componentFixture.detectChanges()
		return {
			fixture: componentFixture,
			loader: TestbedHarnessEnvironment.loader(componentFixture)
		}
	}

	describe('Tooltip display', () => {

		it('should show tooltip on hover', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))

			await tooltip.hover()
			tick()
			fixture.detectChanges()

			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1))
			const hasCursorPointer = debugElement.styles['cursor'] === 'pointer'
			const directive = debugElement.injector.get(OcxTooltipDirective) as any

			expect(hasCursorPointer).toBeTruthy()
			expect(directive.ocxTooltip()).toBe(TOOLTIP_TEXT)
			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)
		}))

		it('should hide tooltip on unhover', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))

			await tooltip.hover()
			tick()
			fixture.detectChanges()

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)

			await tooltip.unhover()
			tick()
			fixture.detectChanges()

			expect(await tooltip.getTooltipText()).toBeNull()
		}))

		it('should show tooltip on focus and hide on Escape', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))
			const host = await tooltip.host()
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1))
			const directive = debugElement.injector.get(OcxTooltipDirective) as any

			for (const key of ['Escape', 'Esc']) {
				pressTab()
				await host.focus()
				await host.dispatchEvent('focusin')
				tick(200)
				fixture.detectChanges()

				expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)

				directive.container?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
				tick(500)
				fixture.detectChanges()

				expect(await tooltip.getTooltipText()).toBeNull()

				await host.blur()
				tick(200)
				fixture.detectChanges()
			}
		}))

		it('should show tooltip on focus and does not hide on enter', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))
			const host = await tooltip.host()
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1))
			const directive = debugElement.injector.get(OcxTooltipDirective) as any

			for (const key of ['Enter']) {
				pressTab()
				await host.focus()
				await host.dispatchEvent('focusin')
				tick(200)
				fixture.detectChanges()

				expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)

				directive.container?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
				tick(500)
				fixture.detectChanges()

				expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)

				await host.blur()
				tick(200)
				fixture.detectChanges()
			}
		}))
	})

	describe('ID and aria-describedby', () => {
		it('should add an ID in the tooltip and aria-describedby in the host element', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))

			await tooltip.hover()
			const host = await tooltip.host()
			const ariaDescribedBy = await host.getAttribute('aria-describedby')
			const tooltipId = await tooltip.getTooltipId()
			tick()
			fixture.detectChanges()

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)
			expect(ariaDescribedBy).toEqual(tooltipId)
		}))

		it('should add an ID in the tooltip and aria-describedby when an ID is provided in tooltipOptions', fakeAsync(async () => {
			const component = fixture.componentInstance as TestHostComponent
			component.tooltipOptions = { id: CUSTOM_ID }
			fixture.detectChanges()
			tick()

			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))

			await tooltip.hover()
			tick()
			fixture.detectChanges()

			const host = await tooltip.host()
			const ariaDescribedBy = await host.getAttribute('aria-describedby')
			const tooltipId = await tooltip.getTooltipId()

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)
			expect(ariaDescribedBy).toEqual(CUSTOM_ID)
			expect(tooltipId).toEqual(CUSTOM_ID)

			component.tooltipOptions = {}
		}))

		it('should add an ID in the tooltip and aria-describedby in the host element when no ID is provided', fakeAsync(async () => {
			const { fixture: fixture2, loader: loader2 } = createFixture(TestHostComponentNoID)

			const tooltip = await loader2.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_2))

			await tooltip.hover()
			const host = await tooltip.host()
			const ariaDescribedBy = await host.getAttribute('aria-describedby')
			const tooltipId = await tooltip.getTooltipId()
			tick()
			fixture2.detectChanges()

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT)
			expect(ariaDescribedBy).toEqual(tooltipId)
		}))

		it('should generate and reuse an ID in getOrCreateGeneratedId', () => {
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1))
			const directive = debugElement.injector.get(OcxTooltipDirective) as any

			const generatedId1 = directive.getOrCreateGeneratedId()
			const generatedId2 = directive.getOrCreateGeneratedId()

			expect(generatedId1).toMatch(/^ocx-tooltip-[a-z0-9]+-[a-z0-9]+$/)
			expect(generatedId2).toEqual(generatedId1)
		})

		it('should generate an ID when _tooltipOptions.id is null', fakeAsync(async () => {
			const { fixture: fixture4, loader: loader4 } = createFixture(TestHostComponentNull)

			const tooltip = await loader4.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_4))

			await tooltip.hover()
			tick()
			fixture4.detectChanges()

			const host = await tooltip.host()
			const ariaDescribedBy = await host.getAttribute('aria-describedby')
			const tooltipId = await tooltip.getTooltipId()

			const debugElement = fixture4.debugElement.query(By.css(HOST_SELECTOR_4))
			const directive = debugElement.injector.get(OcxTooltipDirective) as any
			expect(directive._tooltipOptions).toBeDefined()
			expect(directive._tooltipOptions?.id).toBeTruthy()

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT_NULL)
			expect(ariaDescribedBy).toEqual(tooltipId)
		}))
	})

	describe('Keyboard accessibility', () => {
		let tFixture: ComponentFixture<TemplatesHostComponent>

		const focusTarget = (id: string) => tFixture.nativeElement.querySelector('#' + id) as HTMLElement
		const tooltipInDom = () => document.querySelector('.p-tooltip') as HTMLElement | null

		beforeEach(() => {
			// reset the shared keyboard-modality state left over from earlier tests
			document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
			tFixture = TestBed.createComponent(TemplatesHostComponent)
			tFixture.detectChanges()
		})

		afterEach(() => {
			tFixture.destroy()
			document.querySelectorAll('.p-tooltip').forEach((e) => e.remove())
		})

		const keyboardFocus = (el: HTMLElement) => {
			pressTab()
			el.focus()
			el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
		}

		it.each([
			['button', 't-button', 't-button'],
			['input', 't-input', 't-input'],
			['span', 't-span', 't-span'],
			['icon', 't-icon-btn', 't-icon-btn'],
			['table cell', 't-cell-link', 't-cell-link'],
			['wrapper of a button', 't-wrapped', 't-wrapped']
		])('should show on keyboard focus and describe the focus target (%s)', fakeAsync((_name: string, focusId: string, describedId: string) => {
			const el = focusTarget(focusId)
			keyboardFocus(el)
			tick(500)

			const tooltip = tooltipInDom()
			expect(tooltip).toBeTruthy()
			expect(tooltip?.textContent).toContain('Tooltip works!')
			const describedBy = focusTarget(describedId).getAttribute('aria-describedby') ?? ''
			expect(describedBy.split(' ')).toContain(tooltip?.id)

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
			tick(500)
			expect(tooltipInDom()).toBeNull()
			expect(focusTarget(describedId).getAttribute('aria-describedby') ?? '').not.toContain('ocx-tooltip')
		}))

		it.each(['t-button', 't-input', 't-span', 't-icon-btn', 't-cell-link', 't-wrapped'])(
			'should not show on programmatic focus (e.g. dialog focus restore) (%s)',
			fakeAsync((id: string) => {
				const el = focusTarget(id)
				// no navigation key pressed: focus restored by script
				el.focus()
				el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
				tick(500)

				expect(tooltipInDom()).toBeNull()
			})
		)

		it('should not show on focus following a pointer press', fakeAsync(() => {
			pressTab()
			document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
			const el = focusTarget('t-button')
			el.focus()
			el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
			tick(500)

			expect(tooltipInDom()).toBeNull()
		}))

		it('should merge with existing aria-describedby ids and restore them on hide', fakeAsync(() => {
			const button = focusTarget('t-button')
			keyboardFocus(button)
			tick()

			const ids = button.getAttribute('aria-describedby')?.split(' ') ?? []
			expect(ids[0]).toBe('existing-desc')
			expect(ids).toHaveLength(2)
			expect(document.getElementById(ids[1])).toBeTruthy()

			button.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
			tick()
			expect(button.getAttribute('aria-describedby')).toBe('existing-desc')
		}))

		it('should not leave a dangling aria-describedby while the tooltip is hidden', () => {
			expect(focusTarget('t-input').hasAttribute('aria-describedby')).toBe(false)
		})

		it('should only show the tooltip of an icon when its focusable ancestor itself is focused', fakeAsync(() => {
			const anc = focusTarget('t-anc')
			keyboardFocus(anc)
			tick()
			const texts = Array.from(document.querySelectorAll('.p-tooltip-text')).map((e) => e.textContent)
			expect(texts.sort()).toEqual(['One', 'Two'])
			expect(anc.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
		}))

		it('should not show a host tooltip for focus on an unrelated element nested in a decorative ancestor', fakeAsync(() => {
			const anc = focusTarget('t-anc')
			const inner = document.createElement('button')
			anc.appendChild(inner)
			keyboardFocus(inner)
			tick()
			expect(tooltipInDom()).toBeNull()
		}))

		it('should describe the focused element, not the first focusable descendant', fakeAsync(() => {
			const second = focusTarget('t-cell-link')
			keyboardFocus(second)
			tick()
			expect(second.getAttribute('aria-describedby')).toContain('tooltip')
			expect(focusTarget('t-cell-first').hasAttribute('aria-describedby')).toBe(false)
		}))

		it('should remove focus listeners and the description on destroy', fakeAsync(() => {
			const button = focusTarget('t-button')
			keyboardFocus(button)
			tick()
			tFixture.destroy()
			expect(button.getAttribute('aria-describedby')).toBe('existing-desc')
			keyboardFocus(button)
			tick()
			expect(tooltipInDom()).toBeNull()
		}))

		it('should stay open when the pointer moves from the host onto the tooltip', fakeAsync(() => {
			const button = focusTarget('t-button')
			button.dispatchEvent(new MouseEvent('mouseenter'))
			tick()
			const tooltip = tooltipInDom() as HTMLElement
			expect(tooltip).toBeTruthy()
			button.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: tooltip }))
			tick(500)
			expect(tooltipInDom()).toBeTruthy()
		}))

		it('should keep the tooltip hoverable (pointer may move onto it)', fakeAsync(() => {
			keyboardFocus(focusTarget('t-button'))
			tick()

			expect(tooltipInDom()?.style.pointerEvents).toBe('unset')
		}))
	})

	describe('Tooltip internals', () => {
		it('should set resolved ID to the auto-generated ID of the OCX tooltip', () => {
			const { fixture: fixture4 } = createFixture(TestHostComponentNull)
			const debugElement = fixture4.debugElement.query(By.css(HOST_SELECTOR_4))
			const directive = debugElement.injector.get(OcxTooltipDirective) as any
			directive._tooltipOptions = null

			directive.ensureIdAndAriaDescribedBy()

			expect(directive.resolvedId).toMatch(/^ocx-tooltip-[a-z0-9]+-[a-z0-9]+$/)
		})

		it('should apply an ID to the container when the tooltip is created', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1))

			await tooltip.hover()
			tick()
			fixture.detectChanges()

			const tooltipId = await tooltip.getTooltipId()
			expect(tooltipId).toBeTruthy()
		}))
		
		it('should not set set id when tooltip is not created', () => {
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1))
			const directive = debugElement.injector.get(OcxTooltipDirective) as any
			const spy = jest.spyOn(directive.renderer, 'setAttribute')
			jest.spyOn(directive, 'isTooltipCreated').mockReturnValue(false)
			
			directive.applyIdToContainer()

			expect(spy).not.toHaveBeenCalledWith(directive.container, 'id', '')
		})
	})
})