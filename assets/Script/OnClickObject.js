// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const ManagerClick = require('ManagerClick');
const ManagerSpawner = require('./ManagerSpawner');
const HandClick = require('HandClick');
cc.Class({
    extends: cc.Component,

    properties: {
        originalColor: {
            default: new cc.Color()
        },
        camera3D:cc.Camera,
       
    },
    
    onLoad() {
        this.camera3D = cc.find("Root/Camera3D").getComponent(cc.Camera);// Tự tìm theo tên
        if (!this.camera3D) {
            console.error("Không tìm thấy Camera3D trong Scene!");
            return;
        }
    },
    start() {
        this.node.active = true;  // Đảm bảo đang bật
    },

    HandleClickObject() {
        if(!this.CheckIsObjectMinZ() || !ManagerClick.instance) return ;
        ManagerClick.instance.AddObjectInContainer(this.node);
    },
    pieceBouyingAnimating(piece) {
        let originScaleY = this.originScaleY;   
        let originScaleX = this.originScaleX;
        cc.tween(piece)
        .to(0.2, { scaleX: originScaleX + 0.15, scaleY: originScaleY - 0.15 })
        .to(0.2, { scaleY: originScaleY + 0.15, scaleX: originScaleX - 0.15 })
        .to(0.15, { scaleY: originScaleY, scaleX: originScaleX })
        .start();
    },
    CheckIsObjectMinZ() {
        let parent = this.node.parent;
        if (!parent) return false; 
    
        // Lấy vị trí Z của chính object hiện tại
        let maxZ = this.node.position.z;
        parent.children.forEach(child => {
            if (child !== this.node &&
                child.position.z > maxZ && 
                 !ManagerClick.instance.objectsCurrentContainer.includes(child) && 
                 !ManagerClick.instance.objectsCurrentStack.includes(child))
            {
                maxZ = child.position.z;
            }
        });
        return this.node.position.z === maxZ;
    },
    

    resetColor() {
        this.node.color = this.originalColor;
    }
});
