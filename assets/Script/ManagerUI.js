// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const Tutorials= require('Tutorial');

cc.Class({
    extends: cc.Component,

    properties: {
        stack:cc.Node,
        container: cc.Node,
        managerSpawn:cc.Node,
        tutorials:cc.Node,
        listBG:[cc.Node],
        camera3D: cc.Node,
        BgText:cc.Node,
    },

    onLoad(){
        this.originPositions = {
            stack: this.stack.getPosition(),
            container: this.container.getPosition(),
            managerSpawn: this.managerSpawn.getPosition(),
            tutorials: this.tutorials.getPosition(),
            BgText:this.BgText.getPosition(),
        };
        this.originScales = {
            stack: cc.v3(this.stack.scale,this.stack.scale,this.stack.scale),
            container: cc.v3(this.container.scale,this.container.scale,this.container.scale),
            managerSpawn: cc.v3(this.managerSpawn.scale,this.managerSpawn.scale,this.managerSpawn.scale),
            tutorials: cc.v3(this.tutorials.scale,this.tutorials.scale,this.tutorials.scale),
            BgText: cc.v3(this.BgText.scale,this.BgText.scale,this.BgText.scale),
        };
        
        this.originHeigh=1920;
        this.originWidth=1080;
        this.setResizeCallback();
    },
    setResizeCallback() {
        cc.view.setResizeCallback(() => {
           this.updateScaleOnResize();
           this.FitBackGroundUI();
        });
        this.FitBackGroundUI();
        this.updateScaleOnResize();
    },
    updateScaleOnResize() {
        let heightframe = cc.winSize.height;
        let widthframe = cc.winSize.width;


        let targetScale = 1;

        if(heightframe > widthframe * 2){
            this.camera3D.setPosition(cc.v3(0,870,400));
            let rotation = cc.Quat.fromEuler(new cc.Quat(), -65, 0, 0);
            this.camera3D.setRotation(rotation);
            this.camera3D.getComponent(cc.Camera).fov = 65;
            targetScale = widthframe/1080;
            this.AdjustScaleAllObject(targetScale);
            this.SetOriginPosAllOb();
            this.BgText.setPosition(cc.v3(123,80,200));
        }
        else if(heightframe >= 1.3 * widthframe  && heightframe < 1.7 *widthframe){
            targetScale = 1;
            this.AdjustScaleAllObject(targetScale);
            this.SetOriginPosAllOb();
        }
        else if (widthframe > heightframe) {
            targetScale = widthframe / 1920 / 2;
            this.AdjustScaleAllObject(targetScale);
            this.managerSpawn.setPosition(cc.v3(-widthframe / 10, 0,10));
            this.tutorials.setPosition(cc.v3(-widthframe / 10, 10, 0)); 
            this.stack.setPosition(cc.v3(-widthframe/10-4,0,120));
            this.camera3D.setPosition(cc.v3(0,900,250));
            let rotation = cc.Quat.fromEuler(new cc.Quat(), -68, 0, 0);
            this.camera3D.setRotation(rotation);
            this.camera3D.getComponent(cc.Camera).fov = 50;
            this.moveNodeToRightEdge();  
        }
        else if (widthframe < heightframe){
            this.camera3D.setPosition(cc.v3(0,857,403));
            let rotation = cc.Quat.fromEuler(new cc.Quat(), -60, 0, 0);
            this.camera3D.setRotation(rotation);
            this.camera3D.getComponent(cc.Camera).fov = 65;
            targetScale = widthframe/1080;
            this.AdjustScaleAllObject(targetScale);
            this.SetOriginPosAllOb();
        }
       
    },

    FitBackGroundUI(){
        let heightframe = cc.winSize.height;
        let widthframe = cc.winSize.width;
        if(heightframe >= widthframe){
           let  targetScale = Math.max(1,widthframe/this.originWidth);
            for(let i=0;i<this.listBG.length;i++){
                this.listBG[i].scale= targetScale;
            }
        }
        else {
            let targetScale = Math.max(1,widthframe / 1080 );
            for(let i=0;i<this.listBG.length;i++){
                this.listBG[i].scale= targetScale;
            }
        }
    },

    SetOriginPosAllOb(){
        this.stack.setPosition(this.originPositions.stack);
        this.container.setPosition(this.originPositions.container);
        this.managerSpawn.setPosition(this.originPositions.managerSpawn);
        this.tutorials.setPosition(this.originPositions.tutorials);
        this.BgText.setPosition(this.originPositions.BgText);
    },
    AdjustScaleAllObject(targetScale) {
        this.stack.scale = cc.v3(
            this.originScales.stack.x * targetScale,
            this.originScales.stack.y * targetScale,
            this.originScales.stack.z * targetScale
        );
        
        this.container.scale = cc.v3(
            this.originScales.container.x * targetScale,
            this.originScales.container.y * targetScale,
            this.originScales.container.z * targetScale
        );
    
        this.managerSpawn.scale = cc.v3(
            this.originScales.managerSpawn.x * targetScale,
            this.originScales.managerSpawn.y * targetScale,
            this.originScales.managerSpawn.z * targetScale
        );
    
        this.tutorials.scale = cc.v3(
            this.originScales.tutorials.x * targetScale,
            this.originScales.tutorials.y * targetScale,
            this.originScales.tutorials.z * targetScale
        );
        this.BgText.scale = cc.v3(
            this.originScales.BgText.x * targetScale,
            this.originScales.BgText.y * targetScale,
            this.originScales.BgText.z * targetScale
        );
    },
    
    moveNodeToRightEdge() {
        let widthframe = cc.winSize.width;
        let heightframe = cc.winSize.height;
        
        let frameSize=cc.view.getFrameSize();
        let offsetY = 200 * (320/frameSize.height );
        if(frameSize.height > 500 ) offsetY=0;
        cc.log(frameSize.height);
        let newX = widthframe / 10 ;
        let newY = heightframe / 20;
        this.container.setPosition(cc.v3(newX,-50,-newY));
        this.BgText.setPosition(cc.v3(newX*1.5,0,-newY*3.6));
    },
    
    
    start () {

    },

});
