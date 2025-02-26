// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const ManagerClick = require('ManagerClick');
const ManagerSpawner = require('./ManagerSpawner');
cc.Class({
    extends: cc.Component,

    properties: {
        originalColor: {
            default: new cc.Color()
        },
       
    },
    onLoad() { 
    }
    ,
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
    },

    onMouseDown() {
        if(!this.CheckIsObjectMinY()) return ;
        console.log(this.node.name);
        ManagerClick.instance.AddObjectInContainer(this.node);

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
