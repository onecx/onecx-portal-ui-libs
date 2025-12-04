import r2wc from '@r2wc/react-to-web-component';

function createViteAppWebComponent(
  component: React.ComponentType,
  elementName: string,
) {
  const AppWebComponent = r2wc(component, {
    props: {},
  });

  const originalConnectedCallback = AppWebComponent.prototype.connectedCallback;

  AppWebComponent.prototype.connectedCallback = function () {
    this.dataset.mfeElement = '';
    this.dataset.noPortalLayoutStyles = '';
    originalConnectedCallback.call(this);
  };

  customElements.define(elementName, AppWebComponent);
}

// const createViteAppWebComponent = (
//   app: React.ComponentType,
//   elementName: string
// ) => {
//   const AppWebComponent = r2wc(app, {
//     props: {},
//   });

//   customElements.define(elementName, AppWebComponent);
// };

export { createViteAppWebComponent };
