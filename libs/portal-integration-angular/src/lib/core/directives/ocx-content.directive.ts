import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({selector: '[ocxContent]'})
export class OcxContentDirective implements OnInit {

    /**
     * Used for passing a title text which should be rendered in the upper left corner of the content area.
     * @example [ocxContent]="My Cool Title"
     */
    @Input() ocxContent = '';
    
    constructor(private el: ElementRef){}

    ngOnInit() {
        this.addContentStyles()
        if(this.ocxContent) {
            console.log(`Received a title for the content area: "${this.ocxContent}"`);
        }
    }

    private addContentStyles() {
        // Add array of given css classes to classList of element that directive was added to
        const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    
        // Classes that should be applied to all elements regardless of their layout direction
        const sharedClasses = ['rounded', 'dark-bg']
        addClasses(sharedClasses)
    
        if (this.ocxContent) {
          // Apply styles for content area with title
          addClasses(['has-title'])
        }
      }
}