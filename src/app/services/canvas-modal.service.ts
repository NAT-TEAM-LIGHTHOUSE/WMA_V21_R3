import { ApplicationRef, ComponentFactoryResolver, ElementRef, EmbeddedViewRef, Inject, Injectable, Injector, NgZone, PLATFORM_ID, Renderer2, RendererFactory2, Type } from '@angular/core';
import { Events } from './events';
import { applyLoggingDecorator } from './decorator-application';
import { GlobalObjectsService } from './global-objects.service';
import { LhsLibService } from './lhs-lib.service';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanvasModalService {
  private renderer: any;
  // private modalElement:any;
  clickedData: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector, private rendererFactory: RendererFactory2,
    private events: Events, 
    private globalObjects: GlobalObjectsService, private lhs_lib: LhsLibService, private ngZone: NgZone,@Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (this.globalObjects.serviceFlag) {
      return applyLoggingDecorator(this, "canvas-modal-service")
    }
  }
  createComponent(component, parameters?, id?, cssClass?, resolve?, isOffcanvas?) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector, [], null);

    parameters && Object.assign(componentRef.instance, parameters)
    // console.log("parameter", componentRef.instance)
    // console.log("modal id : " + id);
    let superId: any = this.lhs_lib.getActiveTabSuperid()
    this.appRef.attachView(componentRef.hostView);
        if (isPlatformServer(this.platformId)) return;
    const ionapparr = document.querySelectorAll('.parent-main')

    const ionapp = ionapparr[ionapparr.length - 1]

    let modalElement = this.renderer.createElement('div');
    this.renderer.appendChild(ionapp, modalElement);

    id && (modalElement.id = id)
    if (cssClass) {

      let arr = cssClass.split(" ");
      for (let a of arr) {
        a && (modalElement.classList.add(a))
      }
    }


    modalElement.addEventListener('click', (event) => {
      // Check if the click event occurred on the close button
      // console.log(this.clickedData);
      // alert("check");
      if (event.isOffcanvasClose) {
        this.clickedData = {
          data: "",
          role: ""
        }
      }else if(event.isGroupbyFilterPdf){
         this.clickedData = {
          data: event.isGroupbyFilterPdf,
          role: ""
        }
      }
      if (this.clickedData && this.clickedData.role != 'notDismiss') {
        if (isOffcanvas) {
               if (isPlatformServer(this.platformId)) return;
          let backdrop = document.querySelectorAll('.offcanvas-backdrop')
          if (backdrop) {
            backdrop[backdrop.length - 1].remove();
          }
        }

        componentRef.destroy(),
          modalElement.remove(),
          modalElement = "",
          this.renderer.selectRootElement = {},
          resolve(this.clickedData)
        this.clickedData = null;
      } else if (this.clickedData && this.clickedData.data && this.clickedData.role == 'notDismiss') {

        this.events.publish(`noDissmiss#${this.clickedData.data.object_code}${superId ? '#' + superId : ''}`, this.clickedData.data);
        this.clickedData = null;
      }

      (event.target.classList.contains('closeModal') || event.target.classList.contains('back')) && (this.appRef.detachView(componentRef.hostView),
        componentRef.destroy(),
        modalElement.remove(),
        modalElement = "",
        this.renderer.selectRootElement = {},
        resolve(0))
    });
    this.renderer.listen(modalElement, "keyup.enter", event => {
      // alert("enter"); 
      if (this.clickedData && this.clickedData.role != 'notDismiss') {
        if (isOffcanvas) {
               if (isPlatformServer(this.platformId)) return;
          let backdrop = document.querySelectorAll('.offcanvas-backdrop')
          if (backdrop) {
            backdrop[backdrop.length - 1].remove();
          }
        }
        (modalElement.remove(), resolve(this.clickedData));
        this.clickedData = null;
      } else if (this.clickedData && this.clickedData.data && this.clickedData.role == 'notDismiss') {
        // this.events.publish(`noDissmiss#${this.clickedData.data.object_code}`, this.clickedData.data);
        this.events.publish(`noDissmiss#${this.clickedData.data.object_code}${superId ? '#' + superId : ''}`, this.clickedData.data); //by arti
        this.clickedData = null;
      }
      (event.target.classList.contains('closeModal') || event.target.classList.contains('back')) && (modalElement.remove(), resolve(0))
    });

    this.renderer.listen(modalElement, "keyup.F9", event => {
      // alert("F9"); 
      if (this.clickedData && this.clickedData.role != 'notDismiss') {
        if (isOffcanvas) {
           if (isPlatformServer(this.platformId)) return;
          let backdrop = document.querySelectorAll('.offcanvas-backdrop')
          if (backdrop) {
            backdrop[backdrop.length - 1].remove();
          }
        }
        (modalElement.remove(), resolve(this.clickedData));
        this.clickedData = null;
      } else if (this.clickedData && this.clickedData.data && this.clickedData.role == 'notDismiss') {
        // this.events.publish(`noDissmiss#${this.clickedData.data.object_code}`, this.clickedData.data);
        // this.clickedData = null;
        this.events.publish(`noDissmiss#${this.clickedData.data.object_code}${superId ? '#' + superId : ''}`, this.clickedData.data); //by arti
        this.clickedData = null;
      }
      (event.target.classList.contains('closeModal') || event.target.classList.contains('back')) && (modalElement.remove(), resolve(0))
    });
    // event.preventDefault();
    return {
      modalElement: modalElement,
      componentRef: componentRef
    }
  }

  async openModal(component: Type<any>, parameters?: any, id?: any, event?: any, cssClass?: any, flag?, cssStyle?: any, isSuper?: any, isTitle?: any): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      const modalData = this.createComponent(component, parameters, id, cssClass, resolve)
      const modalElement = modalData.modalElement
      const componentRef = modalData.componentRef
      modalElement.classList.add("modalOpenS");
      modalElement.innerHTML = `
        <div class="model-backdrop"></div>
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header"><h2 class="header"></h2><button type="button" class="closeModal">&times;</button></div>
            <div class="modal-body"></div>
          </div>
        </div>
      `;
      let mouseX, mouseY, left, top, modalDialog, container, containerRect, modalContent

      // modalElement.style=cssStyle
      modalContent = modalElement.querySelector('.modal-content')

      modalDialog = modalElement.querySelector('.modal-dialog')
      modalContent.style = cssStyle;

      if (isSuper) {
        let title = parameters.object_mast.Level2[parameters.page_no ?? 0].apps_page_name
        if (isPlatformServer(this.platformId)) return;
        const textNode = document.createTextNode(title);
        modalElement.querySelector('.header')?.appendChild(textNode);
      } else if (isTitle) {
        if (isPlatformServer(this.platformId)) return;
        const textNode = document.createTextNode(isTitle);
        modalElement.querySelector('.header')?.appendChild(textNode);
      }


      event && (
        container = event.currentTarget,
        containerRect = container.getBoundingClientRect(),
        mouseX = event.clientX - containerRect.left,
        mouseY = event.clientY + 20,
        // Set model position
        left = mouseX + 'px',
        top = mouseY + 'px',
        modalDialog.style.marginRight = left,
        modalDialog.style.marginTop = top

      )

      // modalElement.style.zIndex = '99999999';
      modalElement.style.zIndex = this.getLengthModels();
      // modalElement.style.zIndex = 99999999

      modalElement.querySelector('.modal-body').appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
      if (!parameters?.no_back) {
        this.closeModal(modalElement, componentRef, resolve)
      }

      if (flag) {
        this.makeModalDraggable(modalElement);
      } else {
        let modalHeader = modalElement.querySelector('.modal-header');
      }
    })
  }



  makeModalDraggable(modalElement: HTMLElement) {
    const modalDialog = modalElement.querySelector('.modal-dialog') as HTMLElement;
    const modalHeader = modalElement.querySelector('.modal-header') as HTMLElement;

    let offsetX = 0, offsetY = 0, isDragging = false;

    modalHeader.style.cursor = 'move'; // Change cursor to indicate draggable area

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      offsetX = event.clientX - modalDialog.getBoundingClientRect().left;
      offsetY = event.clientY * 2 - modalDialog.getBoundingClientRect().top;
           if (isPlatformServer(this.platformId)) return;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        modalDialog.style.left = (event.clientX - offsetX) + 'px';
        modalDialog.style.top = (event.clientY - offsetY) + 'px';
      }
    };

    const onMouseUp = () => {
      isDragging = false;
           if (isPlatformServer(this.platformId)) return;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    modalHeader.addEventListener('mousedown', onMouseDown);
  }

  async openModalcanvas(component: Type<any>, parameters?: any, id?: any, event?: any, cssClass?: any): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      const modalData = this.createComponent(component, parameters, id, cssClass, resolve)
      const modalElement = modalData.modalElement
      const componentRef = modalData.componentRef
      modalElement.classList.add("modalOpenS");
      modalElement.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body"></div>
          </div>
        </div>
      `;
      let mouseX, mouseY, left, top, modalDialog
      event && (
        mouseX = event.clientX,
        mouseY = event.clientY + 20,
        // Set model position
        left = mouseX + 'px',
        top = mouseY + 'px',
        modalDialog = modalElement.querySelector('.modal-dialog'),
        modalDialog.style.marginLeft = left,
        modalDialog.style.marginTop = top
      )
      modalElement.querySelector('.modal-body').appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
      this.closeModal(modalElement, componentRef, resolve)
    })
  }

 async openoffCanvas(component: Type<any>, parameters?: any, id?: any, cssClass?: any, title?: any, style?: any, isSuper?: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      const modalData = this.createComponent(component, parameters, id, cssClass, resolve, true);
      const modalElement = modalData.modalElement;
      const componentRef = modalData.componentRef;

      modalElement.classList.add("offcanvas");

      // Detect side: default to 'start' if cssClass not passed
      const isRight = cssClass?.includes('offcanvas-end') || cssClass?.includes('offcanvasRight') ? true : false;

      // Add resizer-handle on appropriate side
      modalElement.innerHTML = `
      <div class="offcanvas-header">
        <h5 id="offcanvasTopLabel" class="titleCanvas"></h5>
        <button type="button" class="btn-close text-reset closeModal">
          <ion-icon name="close-outline" class="closeModal"></ion-icon>
        </button>
      </div>
      <div class="offcanvas-body"></div>
      <div class="resizer-handle ${isRight ? 'left' : 'right'}"></div>`; // 👈 Add resizer on left or right

      modalElement.querySelector('.offcanvas-body')?.appendChild(
        (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]
      );

      modalElement.classList.toggle('show');

      if (style) modalElement.style = style;
      modalElement.style.visibility = 'visible';

      const elementZIndex = this.getLengthModels();
      modalElement.style.zIndex = elementZIndex;
           if (isPlatformServer(this.platformId)) return;
      const textNode = document.createTextNode(title);
      modalElement.querySelector('.titleCanvas')?.appendChild(textNode);

      // if (!isSuper) {
      this.backdropModal(modalElement, componentRef, resolve, elementZIndex, isSuper);
      // }

      const closeModalButtons = modalElement.querySelectorAll('.closeModal');
      closeModalButtons.forEach((button) => {
        (button as HTMLElement).addEventListener('click', (e) => {
          this.closeOffCanvas(modalElement, componentRef);
          resolve({ data: "", role: "" });
          e.stopPropagation();
        });
      });
     if (isPlatformServer(this.platformId)) return;
      document.querySelector(".tooltip")?.classList.remove("show");
      (document.activeElement as HTMLElement)?.blur();

      // ✅ Resizer logic for both ends
      const resizer = modalElement.querySelector('.resizer-handle') as HTMLElement;
      let isResizing = false;
      let startX = 0;
      let startWidth = 0;

      if (resizer) {
        resizer.addEventListener('mousedown', (e: MouseEvent) => {
          isResizing = true;
          startX = e.clientX;
          startWidth = modalElement.offsetWidth;
     if (isPlatformServer(this.platformId)) return;
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          e.preventDefault();
        });

        const onMouseMove = (e: MouseEvent) => {
          if (!isResizing) return;
          const delta = e.clientX - startX;
          const minWidth = 250;
           if (isPlatformServer(this.platformId)) return;
          const maxWidth = window.innerWidth - 100; // Or Infinity
          let newWidth;

          if (isRight) {
            // offcanvas-end (right side): expand leftwards
            newWidth = Math.max(minWidth, Math.min(startWidth - delta, maxWidth));
          } else {
            // offcanvas-start (left side): expand rightwards
            newWidth = Math.max(minWidth, Math.min(startWidth + delta, maxWidth));
          }

          // modalElement.style.width = `${newWidth}px !important`;
          modalElement.style.setProperty('width', `${newWidth}px`, 'important');
        };

        const onMouseUp = () => {
          isResizing = false;
               if (isPlatformServer(this.platformId)) return;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
      }
    });
  }

   openLov(component: Type<any>, parameters?: any, id?: any, cssClass?: any, title?: any, style?: any, isSuper?: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
       try {
        this.ngZone.run(()=>{
      const modalData = this.createComponent(component, parameters, id, cssClass, resolve,true);
      const modalElement = modalData.modalElement;
      const componentRef = modalData.componentRef;

      modalElement.classList.add("offcanvas");

      // Detect side: default to 'start' if cssClass not passed
      const isRight = cssClass?.includes('offcanvas-end') || cssClass?.includes('offcanvasRight') ? true : false;

      // Add resizer-handle on appropriate side
      modalElement.innerHTML = `
      <div class="offcanvas-header">
        <h5 id="offcanvasTopLabel" class="titleCanvas"></h5>
        <button type="button" class="btn-close text-reset closeModal">
          <ion-icon name="close-outline" class="closeModal"></ion-icon>
        </button>
      </div>
      <div class="offcanvas-body"></div>
      <div class="resizer-handle ${isRight ? 'left' : 'right'}"></div>`; // 👈 Add resizer on left or right

      modalElement.querySelector('.offcanvas-body')?.appendChild(
        (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]
      );

      modalElement.classList.toggle('show');

      if (style) modalElement.style = style;
      modalElement.style.visibility = 'visible';

      const elementZIndex = this.getLengthModels();
      modalElement.style.zIndex = elementZIndex;
     if (isPlatformServer(this.platformId)) return;
      const textNode = document.createTextNode(title);
      modalElement.querySelector('.titleCanvas')?.appendChild(textNode);

      // if (!isSuper) {
        this.backdropModal(modalElement, componentRef, resolve,elementZIndex,isSuper);
      // }

      const closeModalButtons = modalElement.querySelectorAll('.closeModal');
      closeModalButtons.forEach((button) => {
        (button as HTMLElement).addEventListener('click', (e) => {
          this.closeOffCanvas(modalElement, componentRef);
          resolve({ data: "", role: "" });
          e.stopPropagation();
        });
      });
     if (isPlatformServer(this.platformId)) return;
      document.querySelector(".tooltip")?.classList.remove("show");
      (document.activeElement as HTMLElement)?.blur();

      // ✅ Resizer logic for both ends
      const resizer = modalElement.querySelector('.resizer-handle') as HTMLElement;
      let isResizing = false;
      let startX = 0;
      let startWidth = 0;

      if (resizer) {
        resizer.addEventListener('mousedown', (e: MouseEvent) => {
          isResizing = true;
          startX = e.clientX;
          startWidth = modalElement.offsetWidth;
     if (isPlatformServer(this.platformId)) return;
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          e.preventDefault();
        });

        const onMouseMove = (e: MouseEvent) => {
          if (!isResizing) return;
          const delta = e.clientX - startX;
          const minWidth = 250;
           if (isPlatformServer(this.platformId)) return;
          const maxWidth = window.innerWidth - 100; // Or Infinity
          let newWidth;

          if (isRight) {
            // offcanvas-end (right side): expand leftwards
            newWidth = Math.max(minWidth, Math.min(startWidth - delta, maxWidth));
          } else {
            // offcanvas-start (left side): expand rightwards
            newWidth = Math.max(minWidth, Math.min(startWidth + delta, maxWidth));
          }

          // modalElement.style.width = `${newWidth}px !important`;
          modalElement.style.setProperty('width', `${newWidth}px`, 'important');
        };

        const onMouseUp = () => {
          isResizing = false;
               if (isPlatformServer(this.platformId)) return;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
      }
      })
    }catch (e) {
      reject(e);
    }
    });
  }



  backdropModal(modalElementMain, componentRef, resolve, zIndex,isSuper?) {
         if (isPlatformServer(this.platformId)) return;
    const ionapparr = document.querySelectorAll('.parent-main')

    const ionapp = ionapparr[ionapparr.length - 1]
    const backdrop = this.renderer.createElement('div') as HTMLElement;
    this.renderer.appendChild(ionapp, backdrop);
    backdrop.classList.add("offcanvas-backdrop", "fade", "show");
    let ZindexBackDrop = zIndex - 1;
    backdrop.style.zIndex = ZindexBackDrop.toString();

    backdrop.addEventListener('click', (e) => {
      if (!isSuper) {
        // const modalElement = document.querySelector('.offcanvas.show') as HTMLElement;
        // if (modalElement) {
        // modalElementMain.remove()

        this.closeOffCanvas(modalElementMain, componentRef);
        resolve({
          data: "",
          role: ""
        })
        // }
      }

    });
  }




  closeOffCanvas(modalElement: any, componentRef) {
    // modalElement.classList.remove('show');
    // modalElement.style.visibility = 'hidden';
    // modalElement.style.zIndex = '';

    if (isPlatformServer(this.platformId)) return;

    const backdrop = document.querySelectorAll('.offcanvas-backdrop');

    if (backdrop) {
      this.appRef.detachView(componentRef.hostView)
      componentRef.destroy()
      modalElement.remove()
      modalElement = ""
      this.renderer.selectRootElement = {}
      backdrop[backdrop.length - 1].remove();
    }
  }



  // new code end for all offcanvas (click anywhere then close)

  async dismiss(data?) {
    this.clickedData = data;
    return await new Promise<any>((resolve, reject) => {
           if (isPlatformServer(this.platformId)) return;
      const d = document.querySelector('.modalOpenS')
      if (d) {
        resolve("data")
      }
    })
  }
  popDismiss(data?, role?) {
    this.clickedData = {
      data: data,
      role: role
    }
  }

  closeModal(modalElement, componentRef, resolve) {
    // For model-backdrop click
    modalElement.children[0].addEventListener('click', (e) => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      modalElement.remove();
      modalElement = "";
      this.renderer.selectRootElement = {};
      resolve(0);
    })
  }

  superModal(component: Type<any>, parameters?: any, id?: any, cssClass?: any, title?: any) {
    return new Promise<any>((resolve, reject) => {

      try {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let componentRef = componentFactory.create(this.injector, [], null);
        parameters && Object.assign(componentRef.instance, parameters)

        let superId: any = this.lhs_lib.getActiveTabSuperid()
        this.appRef.attachView(componentRef.hostView);
        let tabAdd;
             if (isPlatformServer(this.platformId)) return;
        let tabs: any = document.querySelectorAll('app-my-tab')
        for (let [index, tab] of tabs.entries()) {
          if (parameters.activeTabIndex) {
            if (parameters.activeTabIndex == index) {
              tabAdd = tab.childNodes[0]
            }
          } else if (!tab.childNodes[0].hasAttribute("hidden")) {
            tabAdd = tab.childNodes[0]
          }
        }

        let modalElement = this.renderer.createElement('div');
        this.renderer.appendChild(tabAdd, modalElement);
        id && (modalElement.id = id)
        cssClass && (modalElement.classList.add(cssClass))

        modalElement.addEventListener('click', (event) => {
          // click on super page get item name , frame seqid and indexcount

          this.click_event(event.target)

          // Check if the click event occurred on the close button

          // console.log(this.clickedData)
          if (event.isBreadCrump) {
            this.clickedData = {
              data: "",
              role: ""
            }
          }
          if (this.clickedData && this.clickedData.role != 'notDismiss') {
            (
              this.appRef.detachView(componentRef.hostView),
              componentRef.destroy(),
              modalElement.remove(),
              modalElement = "",
              componentRef = null,
              this.renderer.selectRootElement = {},
              resolve(this.clickedData));
            this.clickedData = null;
          } else if (this.clickedData && this.clickedData.data && this.clickedData.role == 'notDismiss') {
            // this.events.publish("noDissmiss", clickedData.data);
            this.events.publish(`noDissmiss#${this.clickedData.data.object_code}${superId ? '#' + superId : ''}`, this.clickedData.data);
            this.clickedData = null;
          }

          (event.target.classList.contains('closeModal') || event.target.classList.contains('back')) && (modalElement.remove(), resolve(0))
        });
        modalElement.classList.add("superPage");
             if (isPlatformServer(this.platformId)) return;
        let superIndex = document.querySelectorAll('.superPage')
        let superZIndex = superIndex.length + 1
        modalElement.style.zIndex = `200${superZIndex}`
        modalElement.style.position = `absolute`
        modalElement.style.top = `0`
        modalElement.style.right = `0`
        modalElement.style.left = `0`
        modalElement.style.bottom = `0`
        const rootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]
        if (rootNode) {
          // console.log("first")
          modalElement.appendChild(rootNode);
          // console.log("second")
        } else {
          throw new Error('Component root node is not available');
        }
      } catch (error) {
        console.log(error)
      }
    })
  }


  runEvents(data?, role?) {
    if (data) {
      this.events.publish(`noDissmiss#${data.subScribeObjectCode}`, data);
    }
  }
  click_event(event) {
    if (event !== null && typeof event.getAttribute === 'function') {
      const divName = event.getAttribute('name')
      if (divName && divName.startsWith('canvasClick#')) {
        // console.log(divName);
        let tp;
        let rowNum;
        let frameName;
        let itmName;

        [tp, frameName, itmName, rowNum] = divName.split("#");

        if (rowNum) {
          this.lhs_lib.sys_last_rownumber = this.lhs_lib.sys_current_rownumber;
          this.lhs_lib.sys_current_rownumber = rowNum;
        }

        if (itmName) {
          this.lhs_lib.sys_last_item = this.lhs_lib.sys_current_item;
          this.lhs_lib.sys_current_item = itmName;
        }

        if (frameName) {
          this.lhs_lib.sys_last_frame = this.lhs_lib.sys_current_frame;
          this.lhs_lib.sys_current_frame = frameName;
        }
        return;
      } else {
        if (event.nodeName == "app-super") {
          return
        }
        let p = event.parentNode
        this.click_event(p)
      }
    }
  }

  getLengthModels() {
         if (isPlatformServer(this.platformId)) return;
    let superIndex = document.querySelectorAll('.superPage')
    let superZIndex = superIndex.length + 1;
    let modelIndex = document.querySelectorAll('.modalOpenS')
    let modelZIndex = 0;
    if (modelIndex) {
      modelZIndex = modelIndex.length + 2;
    }
    let offcanvasIndex = document.querySelectorAll('.offcanvas');
    let offcanvasZIndex = 0
    if (offcanvasIndex) {
      offcanvasZIndex = offcanvasIndex.length + 2;
    }
    let Zindex = superZIndex + modelZIndex + offcanvasZIndex;
    return `999999${Zindex}`
  }
}
