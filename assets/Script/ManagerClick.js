// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const { error } = require('console');
const ManagerSpawner= require('ManagerSpawner');


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
    },

    statics: {
        instance: null,
    },    


    onLoad () {
        ManagerClick.instance=this;
        this.countContainer=0;
        this.countStack=0;
        this.currentContainer=this.containers[0];
        this.ps=this.psNode.getComponent(cc.ParticleSystem);
        this.isEnd=false;
        this.errorScr=this.errorNode.getComponent('Error');
    },

    start () {
    },
    
    AddObjectInContainer(node){
        if(this.isEnd||this.objectsCurrentContainer.includes(node) || this.objectsCurrentStack.includes(node) || !this.currentContainer ){
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
    
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v3(0.05, -0.05, 0));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
    
        this.HandleMoveDownTile(node.position);
    
        cc.tween(node)
            .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
            .call(() => {
                this.setParentKeepWorldPositionAndScale(node, this.containers[0]);
                this.countContainer++;
                if (this.countContainer === 3) {
                        this.psNode.active = true;
                        this.ps.resetSystem();
                        this.objectsCurrentContainer.forEach((node, index) => {
                            let currentScale = node.scale;
                            const smallScale = currentScale * (1500 / 2100);
                            const shrinkScale = currentScale * (1000 / 2100);
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
                                    console.warn(index);
                                    if (index === this.objectsCurrentContainer.length - 1) {
                                        this.countContainer = 0;
                                        let copiedList = [...this.objectsCurrentContainer];
                                        this.HandleNextContainer(copiedList);
                                        this.objectsCurrentContainer = [];
                                    }
                                })
                                .start();
                        });
                    
                }
            })
            .start();
    },
    

    HandleNextContainer(destroyList){
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
       // Tween di chuyển firstContainer ra ngoài màn hình (3D)
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

            this.containers.push(firstContainer);
        })
        .start();

        // Tween di chuyển secondContainer tới vị trí đầu tiên (3D)
        cc.tween(secondContainer)
        .to(0.5, { position: cc.v3(firstContainerPos.x, firstContainerPos.y, firstContainerPos.z) }, { easing: "sineInOut" })
        .call(() => {
            this.currentContainer = this.containers[0];
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
            console.log("STACK RONG HOAC KHONG CO CONTAINER");
            return;
        }
        let nameContainer=this.currentContainer.name.split(" ")[1];
        let ObjectHandList=[];
        ok=false;
        for(let i=0;i < this.objectsCurrentStack.length;i++){
            if(this.objectsCurrentStack[i].name === nameContainer){
                console.warn("PUSHING INTO OBJECT");
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
            console.log("THUA ROI HEHE !! ")
            this.isEnd=true;
            this.errorScr.showErrorEffect();
            return;
        }
        console.error(this.objectsCurrentStack.length);
        let targetNode= this.stack.children[this.objectsCurrentStack.length];
        this.objectsCurrentStack.push(node);
        this.HandleMoveDownTile(node.position);
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 20));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .start();
    },
    SortPosInStack(){
        for (let i = 0; i < this.objectsCurrentStack.length; i++) {
            let targetNode = this.stack.children[i];
        
            // Lấy vị trí world 3D của targetNode (cần Vec3)
            let containerWorldPos = targetNode.worldPosition;  // 3D
        
            // Convert sang vị trí local 3D trong parent của object hiện tại
            let targetPos = this.objectsCurrentStack[i].parent.inverseTransformPoint(containerWorldPos);
        
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
    
    nodesToMove.forEach((node, index) => {
        let newZ = node.position.z + 150; 
    
        let originScaleX = node.scale.x;
        let originScaleY = node.scale.y;
        let originScaleZ = node.scale.z;
    
        cc.tween(node)
            .delay(0.25*index)
            .to(0.3, { position: cc.v3(node.position.x, node.position.y, newZ) }, { easing: 'sineInOut' })
            .call(() => {
                if (index === nodesToMove.length - 1) {
                    ManagerSpawner.instance.SpawnObjectSingle(deletedNodes.x);
                }
    
                // cc.tween(node)
                //     .to(0.2, { 
                //         scale: cc.v3(originScaleX * 1.15, originScaleY * 0.85, originScaleZ)
                //     })
                //     .to(0.2, { 
                //         scale: cc.v3(originScaleX * 0.95, originScaleY * 1.05, originScaleZ)
                //     })
                //     .to(0.15, { 
                //         scale: cc.v3(originScaleX, originScaleY, originScaleZ)
                //     })
                //     .start();
            })
            .start();
    });
    
    }
    
    

});
module.exports=ManagerClick;