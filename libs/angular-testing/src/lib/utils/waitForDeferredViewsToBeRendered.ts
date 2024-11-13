import { ComponentHarness, ContentContainerComponentHarness } from '@angular/cdk/testing'

export async function waitForDeferredViewsToBeRendered(harness: ComponentHarness | ContentContainerComponentHarness) {
  return await new Promise<void>((resolve) => {
    setTimeout(() => {
      console.warn(
        'waitForTasksOutsideAngular has not finished within 500ms. We are not waiting any longer to not cause timeouts.'
      );
      (harness as any).forceStabilize().then(() => resolve())
    }, 500)
    // waitForTasksOutsideAngular makes sure that the observe method of the IntersectionObserver is called for each defer block.
    // setTimeout makes sure that we are only continuing after the IntersectionObserverMock has called ther callback for each
    // defer block, because js scheduling is making sure that all methods which are scheduled via setTimeout are executed in the
    // respective order. This guarentees that the resolve method is called after the defer block was rendered.
    ;(harness as any).waitForTasksOutsideAngular().then(() => setTimeout(() => resolve()))
  })
}
