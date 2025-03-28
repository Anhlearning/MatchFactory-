// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const { error } = require('console');
const ManagerSpawner= require('ManagerSpawner');
const AudioEngine = require('./AudioEngine');
const Tutorial = require("./Tutorial");
const Config = require('./Config');
const ManagerClick=cc.Class({
    extends: cc.Component,

    properties: {
        objectsCurrentContainer:[],
        objectsCurrentStack:[],
        containers: [cc.Node],
        stack:cc.Node,
        ManagerSpawner:cc.Node,
        psNode:cc.Node,
        errorNode:cc.Node,
        Hand:cc.Node,
        Tutorial:cc.Node,
        EndgameUI:cc.Node,
    },

    statics: {
        instance: null,
    },    


    onLoad () {
        this.countCLick = 0;
        this.clickTimer = 0;
        this.isCheckingClick = false;
        ManagerClick.instance=this;
        this.countContainer=0;
        this.countStack=0;
        this.currentContainer=this.containers[0];
        this.ps=this.psNode.getComponent(cc.ParticleSystem);
        this.isEnd=false;
        this.errorScr=this.errorNode.getComponent('Error');
        this.blockX=-5000;
        this.demDone=0;
        this.endGameSrc=this.EndgameUI.getComponent('EndGameUI');
    },

    start () {
    },
    update(dt) {
        if (this.isCheckingClick) {
            this.clickTimer += dt; 
            if (this.clickTimer >= 5) { 
                this.Tutorial.active=true;
                const tut= this.Tutorial.getComponent('Tutorial');
                this.isCheckingClick = false; 
                if(this.countCLick > 3) {
                    return;
                }
                else if(this.objectsCurrentContainer.length < 3 && this.demDone==0){
                    tut.ShowNode();
                    tut.SequenHandClick(0); 
                }
                else if (this.demDone >= 1){
                    tut.ShowNode();
                    tut.SequenHandClickName1(0); 
                }
            }
        }
    },
    HandleObjectClicked(node){
        this.countCLick++;
        if(this.countCLick >= 20){
            this.isEnd=true;
            this.EndgameUI.active=true;
            this.endGameSrc.BoradCastAnimation();
            Config.openLinkApp();
            Config.onEndGame();
        }
        if (this.countCLick === 3 && !this.isCheckingClick) {
            this.isCheckingClick = true; 
            this.clickTimer = 0;
        }
        if(this.isEnd||this.objectsCurrentContainer.includes(node) || this.objectsCurrentStack.includes(node) ){
            return ;
        }
        AudioEngine.instance.playClick();
        if(!this.currentContainer || this.objectsCurrentContainer.length >= 3){
            this.PushObjectInStack(node);
            return;
        }
        let isNameExist = false;
        let nameContainer=this.currentContainer.name.split(" ")[1];
        if (this.objectsCurrentContainer.length === 0 && nameContainer === node.name) {
            if(this.CheckObjectClickInStack(node)){
                this.HandleObjectInStack(node);
            }
            else {
                this.HandleObjectInContainer(node);
            }
            return;
        }
        if (nameContainer === node.name) {
            isNameExist = true;
        }
        
        if (isNameExist) {
           this.HandleObjectInContainer(node);
        } 
        else {
            this.PushObjectInStack(node);
        }
    },
    HandleObjectInStack(node){
        let listObjectSameName=[];
        for (let i = 0; i < this.objectsCurrentStack.length; i++) {
            if(listObjectSameName.length >=2) break;
            if (this.objectsCurrentStack[i].name === node.name) {
                listObjectSameName.push(this.objectsCurrentStack[i]);
            }
        }
        for(let i=0;i < listObjectSameName.length;i++){
            let obj = listObjectSameName[i];
            let index = this.objectsCurrentStack.indexOf(obj);
            if (index !== -1) {
                this.objectsCurrentStack.splice(index, 1);
            }
        }
        for(let i=0;i<listObjectSameName.length;i++){
            this.HandleObjectInContainer(listObjectSameName[i]);
        }
        this.HandleObjectInContainer(node);
        this.SortPosInStack();
    },
    setParentKeepWorldPositionAndScale(node, newParent) {
        let worldPos = node.convertToWorldSpaceAR(cc.v3(0, 0, 0));

        let worldScale = cc.v3();
        node.getScale(worldScale);

        node.setParent(newParent);
    
        let localPos = newParent.convertToNodeSpaceAR(worldPos);
        node.setPosition(localPos);
    
        let parentWorldScale = this.getWorldScale(newParent);
        let adjustedScale = cc.v3(
            worldScale.x / parentWorldScale.x,
            worldScale.y / parentWorldScale.y,
            worldScale.z / parentWorldScale.z
        );
        node.setScale(adjustedScale);
    
       
        let rotation = cc.quat();
        cc.Quat.fromEuler(rotation, 90, 0, 0);
        node.setRotation(rotation);
    
        // Check lại scale lần cuối sau xoay (nếu cần)
        let finalScale = cc.v3();
        node.getScale(finalScale);
    },
    
    
    
    getWorldScale(node) {
        let scale = cc.v3(1, 1, 1);
        for(let i=0 ; i< 2 ;i ++){
            let nodeScale = cc.v3();
            node.getScale(nodeScale);
    
            scale.x *= nodeScale.x;
            scale.y *= nodeScale.y;
            scale.z *= nodeScale.z;
    
            node = node.parent;
        }
        return scale;
    },
    
    
    

    HandleObjectInContainer(node) {
        if (this.objectsCurrentContainer.length >= 3) return;
    
        let targetNode = this.containers[0].children[this.objectsCurrentContainer.length];
        this.objectsCurrentContainer.push(node);
    
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v3(0.05, -0.07, 0));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        this.HandleMoveDownTile(node.position);
        this.jumpWithEffect(node,targetPos,150,0.6,this);
    },
    jumpWithEffect(node, targetPos, jumpHeight, jumpTime, context) {
        const currentPos = node.position;

        const midPos = cc.v3(
            (targetPos.x ) ,
            Math.max(currentPos.y, targetPos.y) + jumpHeight,
            (targetPos.z )
        );

        const upTime = jumpTime;
        const downTime = jumpTime * 0.25;

    cc.tween(node)
        .to(upTime, { position: midPos }, { easing: 'sineOut' })
        .to(downTime, { position: targetPos }, { easing: 'sineIn' })
            .call(() => {
                context.setParentKeepWorldPositionAndScale(node, context.containers[0]);
                context.countContainer++;
    
                if (context.countContainer === 3) {
                    AudioEngine.instance.playMatch();
                    context.psNode.active = true;
                    context.ps.resetSystem();
    
                    context.objectsCurrentContainer.forEach((node, index) => {
                        let currentScale = node.scale;
                        const smallScale = currentScale*(1500 / 2100);
                        const shrinkScale = currentScale*(1000 / 2100);
                        let initialPos = node.position;
    
                        cc.tween(node)
                            .to(0.25, {
                                scale: smallScale,
                                position: initialPos
                            }, { easing: 'quadIn' })
    
                            .to(0.4, {
                                scale: currentScale,
                                position: initialPos.add(cc.v3(0, 0, 600))
                            }, { easing: 'backOut' })
    
                            .to(0.35, {
                                scale: shrinkScale,
                                position: initialPos
                            }, { easing: 'sineIn' })
    
                            .by(0.1, { position: cc.v3(-5, 0, 0) })
                            .by(0.1, { position: cc.v3(10, 0, 0) })
                            .by(0.1, { position: cc.v3(-5, 0, 0) })
    
                            .to(0.15, {
                                scale: currentScale,
                                position: initialPos
                            }, { easing: 'sineOut' })
    
                            .call(() => {
                                if (index === context.objectsCurrentContainer.length - 1) {
                                    context.countContainer = 0;
                                    let copiedList = [...context.objectsCurrentContainer];
                                    context.HandleNextContainer(copiedList);
                                    context.objectsCurrentContainer = [];
                                }
                            })
                            .start();
                    });
                }
            })
            .start();
    },
    

    HandleNextContainer(destroyList){
        this.demDone++;
        let firstContainer = this.containers[0]; 
        let secondContainer = this.containers[1]; 
        let thirdContainer = this.containers[2];
        let lastContainer = this.containers[this.containers.length - 1];
        this.currentContainer=null;
        
        let lastContainerPos=lastContainer.position;
        let firstContainerPos = firstContainer.position; 
        let secondContainerPos=secondContainer.position;


        let heightframe = cc.winSize.height;
        let widthframe = cc.winSize.width;
        let outOfScreenPos = cc.v2(-widthframe, firstContainer.y); 
        if (heightframe < widthframe) {
            outOfScreenPos = cc.v2(firstContainer.x, heightframe); 
        }
        cc.tween(firstContainer)
        .to(0.5, { position: cc.v3(outOfScreenPos.x, outOfScreenPos.y, outOfScreenPos.z) }, { easing: "sineInOut" })
        .call(() => {
            destroyList.forEach((node, index) => {
                node.destroy();
            });

            firstContainer.opacity = 0; 

            // Shift container
            this.containers.shift();

            // Đặt lại vị trí cho firstContainer ở cuối hàng trong không gian 3D
            firstContainer.setPosition(lastContainerPos.x, lastContainerPos.y, lastContainerPos.z);
            firstContainer.opacity = 255;
            this.currentContainer = secondContainer;
            this.containers.push(firstContainer);
        })
        .start();

        // Tween di chuyển secondContainer tới vị trí đầu tiên (3D)
        cc.tween(secondContainer)
        .to(0.5, { position: cc.v3(firstContainerPos.x, firstContainerPos.y, firstContainerPos.z) }, { easing: "sineInOut" })
        .call(() => {
            this.AutoPushStackInContainer();
        })
        .start();

        // Tween di chuyển thirdContainer tới vị trí thứ hai (3D)
        cc.tween(thirdContainer)
        .to(0.5, { position: cc.v3(secondContainerPos.x, secondContainerPos.y, secondContainerPos.z) }, { easing: "sineInOut" })
        .start();

    },

    AutoPushStackInContainer(){
        if(this.objectsCurrentStack.length <=0 || !this.currentContainer) {
            return;
        }
        let nameContainer=this.currentContainer.name.split(" ")[1];
        let ObjectHandList=[];
        let ok=false;
        for(let i=0;i < this.objectsCurrentStack.length;i++){
            if(this.objectsCurrentStack[i].name === nameContainer){
                ObjectHandList.push(this.objectsCurrentStack[i]);
            }
            if(ObjectHandList.length >= 3) {
                ok=true;
                break;
            }
        }
        if(ok){
            for(let i=0;i < ObjectHandList.length;i++){
                let obj = ObjectHandList[i];
                let index = this.objectsCurrentStack.indexOf(obj);
                if (index !== -1) {
                    this.objectsCurrentStack.splice(index, 1);
                }
            }
            for(let i=0;i<ObjectHandList.length;i++){
                this.HandleObjectInContainer(ObjectHandList[i]);
            }
            this.SortPosInStack();
            return true;
        }
        return false;
    },

    CheckObjectClickInStack(node){
        if(this.objectsCurrentStack.length <=0) return false;
        for (let i = this.objectsCurrentStack.length - 1; i >= 0; i--) {
            if (this.objectsCurrentStack[i].name === node.name) {
               return true;
            }
        }
        return false;
    },
    PushObjectInStack(node){
        if(this.objectsCurrentStack.length >= 5) {
            this.isEnd=true;
            this.errorScr.showErrorEffect();
            AudioEngine.instance.playLose();
            return;
        }
        AudioEngine.instance.playError();
        let targetNode= this.stack.children[this.objectsCurrentStack.length];
        this.objectsCurrentStack.push(node);
        this.HandleMoveDownTile(node.position);
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v3(0, 0,0));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .start();
    },


    SortPosInStack(){
        for (let i = 0; i < this.objectsCurrentStack.length; i++) {
            let targetNode = this.stack.children[i];
        
            let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v3(0, 0,0));
        
            let targetPos = this.objectsCurrentStack[i].parent.convertToNodeSpaceAR(containerWorldPos);
        
            cc.tween(this.objectsCurrentStack[i])
                .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
                .start();
        }        
    },
    
    HandleMoveDownTile(deletedNodes) {
        const nodesToMove = this.ManagerSpawner.children
        .filter(otherNode => 
            otherNode.position.x === deletedNodes.x &&
            otherNode.position.z < deletedNodes.z
        )
        .sort((a, b) => b.position.z - a.position.z); 
        this.blockX = deletedNodes.x;
        nodesToMove.forEach((node, index) => {
        let newZ = node.position.z + 150; 
        let originScaleX = node.scaleX;
        let originScaleY = node.scaleY;
        let originScaleZ = node.scaleZ;
        cc.tween(node)
            .to(0.3, { position: cc.v3(node.position.x, node.position.y, newZ) }, { easing: 'sineInOut' })
            .call(() => {
                if (index === nodesToMove.length - 1) {
                    ManagerSpawner.instance.SpawnObjectSingle(deletedNodes.x);
                    this.blockX=-5000;
                }
                cc.tween(node)
                .to(0.2, { 
                    scaleX: originScaleX * 1.2,
                    scaleY: originScaleY * 0.8,
                    scaleZ: originScaleZ
                })
                .to(0.2, { 
                    scaleX: originScaleX * 0.9,
                    scaleY: originScaleY * 1.15,
                    scaleZ: originScaleZ
                })
                .to(0.15, { 
                    scaleX: 150,
                    scaleY: 150,
                    scaleZ: 150
                })
                .start();
            })
            .start();
    });
    
    }
    
    

});
module.exports=ManagerClick;