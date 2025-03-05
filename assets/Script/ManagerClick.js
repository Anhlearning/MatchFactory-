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
        let worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        let currentScale = node.scale; // Lưu scale hiện tại
    
        node.setParent(newParent);
    
        let localPos = newParent.convertToNodeSpaceAR(worldPos);
        node.position = localPos;
    
        let parentScale = newParent.scale; 
        node.scale = currentScale / parentScale; // Cân chỉnh lại scale để không bị ảnh hưởng bởi scale của newParent
    },    

    HandleObjectInContainer(node){
        if(this.objectsCurrentContainer.length>=3) return;
        let targetNode= this.containers[0].children[this.objectsCurrentContainer.length];

        this.objectsCurrentContainer.push(node);
        
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 20));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);

        this.HandleMoveDownTile(node.position);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .call(()=>{
                this.setParentKeepWorldPositionAndScale(node, this.containers[0]);

                this.countContainer++;
                if (this.countContainer === 3) {
                    this.psNode.active=true;
                    this.ps.resetSystem();   // Phát particle

                    this.ps.finished = () => {  
                        console.log("FINISHED");
                        this.psNode.active = false;
                    };
                    let initialScale = 0.3 * (1/0.6);
                    this.objectsCurrentContainer.forEach((node,index) => {
                        let heightframe = cc.winSize.height;
                        let widthframe = cc.winSize.width;
                        let outOfScreenPos = cc.v2(-widthframe, node.y); 
                        if (heightframe < widthframe) {
                            outOfScreenPos = cc.v2(node.x, heightframe); 
                        }
                        cc.tween(node)
                            .to(0.25, { scale: 0.1* (1/0.6)  }, { easing: 'quadIn' }) // Thu nhỏ nhanh
                            .by(0.4, { position: cc.v2(0, 60), scale: 0.30* (1/0.6) }, { easing: 'backOut' }) // Nảy mạnh lên, scale vượt mức ban đầu
                            .by(0.35, { position: cc.v2(0, -60), scale: -0.15 * (1/0.6) }, { easing: 'sineIn' }) // Nhún xuống, scale về nhẹ hơn
                            .by(0.1, { position: cc.v2(-5, 0) })
                            .by(0.1, { position: cc.v2(10, 0) })
                            .by(0.1, { position: cc.v2(-5, 0) })
                            .to(0.15, { scale: initialScale }, { easing: 'sineOut' }) 
                            .call(()=>{
                                if (index === this.objectsCurrentContainer.length - 1) {
                                    this.countContainer = 0;
                                    let copiedList = [...this.objectsCurrentContainer];
                                    this.objectsCurrentContainer = [];
                                    this.HandleNextContainer(copiedList);
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
            // Nếu màn hình dọc -> di chuyển lên trên
            outOfScreenPos = cc.v2(firstContainer.x, heightframe); 
        }
        cc.tween(firstContainer)
        .to(0.5, { position: outOfScreenPos }, { easing: "sineInOut" })
        .call(() => {
            destroyList.forEach((node,index) => {
                node.destroy();
            });
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
                this.AutoPushStackInContainer();
            })
            .start();
        cc.tween(thirdContainer)
        .to(0.5, { position: secondContainerPos}, { easing: "sineInOut" })
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
        for(let i=0;i<this.objectsCurrentStack.length;i++){
            let targetNode= this.stack.children[i];  
            let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 20));
            let targetPos = this.objectsCurrentStack[i].parent.convertToNodeSpaceAR(containerWorldPos);
            cc.tween(this.objectsCurrentStack[i])
            .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
            .start();
        }
    },
    
    HandleMoveDownTile(deletedNodes) {
        const nodesToMove = this.ManagerSpawner.children
            .filter(otherNode => otherNode.position.x === deletedNodes.x && otherNode.position.y > deletedNodes.y)
            .sort((a, b) => a.position.y - b.position.y); // Sắp xếp từ dưới lên
        nodesToMove.forEach((node, index) => {
            let newY = node.position.y - 150;
            let originScaleX = 0.3;
            let originScaleY = 0.3;
            cc.tween(node)
                .to(0.3, { position: cc.v2(node.position.x, newY) }, { easing: 'sineInOut' })
                .call(() => {
                    if(index === nodesToMove.length - 1){
                        ManagerSpawner.instance.SpawnObjectSingle(deletedNodes.x);
                    }
                    cc.tween(node)
                        .to(0.2, { scaleY: originScaleY * 0.85, scaleX: originScaleX * 1.15 })
                        .to(0.2, { scaleY: originScaleY * 1.05, scaleX: originScaleX * 0.95 })
                        .to(0.15, { scaleY: originScaleY, scaleX: originScaleX })
                        .start();
                })
                .start();
        });
    }
    
    

});
module.exports=ManagerClick;