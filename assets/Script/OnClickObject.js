// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const ManagerClick = require('ManagerClick');
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
        console.log(this.node.name);
        ManagerClick.instance.AddObjectInContainer(this.node);

    },
    changeColor(newColor) {
        this.node.color = newColor;
    },

    resetColor() {
        this.node.color = this.originalColor;
    }
});
