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
        });
        this.updateScaleOnResize();
    },
    updateScaleOnResize() {
        let heightframe = cc.winSize.height;
        let widthframe = cc.winSize.width;

        console.log(heightframe +" "+widthframe);

        let targetScale = 1;
        if (widthframe > heightframe) {
            targetScale = widthframe / this.originWidth/2;
            this.AdjustScaleAllObject(targetScale);
            this.managerSpawn.setPosition(cc.v2(-widthframe / 4, 0));
            this.stack.setPosition(cc.v2( -widthframe / 4, -600 * (widthframe/3408)));
            this.moveNodeToRightEdge();
            this.syncItemlistPosition();   
        }
         else {
            // màn hình dọc   
            // targetScale = widthframe / this.originWidth;
            targetScale = 1* (widthframe/1080);
            this.AdjustScaleAllObject(targetScale);
            this.SetOriginPosAllOb();
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
    
        // Vị trí mới: góc trên bên phải
        let newX = widthframe / 4 ;
        let newY = heightframe / 2 + 200 * (heightframe / 1920);
        this.container.setPosition(cc.v2(newX, newY));
        this.tutorials.setPosition(cc.v2(newX, newY));
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
