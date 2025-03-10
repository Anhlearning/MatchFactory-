// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { Console } = require("console");
const HandClick = require("./HandClick");
const ManagerSpawner = require("./ManagerSpawner");
const Tutorials = cc.Class({
    extends: cc.Component,

    properties: {
      HandTut:cc.Node,
      TextTut:cc.Node,
    },

    statics: {
        instance: null,
    },    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Tutorials.instance=this;
        this.heightframe = cc.winSize.height;
        this.widthframe = cc.winSize.width;
        this.loopCurr=10;
        this.currentClickIndex = 0;  
        this.HandClick=this.HandTut.getComponent('HandClick');
    },

    start () {
        setTimeout(() => {
            console.log("TUT HAND ACTIVE ");
            this.HandTut.setSiblingIndex(this.HandTut.parent.children.length - 1);
            this.HandTut.active=true;
            this.HandTut.opacity=255;
            this.SequenHandClick(0);
        }, 200);
    },

    SequenHandClick(index) {
        if (!ManagerSpawner.instance.ItemTutHand || ManagerSpawner.instance.ItemTutHand.length === 0) {
            console.log("Không có ItemTutHand để hướng dẫn!");
            return;
        }
    
        if (index >= ManagerSpawner.instance.ItemTutHand.length) {
            this.HideNode();
            console.log("Hướng dẫn hoàn tất!");
            return;
        }
        let targetNode = ManagerSpawner.instance.ItemTutHand[index];
        this.HandClick.HandClickObject(targetNode,index);
    },
    
    HideNode(){
        this.HandTut.active=false;
        this.TextTut.active=false;
        this.node.active=false;
    },

    runHandClickSequence() {
       
    },
});
module.exports=Tutorials;
