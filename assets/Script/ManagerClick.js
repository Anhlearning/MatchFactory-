// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const ManagerSpawner= require('ManagerSpawner');


const ManagerClick=cc.Class({
    extends: cc.Component,

    properties: {
        objectsCurrentContainer:[],
        objectsCurrentStack:[],
        containers: [cc.Node],
        stack:cc.Node,
        ManagerSpawner:cc.Node,
    },
    statics: {
        instance: null,
    },    


    onLoad () {
        ManagerClick.instance=this;
        this.countContainer=0;
        this.countStack=0;
        this.currentContainer=this.containers[0];
    },

    start () {
    },
    
    AddObjectInContainer(node){
        if(this.objectsCurrentContainer.includes(node) || this.objectsCurrentStack.includes(node)){
            console.log("Đã vào trong hàng đợi hoặc container");
            return ;
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
        listObjectSameName=[];
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


 

    HandleObjectInContainer(node){
        if(this.objectsCurrentContainer.length>=3 || !this.currentContainer) return;
        let targetNode= this.containers[0].children[this.objectsCurrentContainer.length];
        this.objectsCurrentContainer.push(node);
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        this.HandleMoveDownTile(node.position);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .call(()=>{
                this.countContainer++;
                if (this.countContainer === 3) {
                    this.HandleNextContainer()
                    this.objectsCurrentContainer.forEach(node => {
                        node.destroy();
                    });
                    this.countContainer=0;
                    this.objectsCurrentContainer=[];
                }
            })
            .start();
    },

    HandleNextContainer(){
        let firstContainer = this.containers[0]; 
        let secondContainer = this.containers[1]; 
        let thirdContainer = this.containers[2];
        let lastContainer = this.containers[this.containers.length - 1];
        this.currentContainer=null;
        
        let lastContainerPos=lastContainer.position;
        let firstContainerPos = firstContainer.position; 
        let secondContainerPos=secondContainer.position;
        let screenWithd=cc.winSize.width;
        let outOfScreenPos = cc.v2(firstContainerPos.x - screenWithd, firstContainerPos.y); 

        cc.tween(firstContainer)
        .to(0.5, { position: outOfScreenPos }, { easing: "sineInOut" })
        .call(() => {
            firstContainer.opacity = 0; 
            this.containers.shift();
            firstContainer.position = cc.v2(lastContainerPos.x, lastContainerPos.y);
            

            firstContainer.opacity = 255; 


            this.containers.push(firstContainer);
        })
        .start();

    
        cc.tween(secondContainer)
            .to(0.5, { position: firstContainerPos }, { easing: "sineInOut" })
            .call(()=>{
                this.currentContainer=this.containers[0];
            })
            .start();
        cc.tween(thirdContainer)
        .to(0.5, { position: secondContainerPos}, { easing: "sineInOut" })
        .start();
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
            console.log("THUA ROI HEHE !! ")
            return;
        }
        console.error(this.objectsCurrentStack.length);
        let targetNode= this.stack.children[this.objectsCurrentStack.length];
        this.objectsCurrentStack.push(node);
        this.HandleMoveDownTile(node.position);
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 30));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .start();
    },
    SortPosInStack(){
        for(let i=0;i<this.objectsCurrentStack.length;i++){
            let targetNode= this.stack.children[i];
            let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 30));
            let targetPos = this.objectsCurrentStack[i].parent.convertToNodeSpaceAR(containerWorldPos);
            cc.tween(this.objectsCurrentStack[i])
            .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
            .start();
        }
    },
    
    HandleMoveDownTile(deletedNodes){
        this.ManagerSpawner.children.forEach(otherNode => {
            if (otherNode.position.x === deletedNodes.x && otherNode.position.y > deletedNodes.y) {
                let newY = otherNode.position.y - 180;
                cc.tween(otherNode)
                    .to(0.3, { position: cc.v2(otherNode.position.x, newY) }, { easing: 'sineInOut' })
                    .start();
            }
        });
    },

});
module.exports=ManagerClick;