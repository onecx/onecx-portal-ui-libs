import {
  setupPrimeStyleDeduplication,
  setupPrimeStyleIdTagging,
} from "./primeStyleRegistry";

async function flushMutationObserver() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("primeStyleRegistry", () => {
  it("sanitizes existing and newly added PrimeReact style ids", async () => {
    document.head.innerHTML = "";

    const existing = document.createElement("style");
    existing.dataset.primereactStyleId = "undefined-ripple";
    document.head.appendChild(existing);

    const cleanup = setupPrimeStyleDeduplication();
    await flushMutationObserver();

    expect(existing.dataset.primereactStyleId).toBe("ripple");

    const added = document.createElement("style");
    added.dataset.primereactStyleId = "undefined-tooltip";
    document.head.appendChild(added);
    await flushMutationObserver();

    expect(added.dataset.primereactStyleId).toBe("tooltip");

    cleanup();
  });

  it("tags PrimeReact style ids only when they are app-local and not yet tagged", async () => {
    document.head.innerHTML = "";

    const cleanup = setupPrimeStyleIdTagging("demo|app");

    const untagged = document.createElement("style");
    untagged.dataset.primereactStyleId = "datatable";
    document.head.appendChild(untagged);

    const alreadyTagged = document.createElement("style");
    alreadyTagged.dataset.primereactStyleId = "datatable-demo|app";
    document.head.appendChild(alreadyTagged);

    const foreign = document.createElement("style");
    foreign.dataset.primereactStyleId = "foreign|style";
    document.head.appendChild(foreign);

    await flushMutationObserver();

    expect(untagged.dataset.primereactStyleId).toBe("datatable-demo|app");
    expect(alreadyTagged.dataset.primereactStyleId).toBe("datatable-demo|app");
    expect(foreign.dataset.primereactStyleId).toBe("foreign|style");

    cleanup();
  });
});
