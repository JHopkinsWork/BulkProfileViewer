import * as THREE from 'three';
import { ReaderOutput, DRHatch, DRContour, DRPoint, _ProfileShape, _ConstructedProfile } from './ProfileModel';

export function GetThreeJS(readerOutput: ReaderOutput)
{
    let contents = new Array<string>();
    let articleName = readerOutput.articleName;
    const prefix = "art_" + articleName;
    contents.push("function article__" + articleName + "() {");

    const htCount = new Array<number>(12);
    const hatchNames = new Array<string>();
    const profileShapes = new Array<_ProfileShape>();
    readerOutput.drProfile.drHatches.forEach((drHatch: DRHatch) =>
    {
        let hatchType;
        switch (drHatch.type)
        {
            case 1:
                hatchType = "Aluminum";
                htCount[1]++;
                break;
            case 2:
                hatchType = "Isolator";
                htCount[2]++;
                break;
            case 3:
                hatchType = "Foam";
                htCount[3]++;
                break;
            case 4:
                hatchType = "Steel";
                htCount[4]++;
                break;
            case 10:
                hatchType = "PVC";
                htCount[10]++;
                break;
            case 11:
                hatchType = "ACCESSORIES";
                htCount[11]++;
                break;
            default:
                hatchType = "Aluminum";
                htCount[1]++;
                break;
        }

        //const hatchName = prefix + "_Profile" + hatchType + htCount[drHatch.type];
        const shape = GetShape(drHatch);
        shape.useMaterial = hatchType;
        profileShapes.push(shape);
    });

    return new _ConstructedProfile( 
        profileShapes,
        articleName,
        readerOutput.drProfile.outsideWidth,
        readerOutput.drProfile.insideWidth,
        readerOutput.drProfile.depth
    );
}

export function GetShape(hatch: DRHatch){
    const _newShape = new THREE.Shape();
    
    //extrude shape
    hatch.drContourList.forEach((drContour: DRContour) => 
    {
        if(drContour.hole) return;

        let pointNumber = 0;
        drContour.drPointList.forEach((drPoint: DRPoint) =>
        {
            if(pointNumber == 0){
                _newShape.moveTo(drPoint.X, drPoint.Y);
            }
            else{
                _newShape.lineTo(drPoint.X, drPoint.Y);
            }
            pointNumber++;
        });

        _newShape.lineTo(drContour.drPointList[0].X, drContour.drPointList[0].Y);
    });

    //extrude and assign holes in shape
    hatch.drContourList.forEach((drContour: DRContour) => 
    {
        if(!drContour.hole) return;

        const _newHoleShape = new THREE.Shape();

        let pointNumber = 0;
        drContour.drPointList.forEach((drPoint: DRPoint) =>
        {
            if(pointNumber == 0){
                _newHoleShape.moveTo(drPoint.X, drPoint.Y);
            }
            else{
                _newHoleShape.lineTo(drPoint.X, drPoint.Y);
            }
            pointNumber++;
        });
        _newHoleShape.lineTo(drContour.drPointList[0].X, drContour.drPointList[0].Y);
        _newShape.holes.push(_newHoleShape);
        
    });

    return new _ProfileShape(_newShape, "");
}

