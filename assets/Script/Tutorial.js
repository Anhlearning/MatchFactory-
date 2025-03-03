// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const HandClick = require("./HandClick");

const Tutorials = cc.Class({
    extends: cc.Component,

    properties: {
       listfruitsTu:{
            default:[],
            type:[cc.Node],
       },
       containerTut: cc.Node,
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
    },

    start () {
       this.SequenHandClick();
    },

    setFruitPositionAll(){
        this.setFruitPosition(this.listfruitsTu[0], 7, 0);
        this.setFruitPosition(this.listfruitsTu[1], 7, 1);
        this.setFruitPosition(this.listfruitsTu[2], 7, 3);
    },

    SequenHandClick() {
        this.runHandClickSequence();
    },
    
    HideNode(){
        this.node.active=false;
    },

    runHandClickSequence() {
        if (this.currentClickIndex >= this.listfruitsTu.length) {
            this.loopCurr--;
            if(this.loopCurr<=0) {
                this.node.active=false;
            }
            this.currentClickIndex = 0; 
        }
        let targetNode = this.listfruitsTu[this.currentClickIndex];
        if(this.currentClickIndex ==0 ){
            setTimeout(() => {
                HandClick.instance.HandClickObject(targetNode);
            }, 100);
        }
        else {
            HandClick.instance.HandClickObject(targetNode);
        }
        setTimeout(() => {
            this.HandleObjectInContainer(this.listfruitsTu[this.currentClickIndex]);
        }, 500);
        this.scheduleOnce(() => {
            this.currentClickIndex++;
            this.runHandClickSequence();
        }, 1);
    
    },
    HandleObjectInContainer(node){
        let targetNode= this.containerTut.children[this.currentClickIndex];
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .call(()=>{
            cc.tween(node)
            .call(()=>{
                if(node == this.listfruitsTu[2]){
                    this.setFruitPositionAll();
                }
            })
            .start();
            })
        .start();
    },

    setFruitPosition(fruitNode, row, col) {
        let heightframe = cc.winSize.height;
        let totalCols = 6; 
        let spacingX = 150;
        let spacingY = 180;
        let startX = -((totalCols - 1) * spacingX / 2);
        let startY = heightframe/2 + 200;  
        let posX = startX + col * spacingX;
        let posY = startY - row * spacingY;
        fruitNode.setPosition(cc.v2(posX, posY));
    }
});
module.exports=Tutorials;
