import * as THREE from 'three';

export class _ConstructedProfile{
    profileShapes: Array<_ProfileShape>;
    articleName: string;
    outsideWidth: number;
    insideWidth: number;
    depth: number;

    constructor(shapes: Array<_ProfileShape>, name: string, outW: number, inW: number, depth: number){
        this.profileShapes = shapes;
        this.articleName = name;
        this.outsideWidth = outW;
        this.insideWidth = inW;
        this.depth = depth;
    }
}

export class _ProfileShape{
    shape: THREE.Shape;
    useMaterial: string;

    constructor(shape: THREE.Shape, useMat: string){
        this.shape = shape;
        this.useMaterial = useMat;
    }
}

export class _ReaderOutput
{
    code: number;
    message: string;
    articleName: string;
    drProfile: _DRProfile;
    nonIsolatedProfileSectionalProperty?: NonIsolatedProfileSectionalProperty;
    isolatedProfileSectionalProperty?: IsolatedProfileSectionalProperty;
    threeJS: string;
    svg: string;
}

export class _DRProfile
{
    drHatches: Array<_DRHatch>;
    profileType: number;
    depth: number;
    outsideWidth: number;
    insideWidth: number;
}


export class _DRContour
{
    drPointList: Array<DRPoint>;
    hole: boolean;
}

export class _DRHatch
{
    drContourList: Array<_DRContour>;
    layer: string;    // hatch layer name
    type: number;     // 1 - Aluminum, 2 - Plastic, 3 - PT, 4 - Steel, 10 - PVC, 11 - PVC_accessories
    owner: string;     // parent object of the hatch
    yMax : number;
    yMin : number;
    xMax : number;
    xMin : number;
    ycenter : number;
    width : number;

    constructor(){
        this.drContourList = new Array<_DRContour>();
    }
}

export class ReaderOutput
{
    code: number;   // code 100 no error; 200 unhandled error; 400~499 input error; 600~699 output error; 800~899 internal error; 
    message: string;
    articleName: string;
    drProfile: DRProfile;
    
    nonIsolatedProfileSectionalProperty?: NonIsolatedProfileSectionalProperty;
    isolatedProfileSectionalProperty?: IsolatedProfileSectionalProperty;
    
    threeJS: string;
    svg: string;
}

export class DRProfile
{
    drHatches: Array<DRHatch>;
    profileType: number; // 0 - unknown type, 1 - non-isolated aluminum, 2 - isolated, 4 - non-isolated steel
    depth: number;
    outsideWidth: number;
    insideWidth: number;

    constructor(){
        this.drHatches = new Array<DRHatch>();
    }
}

export class DRHatch
{
    drContourList: Array<DRContour>;
    layer: string;
    type: number;
    owner: string;
    yMax: number;
    yMin: number;
    xMax: number;
    xMin: number;
    yCenter: number;
    width: number;

    constructor(){
        this.layer = "";
        this.owner = "";
        this.drContourList = new Array<DRContour>();
    }
}

export class DRContour
{
    drPointList : Array<DRPoint>;
    hole : boolean;

    constructor(){
        this.drPointList = new Array<DRPoint>();
        this.hole = false;
    }
}


export class DRPoint
{
    X: number;
    Y: number;

    constructor(x: number, y:number){
        this.X = x;
        this.Y = y;
    }

    Offset(x: number, y: number){
        this.X += x;
        this.Y += y;
    }

    Scale(sx: number, sy: number)
    {
        this.X *= sx;
        this.Y *= sy;
    }

    Rotate(angle: number)
    {
        const cost = Math.cos(Math.PI * angle / 180);
        const sint = Math.sin(Math.PI * angle / 180);
        const X1 = this.X * cost - this.Y * sint;
        const Y1 = this.X * sint + this.Y * cost;
        this.X = X1;
        this.Y = Y1;
    }
}

export class IsolatedProfileSectionalProperty
{
    ArticleName: string;
    InsideW : number;
    OutsideW : number;
    LeftRebate : number;
    RightRebate : number;
    DistBetweenIsoBars : number;
    d : number;
    Weight : number;  // N/m
    Ao : number;
    Au : number;
    Io : number;
    Iu : number;
    Ioyy : number;
    Iuyy : number;
    Zoo : number;
    Zou : number;
    Zol : number;
    Zor : number;
    Zuo : number;
    Zuu : number;
    Zul : number;
    Zur : number;
    RSn20 : number;  // N/m
    RSp80 : number;
    RTn20 : number;
    RTp80 : number;
    Cn20 : number;  // N/mm2
    Cp20 : number;
    Cp80 : number;
    beta : number;  // MPa
    A2 : number;
    E : number;
    alpha : number;
    Woyp : number;
    Woyn : number;
    Wozp : number;
    Wozn : number;
    Wuyp : number;
    Wuyn : number;
    Wuzp : number;
    Wuzn : number;
    Depth : number;   // to check with Grace
}

export class NonIsolatedProfileSectionalProperty
{
    ArticleName: string;
    OutsideW : number;
    BTDepth : number;
    Width : number;
    Zo : number;
    Zu : number;
    Zl : number;
    Zr : number;
    A : number;
     Material : number;
    beta : number;
    Weight : number;
    Iyy : number;
    Izz : number;
    Wyy : number;
    Wzz : number;
    Asy : number;
    Asz : number;
    J : number;
    E : number;
    G : number;
    EA : number;
    GAsy : number;
    GAsz : number;
    EIy : number;
    EIz : number;
    GJ : number;
    Ys : number;
    Zs : number;
    Ry : number;
    Rz : number;
    Wyp : number;
    Wyn : number;
    Wzp : number;
    Wzn : number;
    Cw : number;
    Beta_torsion : number;
    Zy : number;
    Zz : number;
    Depth : number;

}