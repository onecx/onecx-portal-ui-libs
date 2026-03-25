import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@onecx/angular-testing';
import { OcxTooltipDirective } from './tooltip.directive';
import { OcxTooltipHarness } from '@onecx/angular-accelerator/testing';

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
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
	tooltipText = 'Tooltip works!';
	tooltipOptions: any = {};
}

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
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
	tooltipText = 'Tooltip works!';
	tooltipOptions: any = { id: '    ' };
}

@Component({
	// eslint-disable-next-line @angular-eslint/prefer-standalone
	standalone: false,
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
	tooltipText = 'Tooltip with null options';
}

describe('OcxTooltip', () => {
	const HOST_SELECTOR_1 = '.ocx-tooltip-host1';
	const HOST_SELECTOR_2 = '.ocx-tooltip-host2';
	const HOST_SELECTOR_4 = '.ocx-tooltip-host4';
	const TOOLTIP_TEXT = 'Tooltip works!';
	const TOOLTIP_TEXT_NULL = 'Tooltip with null options';
	const CUSTOM_ID = 'custom-tooltip-id';

	let fixture: ComponentFixture<TestHostComponent>;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestHostComponent, TestHostComponentNoID, TestHostComponentNull],
			imports: [NoopAnimationsModule, OcxTooltipDirective]
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		fixture.detectChanges();

		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	const createFixture = <T>(component: any): { fixture: ComponentFixture<T>; loader: HarnessLoader } => {
		const componentFixture = TestBed.createComponent(component) as ComponentFixture<T>;
		componentFixture.detectChanges();
		return {
			fixture: componentFixture,
			loader: TestbedHarnessEnvironment.loader(componentFixture)
		};
	};

	describe('Tooltip display', () => {

		it('should show tooltip on hover', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));

			await tooltip.hover();
			tick();
			fixture.detectChanges();

			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;
			expect(directive.ocxTooltip()).toBe(TOOLTIP_TEXT);

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);
		}));

		it('should hide tooltip on unhover', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));

			await tooltip.hover();
			tick();
			fixture.detectChanges();

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);

			await tooltip.unhover();
			tick();
			fixture.detectChanges();

			expect(await tooltip.getTooltipText()).toBeNull();
		}));

		it('should show tooltip on focus and hide on Escape', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));
			const host = await tooltip.host();
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;

			for (const key of ['Escape', 'Esc']) {
				await host.focus();
				await host.dispatchEvent('focus');
				tick(200);
				fixture.detectChanges();

				expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);

				directive.container?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
				tick(500);
				fixture.detectChanges();

				expect(await tooltip.getTooltipText()).toBeNull();

				await host.blur();
				tick(200);
				fixture.detectChanges();
			}
		}));

		it('should show tooltip on focus and does not hide on enter', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));
			const host = await tooltip.host();
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;

			for (const key of ['Enter']) {
				await host.focus();
				await host.dispatchEvent('focus');
				tick(200);
				fixture.detectChanges();

				expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);

				directive.container?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
				tick(500);
				fixture.detectChanges();

				expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);

				await host.blur();
				tick(200);
				fixture.detectChanges();
			}
		}));
	});

	describe('ID and aria-describedby', () => {
		it('should add an ID in the tooltip and aria-describedby in the host element', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));

			await tooltip.hover();
			const host = await tooltip.host();
			const ariaDescribedBy = await host.getAttribute('aria-describedby');
			const tooltipId = await tooltip.getTooltipId();
			tick();
			fixture.detectChanges();

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);
			expect(ariaDescribedBy).toEqual(tooltipId);
		}));

		it('should add an ID in the tooltip and aria-describedby when an ID is provided in tooltipOptions', fakeAsync(async () => {
			const component = fixture.componentInstance as TestHostComponent;
			component.tooltipOptions = { id: CUSTOM_ID };
			fixture.detectChanges();
			tick();

			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));

			await tooltip.hover();
			tick();
			fixture.detectChanges();

			const host = await tooltip.host();
			const ariaDescribedBy = await host.getAttribute('aria-describedby');
			const tooltipId = await tooltip.getTooltipId();

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);
			expect(ariaDescribedBy).toEqual(CUSTOM_ID);
			expect(tooltipId).toEqual(CUSTOM_ID);

			component.tooltipOptions = {};
		}));

		it('should add an ID in the tooltip and aria-describedby in the host element when no ID is provided', fakeAsync(async () => {
			const { fixture: fixture2, loader: loader2 } = createFixture(TestHostComponentNoID);

			const tooltip = await loader2.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_2));

			await tooltip.hover();
			const host = await tooltip.host();
			const ariaDescribedBy = await host.getAttribute('aria-describedby');
			const tooltipId = await tooltip.getTooltipId();
			tick();
			fixture2.detectChanges();

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT);
			expect(ariaDescribedBy).toEqual(tooltipId);
		}));

		it('should generate and reuse an ID in getOrCreateGeneratedId', () => {
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;

			const generatedId1 = directive.getOrCreateGeneratedId();
			const generatedId2 = directive.getOrCreateGeneratedId();

			expect(generatedId1).toMatch(/^ocx-tooltip-[a-z0-9]+-[a-z0-9]+$/);
			expect(generatedId2).toEqual(generatedId1);
		});

		it('should generate an ID when _tooltipOptions.id is null', fakeAsync(async () => {
			const { fixture: fixture4, loader: loader4 } = createFixture(TestHostComponentNull);

			const tooltip = await loader4.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_4));

			await tooltip.hover();
			tick();
			fixture4.detectChanges();

			const host = await tooltip.host();
			const ariaDescribedBy = await host.getAttribute('aria-describedby');
			const tooltipId = await tooltip.getTooltipId();

			const debugElement = fixture4.debugElement.query(By.css(HOST_SELECTOR_4));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;
			expect(directive._tooltipOptions).toBeDefined();
			expect(directive._tooltipOptions?.id).toBeTruthy();

			expect(await tooltip.getTooltipText()).toBe(TOOLTIP_TEXT_NULL);
			expect(ariaDescribedBy).toEqual(tooltipId);
		}));
	});

	describe('Tooltip internals', () => {
		it('should set resolved ID to the auto-generated ID of the OCX tooltip', () => {
			const { fixture: fixture4 } = createFixture(TestHostComponentNull);
			const debugElement = fixture4.debugElement.query(By.css(HOST_SELECTOR_4));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;
			directive._tooltipOptions = null;

			directive.ensureIdAndAriaDescribedBy();

			expect(directive.resolvedId).toMatch(/^ocx-tooltip-[a-z0-9]+-[a-z0-9]+$/);
		});

		it('should apply an ID to the container when the tooltip is created', fakeAsync(async () => {
			const tooltip = await loader.getHarness(OcxTooltipHarness.withHostSelector(HOST_SELECTOR_1));

			await tooltip.hover();
			tick();
			fixture.detectChanges();

			const tooltipId = await tooltip.getTooltipId();
			expect(tooltipId).toBeTruthy();
		}));
		
		it('should not set set id when tooltip is not created', () => {
			const debugElement = fixture.debugElement.query(By.css(HOST_SELECTOR_1));
			const directive = debugElement.injector.get(OcxTooltipDirective) as any;
			const spy = jest.spyOn(directive.renderer, 'setAttribute');
			jest.spyOn(directive, 'isTooltipCreated').mockReturnValue(false);
			
			directive.applyIdToContainer();

			expect(spy).not.toHaveBeenCalledWith(directive.container, 'id', '');
		});
	});
});