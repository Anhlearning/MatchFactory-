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
       
    },
    onLoad() { 
        this.originScaleX = this.node.scaleX;
        this.originScaleY = this.node.scaleY;
    }
    
    ,
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
    },

    onMouseDown() {
        if(!this.CheckIsObjectMinY()) return ;
        ManagerClick.instance.AddObjectInContainer(this.node);

    },
    pieceBouyingAnimating(piece) {
        let originScaleY = this.originScaleY;   // dùng từ node chính của script
        let originScaleX = this.originScaleX;
        cc.tween(piece)
        .to(0.2, { scaleX: originScaleX + 0.15, scaleY: originScaleY - 0.15 })
        .to(0.2, { scaleY: originScaleY + 0.15, scaleX: originScaleX - 0.15 })
        .to(0.15, { scaleY: originScaleY, scaleX: originScaleX })
        .start();
    },
    CheckIsObjectMinY(){
        let parent = this.node.parent;
        if (!parent) return false; // Nếu không có parent, trả về false

        let minY = this.node.position.y;

        parent.children.forEach(child => {
            if (child !== this.node && child.position.y < minY && !ManagerClick.instance.objectsCurrentContainer.includes(child) && !ManagerClick.instance.objectsCurrentStack.includes(child)) {
                minY = child.position.y;
            }
        });

        return this.node.position.y === minY;
    },

    resetColor() {
        this.node.color = this.originalColor;
    }
});
