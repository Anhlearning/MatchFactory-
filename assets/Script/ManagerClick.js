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
        container: cc.Node,
        stack:cc.Node,
    },
    statics: {
        instance: null,
    },    


    onLoad () {
        ManagerClick.instance=this;
        this.countContainer=0;
    },

    start () {
        if(ManagerSpawner){
            console.log("CO Manager Spawner");
        }
    },
    
    AddObjectInContainer(node){
        if(this.objectsCurrentContainer.includes(node) || this.objectsCurrentStack.includes(node)){
            console.log("Đã vào trong hàng đợi hoặc container");
            return ;
        }
        if (this.objectsCurrentContainer.length === 0) {
            if(this.CheckObjectClickInStack(node)){
                this.HandleObjectInStack(node);
            }
            else {
                this.HandleObjectInContainer(node);
            }
            return;

        }
    
        let isNameExist = false;
        
        if (this.objectsCurrentContainer[0].name === node.name) {
            isNameExist = true;
        }
        
        if (isNameExist) {
           this.HandleObjectInContainer(node);
        } 
        else {
            this.PushObjectInStack(node);
        }
    },
    
    CheckObjectClickInStack(node){
        if(this.objectsCurrentStack.length <=0) return false;
        for (let i = this.objectsCurrentStack.length - 1; i >= 0; i--) {
            if (this.objectsCurrentStack[i].name === node.name) {
               return true;
            }
        }
        console.log("push object co ten la: "+node.name);
        this.PushObjectInStack(node);
        return false;
    },
    PushObjectInStack(node){
        if(this.objectsCurrentStack.length>=5) {
            console.log("THUA ROI HEHE !! ")
            return;
        }
        this.objectsCurrentStack.push(node);
        let targetNode= this.stack.children[this.objectsCurrentStack.length-1];
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
    HandleObjectInContainer(node){
        this.objectsCurrentContainer.push(node);
        let targetNode= this.container.children[this.objectsCurrentContainer.length-1];
        let containerWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let targetPos = node.parent.convertToNodeSpaceAR(containerWorldPos);
        cc.tween(node)
        .to(0.5, { position: targetPos }, { easing: 'sineInOut' })
        .call(()=>{
                this.countContainer++;
                if (this.countContainer === 3) {
                    this.objectsCurrentContainer.forEach(node => {
                        node.destroy();
                    });
                    this.countContainer=0;
                    this.objectsCurrentContainer=[];
                }
            })
            .start();
    },
    HandleObjectInStack(node){
        console.log("HANDLE IN STACK");
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
    }

});
module.exports=ManagerClick;