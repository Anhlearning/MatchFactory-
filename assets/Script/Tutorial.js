// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { Console } = require("console");
const HandClick = require("./HandClick");
const ManagerSpawner = require("./ManagerSpawner");
const ManagerClick=require("./ManagerClick");
const Tutorial = cc.Class({
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
        Tutorial.instance=this;
        this.heightframe = cc.winSize.height;
        this.widthframe = cc.winSize.width;
        this.loopCurr=10;
        this.currentClickIndex = 0;  
        this.HandClick=this.HandTut.getComponent('HandClick');
        this.spawnedItems = []; // Danh sách lưu bản sao của ItemTutHand
    },
    destroyCloneByIndex(index) {
        if (index < this.spawnedItems.length) {
            let clonedNode = this.spawnedItems[index];
            if (clonedNode) {
                clonedNode.destroy();
                this.spawnedItems[index] = null; // Xóa khỏi danh sách
            }
        }
    },
    start () {
        for (let i = 0; i < ManagerSpawner.instance.ItemTutHand.length; i++) {
            let item = ManagerSpawner.instance.ItemTutHand[i];
            if (item ) {
                let worldPos = item.convertToWorldSpaceAR(cc.v3(0, 0, 0));

                let clonedItem = cc.instantiate(item);
                item.opacity=0;
                this.node.addChild(clonedItem);
        
                let localPos = this.node.convertToNodeSpaceAR(worldPos);

                clonedItem.setPosition(localPos);
                this.spawnedItems.push(clonedItem);
                let rotation = cc.quat();
                cc.Quat.fromEuler(rotation, -90, 0, 0);
                clonedItem.setRotation(rotation);
            }
        }
        
        setTimeout(() => {
            this.HandTut.setSiblingIndex(this.HandTut.parent.children.length - 1);
            this.HandTut.active=true;
            this.HandTut.opacity=255;
            this.SequenHandClick(0);
        }, 500);
    },
    updateSpawnedItemsPosition() {
        if (!ManagerSpawner.instance || !ManagerSpawner.instance.ItemTutHand) return;
        
        for (let i = 0; i < this.spawnedItems.length; i++) {
            let originalItem = ManagerSpawner.instance.ItemTutHand[i];
            let clonedItem = this.spawnedItems[i];
    
            if (originalItem && clonedItem) {
                let worldPos = originalItem.convertToWorldSpaceAR(cc.v3(0, 0, 0));
                let localPos = this.node.convertToNodeSpaceAR(worldPos);
                clonedItem.setPosition(localPos);
            }
        }
    },
    
    SequenHandClick(index) {
        if (!ManagerSpawner.instance.ItemTutHand || ManagerSpawner.instance.ItemTutHand.length === 0) {
            return;
        }
        
        if (index === ManagerSpawner.instance.ItemTutHand.length-1) {
            this.HandClick.HandClickObjectFake(ManagerSpawner.instance.ItemTutHand[index]);
            return;
        }
        let targetNode = ManagerSpawner.instance.ItemTutHand[index];
        if(ManagerClick.instance.objectsCurrentContainer.includes(targetNode) || 
            ManagerClick.instance.objectsCurrentStack.includes(targetNode) ){
            this.SequenHandClick(index+1);
            return;
        }
        this.HandClick.HandClickObject(targetNode,index,0);
    },
    SetActiveNode(index) {
        if (index < ManagerSpawner.instance.ItemTutHand.length) {
            let activeNode=ManagerSpawner.instance.ItemTutHand[index];
            if (activeNode) {
                activeNode.opacity=255;
            }
        }
    },

    SequenHandClickName1(index) {
        if (!ManagerSpawner.instance.ItemTutHandName1 || ManagerSpawner.instance.ItemTutHandName1.length === 0) {
            return;
        }
    
        if (index === ManagerSpawner.instance.ItemTutHandName1.length - 1) {
            this.HandClick.HandClickObjectFake(ManagerSpawner.instance.ItemTutHandName1[index]);
            return;
        }
        
        let targetNode = ManagerSpawner.instance.ItemTutHandName1[index];
        if(ManagerClick.instance.objectsCurrentContainer.includes(targetNode) || 
            ManagerClick.instance.objectsCurrentStack.includes(targetNode) ){
            this.SequenHandClickName1(index+1);
        return;
        }
        cc.warn(targetNode);
        this.HandClick.HandClickObject(targetNode, index , 1);
    },
    
    HideNode(){ 
        for (let i = 0; i < ManagerSpawner.instance.ItemTutHand.length; i++) {
            let item = ManagerSpawner.instance.ItemTutHand[i];
            item.opacity=255;
        }
        this.HandTut.active=false;
        this.TextTut.active=false;
        this.node.active=false;
        this.node.children.forEach(child => {
            if (child !== this.HandTut && child !== this.TextTut) {
                child.active = false;
            }
        });
    },
    ShowNode() {
        this.node.opacity=255;
        this.node.active = true;
        this.HandTut.active = true;

    },
    
});
module.exports=Tutorial;
