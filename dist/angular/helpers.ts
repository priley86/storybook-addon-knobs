import {
  NgModule,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChange,
  ChangeDetectionStrategy
} from "@angular/core";

const getComponentMetadata = ({ component, props = {} }) => {
  if (!component || typeof component !== "function")
    throw new Error("No valid component provided");

  const componentMeta =
    component.__annotations__[0] || component.annotations[0];
  const propsMeta =
    component.__prop__metadata__ || component.propMetadata || {};
  const paramsMetadata = component.__parameters__ || component.parameters || [];
  return {
    component,
    props,
    componentMeta,
    propsMeta,
    params: paramsMetadata
  };
};

const getAnnotatedComponent = ({
  componentMeta,
  component,
  params,
  knobStore,
  channel
}) => {
  const NewComponent: any = function NewComponent(cd, ...args) {
    component.call(this, ...args);
    this.cd = cd;
    this.knobChanged = this.knobChanged.bind(this);
    this.setPaneKnobs = this.setPaneKnobs.bind(this);
  };
  NewComponent.prototype = Object.create(component.prototype);
  NewComponent.__annotations__ = [new Component(componentMeta)];
  NewComponent.__parameters__ = [[ChangeDetectorRef], ...params];

  NewComponent.prototype.constructor = NewComponent;
  NewComponent.prototype.ngOnInit = function() {
    if (component.prototype.ngOnInit) {
      component.prototype.ngOnInit();
    }

    channel.on("addon:knobs:knobChange", this.knobChanged);
    knobStore.subscribe(this.setPaneKnobs);
    this.setPaneKnobs();
  };

  NewComponent.prototype.ngOnDestroy = function() {
    if (component.prototype.ngOnDestroy) {
      component.prototype.ngOnDestroy();
    }

    channel.removeListener("addon:knobs:knobChange", this.knobChanged);
    knobStore.unsubscribe(this.setPaneKnobs);
  };

  NewComponent.prototype.ngOnChanges = function(changes) {
    if (component.prototype.ngOnChanges) {
      component.prototype.ngOnChanges(changes);
    }
  };

  NewComponent.prototype.setPaneKnobs = function(timestamp: any = +new Date()) {
    channel.emit("addon:knobs:setKnobs", {
      knobs: knobStore.getAll(),
      timestamp
    });
  };

  NewComponent.prototype.knobChanged = function(change) {
    const { name, value } = change;
    const knobOptions = knobStore.get(name);
    const oldValue = knobOptions.value;
    knobOptions.value = value;
    knobStore.markAllUnused();
    const lowercasedName = name.toLocaleLowerCase();
    this[lowercasedName] = value;
    this.cd.detectChanges();
    this.ngOnChanges({
      [lowercasedName]: new SimpleChange(oldValue, value, false)
    });
  };

  return NewComponent;
};

const resetKnobs = (knobStore, channel) => {
  knobStore.reset();
  channel.emit("addon:knobs:setKnobs", {
    knobs: knobStore.getAll(),
    timestamp: false
  });
}

export function prepareComponent({ getStory, context, channel, knobStore }) {
  resetKnobs(knobStore, channel);
  const {
    component,
    componentMeta,
    props,
    propsMeta,
    params
  } = getComponentMetadata(getStory(context));

  if (!componentMeta) throw new Error("No component metadata available");

  const AnnotatedComponent = getAnnotatedComponent({
    componentMeta,
    component,
    params,
    knobStore,
    channel
  });

  return {
    component: AnnotatedComponent,
    props,
    propsMeta
  };
}