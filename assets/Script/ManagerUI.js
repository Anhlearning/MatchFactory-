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
        itemlist:cc.Node,
        listBG:[cc.Node],
    },

    onLoad(){
        this.originPositions = {
            stack: this.stack.getPosition(),
            container: this.container.getPosition(),
            managerSpawn: this.managerSpawn.getPosition(),
            tutorials: this.tutorials.getPosition(),
            itemlist:this.itemlist.getPosition()
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

        console.log(heightframe +" "+widthframe);

        let targetScale = 1;

        if(heightframe >= 1.3 * widthframe  && heightframe < 1.7 *widthframe){
            console.log("Màn ipad");
            targetScale = 1;
            this.AdjustScaleAllObject(targetScale);
            this.SetOriginPosAllOb();
           
        }

        else if (widthframe > heightframe) {
            console.log("màn Ngang");
            targetScale = widthframe / this.originWidth/2;
            this.AdjustScaleAllObject(targetScale);
            this.managerSpawn.setPosition(cc.v2(-widthframe / 4, 0));
            this.stack.setPosition(cc.v2( -widthframe / 4, -600 * (widthframe/3408)));
            this.moveNodeToRightEdge();
            this.syncItemlistPosition();   
        }
        else {
            console.log("màn hình dọc") 
            targetScale = 1* (widthframe/1080);
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
            console.error(targetScale);
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
        this.itemlist.setPosition(this.originPositions.itemlist);   
    },
    AdjustScaleAllObject(targetScale){
        this.stack.scale = targetScale;
        this.container.scale = targetScale;
        this.managerSpawn.scale = targetScale;
        this.tutorials.scale = targetScale;
    },
    moveNodeToRightEdge() {
        let widthframe = cc.winSize.width;
        let heightframe = cc.winSize.height;
        
        let frameSize=cc.view.getFrameSize();
        let offsetY = 200 * (320/frameSize.height );
        if(frameSize.height > 500 ) offsetY=0;
        console.log(frameSize.height);
        let newX = widthframe / 4 ;
        let newY = heightframe / 2 + offsetY*(frameSize.height / 320);
        this.container.setPosition(cc.v2(newX, newY));
        this.tutorials.setPosition(cc.v2(newX, newY));
        console.log(this.container.getPosition());
    },
    syncItemlistPosition() {
        // Lấy world position của ManagerSpawn
        let worldPos = this.managerSpawn.convertToWorldSpaceAR(cc.Vec2.ZERO);
    
        // Đổi từ world position về local position của tutorials (vì itemlist là con của tutorials)
        let localPos = this.tutorials.convertToNodeSpaceAR(worldPos);
    
        // Xử lý scale hiện tại của tutorials (nếu tutorials có scale ≠ 1)
        let scale = this.tutorials.scale;
    
        // Đặt vị trí itemlist về đúng vị trí local đã tính (loại bỏ ảnh hưởng scale)
        this.itemlist.setPosition(cc.v2(localPos.x , localPos.y));
    },
    
    
    start () {

    },

});
