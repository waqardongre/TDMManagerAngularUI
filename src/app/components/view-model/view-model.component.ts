import { Component, OnInit } from '@angular/core';
import { ModelsListService } from 'src/app/services/models-list/models-list.service';
import { ViewModelService } from 'src/app/services/view-model/view-model.service';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { JwtTokenService } from 'src/app/services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-view-model',
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.css']
})
export class ViewModelComponent implements OnInit {

  private modelId: any;
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );;
  private scene: THREE.Scene = new THREE.Scene();
  private loader: GLTFLoader = new GLTFLoader();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer( { antialias: true } );
  private controls: OrbitControls = new OrbitControls( this.camera, this.renderer.domElement );
  private modelRenderingDiv: any;
  protected ambientLightSwitch: boolean = true;
  protected directionalLightSwitch: boolean = true;
  protected directionalLightSwitchTwo: boolean = true;
  private directionalLightIndex: any = {
    one: 0,
    two: 1
  };
  private modelBlobURL: string = "";
  protected showLoadingIcon: boolean = true;

  constructor(
    private modelsListService: ModelsListService,
    private viewmodelservice: ViewModelService
  ) {
    this.modelsListService.modelCurrent.subscribe((modelObj) => {
      this.modelId = modelObj.modelId;
    });
  }

  ngOnInit(): void {
    this.modelRenderingDiv = document.getElementById('modelRenderingDiv');
    this.initThree(this.modelId);
  }

  initThree(modelId: number): void {
    // Getting 3D model from service method getModel
    this.viewmodelservice.getModel(modelId)
    .subscribe({
      next: (request) => {
        const modelBase64 = request.model;
        const modelArrayBuffer = this.base64ToArrayBuffer(modelBase64)
        let modelBlob = new Blob([modelArrayBuffer]);
        this.modelBlobURL = window.URL.createObjectURL(modelBlob);
        this.renderModel(this.modelBlobURL);
      },
      error: (e) => {
        console.error(e)
      }
    })
  }

  renderModel(URL: string): void {
    this.initScene(URL);
  }

  initScene(URL: string): any {
    const onWindowResize = (): void => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
  
      this.renderer.setSize( window.innerWidth, window.innerHeight );
  
      this.renderer.render( this.scene, this.camera );
    }

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.camera.position.set( -2.5, 0, 3.0 );
    
    this.scene = new THREE.Scene();
    
    // Rendering 3d model
    this.loader = new GLTFLoader();

    this.loader.load( URL, (gltf: any) => gltfLoaderEventHandler(gltf));

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    const sizeReducer = 1.01;
    this.renderer.setSize( window.innerWidth/sizeReducer, window.innerHeight/sizeReducer );
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 10000;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.controls.addEventListener('change', () => { // using this bcos there is no animation loop
      this.renderer.render(this.scene, this.camera);
    });
    
    this.modelRenderingDiv.appendChild(this.renderer.domElement);
    
    window.addEventListener('resize', onWindowResize);

    const gltfLoaderEventHandler = (gltf: any) => {
      gltf.scene.scale.set(6.0, 6.0, 6.0)
  
      this.scene.add(gltf.scene)
  
      this.scene.background = new THREE.Color('#ffffff')
      this.addAmbientLight()
      this.addDirectionalLight()
      this.addDirectionalLightTwo()
      
      this.renderer.render(this.scene, this.camera);
      this.showLoadingIcon = false;
    }

    this.renderer.render(this.scene, this.camera);
  }

  switchAmbientLight(): void {
    this.ambientLightSwitch = !this.ambientLightSwitch;
    if (this.ambientLightSwitch) {
      this.addAmbientLight()
    }
    else{
      this.removeAmbientLight()
    }
    this.renderer.render(this.scene, this.camera);
  }

  removeAmbientLight(): void {
    this.scene.children.forEach((e: any) => {
      e.parent.children.forEach((eChild: any) => {
        if (eChild.isAmbientLight) {
          e.parent.remove(eChild);
        }
      }); 
    });
  }

  addAmbientLight(): void {
    const lightIntensity = 0.1 //lightIntensity/1
    let ambientLight = new THREE.AmbientLight('#ffffff', lightIntensity) //lightIntensity/1
    this.scene.add(ambientLight)
  }

  switchDirectionalLight(): void {
    if (!this.directionalLightSwitch) {
      this.addDirectionalLight()
    }
    else{
      this.removeDirectionalLight()
    }
    this.renderer.render(this.scene, this.camera);
    this.directionalLightSwitch = !this.directionalLightSwitch;
  }

  addDirectionalLight(): void { // addDirectionalLightOne
    const lightIntensity = 2 //lightIntensity/1
    let directionalLight = new THREE.DirectionalLight('#ffffff', lightIntensity)
    directionalLight.position.set(50000, 50000, 100000)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    const directionalLightCount = this.getDirectionalLightCount();
    if (directionalLightCount == 0) {
      this.directionalLightIndex.one = 0
      this.directionalLightIndex.two = null
    }
    else {
      this.directionalLightIndex.one = 1
      this.directionalLightIndex.two = 0
    }
  }

  removeDirectionalLight(): void {
    let count = 0
    this.scene.children.forEach((e: any) => {
      e.parent.children.forEach((eChild: any) => {
        if (eChild.isDirectionalLight) {
          if (this.directionalLightIndex.one != null) {
            if (count == this.directionalLightIndex.one) {
              e.parent.remove(eChild);
            }
            count += 1;
          }
        }
      }); 
    });

    const directionalLightCount = this.getDirectionalLightCount();
    if (directionalLightCount == 0) {
      this.directionalLightIndex.two = null
      this.directionalLightIndex.one = null
    }
    else {
      this.directionalLightIndex.two = 0
      this.directionalLightIndex.one = null
    }
  }

  switchDirectionalLightTwo(): void {
    if (!this.directionalLightSwitchTwo) {
      this.addDirectionalLightTwo()
    }
    else {
      this.removeDirectionalLightTwo()
    }
    this.renderer.render(this.scene, this.camera);
    this.directionalLightSwitchTwo = !this.directionalLightSwitchTwo;
  }

  addDirectionalLightTwo(): void {
    const lightIntensity = 2 //lightIntensity/1
    let directionalLight = new THREE.DirectionalLight('#ffffff', lightIntensity)
    directionalLight.position.set(-50000, -50000, -100000)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    const directionalLightCount = this.getDirectionalLightCount();
    if (directionalLightCount == 0) {
      this.directionalLightIndex.two = 0
      this.directionalLightIndex.one = null
    }
    else {
      this.directionalLightIndex.two = 1
      this.directionalLightIndex.one = 0
    }
  }

  removeDirectionalLightTwo(): void {
    let count = 0
    this.scene.children.forEach((e: any) => {
      e.parent.children.forEach((eChild: any) => {
        if (eChild.isDirectionalLight) {
          if (this.directionalLightIndex.two != null) {
            if (count == this.directionalLightIndex.two) {
              e.parent.remove(eChild);
            }
            count += 1;
          }
        }
      });
    });

    const directionalLightCount = this.getDirectionalLightCount();
    if (directionalLightCount == 0) {
      this.directionalLightIndex.one = null
      this.directionalLightIndex.two = null
    }
    else {
      this.directionalLightIndex.one = 0
      this.directionalLightIndex.two = null
    }
  }

  getDirectionalLightCount(): number {
    let count = 0
    this.scene.children.forEach((e: any) => {
      e.parent.children.forEach((eChild: any) => {
        if (eChild.isDirectionalLight) {
          count += 1
        }
      });
    });
    return count;
  }

  base64ToArrayBuffer(base64: string): Uint8Array {
    let binaryString = window.atob(base64);
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
       let ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
  }
}
