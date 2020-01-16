import { Directive, TemplateRef, 
  ViewContainerRef, 
  ComponentRef, 
  ComponentFactoryResolver,  
  ComponentFactory, 
  Input,
  SimpleChanges,
  OnChanges} from '@angular/core';
import { LoadingComponent } from './loading/loading.component';

@Directive({
selector: '[apploading]'
})
export class LoadingDirective {


  loadingFactory : ComponentFactory<LoadingComponent>;
  loadingComponent : ComponentRef<LoadingComponent>;

  newElementData;

  @Input() 
  set apploading(elementData: any) {
  this.newElementData = elementData;

    if (elementData.isLoading) {
      this.render(true);
    } else {
      this.render(false);
    }
  }

  render(state: boolean, type: any = 'input') {
    if (state) {
      this.vcRef.clear();
      this.loadingComponent = this.vcRef.createComponent(this.loadingFactory); // create and embed an instance of the loading component
      this.loadingComponent.instance.description = this.newElementData.descripcion; 
      if(this.newElementData.type) {
        this.loadingComponent.instance.type = this.newElementData.type; 
      }
    } else {
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.templateRef);// embed the contents of the host template
    }
  }

  constructor(private templateRef: TemplateRef<any>,
        private vcRef: ViewContainerRef, 
        private componentFactoryResolver: ComponentFactoryResolver) {
  // Create resolver for loading component
  this.loadingFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
  }
} 