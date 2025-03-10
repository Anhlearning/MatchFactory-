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
            this.HandTut.setSiblingIndex(this.HandTut.parent.children.length - 1);
            this.HandTut.active=true;
            this.HandTut.opacity=255;
            this.SequenHandClick(0);
        }, 200);
    },

    SequenHandClick(index) {
        if (!ManagerSpawner.instance.ItemTutHand || ManagerSpawner.instance.ItemTutHand.length === 0) {
            return;
        }
    
        if (index >= ManagerSpawner.instance.ItemTutHand.length-1) {
            this.HandClick.HandClickObjectFake(ManagerSpawner.instance.ItemTutHand[index]);
            return;
        }
        let targetNode = ManagerSpawner.instance.ItemTutHand[index];
        this.HandClick.HandClickObject(targetNode,index,0);
    },
    SequenHandClickName1(index) {
        if (!ManagerSpawner.instance.ItemTutHandName1 || ManagerSpawner.instance.ItemTutHandName1.length === 0) {
            return;
        }
    
        if (index >= ManagerSpawner.instance.ItemTutHandName1.length - 1) {
            this.HandClick.HandClickObjectFake(ManagerSpawner.instance.ItemTutHandName1[index]);
            return;
        }
        
        let targetNode = ManagerSpawner.instance.ItemTutHandName1[index];
        this.HandClick.HandClickObject(targetNode, index , 1);
    },
    
    HideNode(){
        this.HandTut.active=false;
        this.TextTut.active=false;
        this.node.active=false;
    },
    ShowNode(){
        this.HandTut.active=true;
        this.node.active=true;
    },
    runHandClickSequence() {
       
    },
});
module.exports=Tutorials;
