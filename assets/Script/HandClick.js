// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const Tutorial = require("./Tutorial");
const HandClick=cc.Class({
    extends: cc.Component,

    properties: {

    },
    statics: {
        instance: null,
    },    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim=this.node.getComponent(cc.Animation);
        HandClick.instance=this;
       // this.registerMouseEvent();
    },
    registerMouseEvent() {
        cc.Canvas.instance.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    },

    onMouseMove(event) {
        let mousePos = event.getLocation();

        // Chuyển đổi tọa độ chuột từ màn hình sang tọa độ node cha của this.node
        let localPos = this.node.parent.convertToNodeSpaceAR(cc.v2(mousePos.x+40, mousePos.y-40));

        // Cập nhật vị trí của bàn tay
        this.node.setPosition(localPos);
    },

    HandClickObject(targetNode,index,number) {
        cc.Tween.stopAllByTarget(this.node);
        if (!targetNode) {
            cc.error("Target node is null!");
            return;
        }
        if (this.anim) {
            let worldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
            let localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
    
            cc.tween(this.node)
                .to(0.5, { position: cc.v2(localPos.x+10, localPos.y-10) }, { easing: "sineInOut" }) // Di chuyển mượt mà
                .call(() => {
                    this.anim.play();
                    this.anim.once("finished", () => { 
                        const ClickObject=targetNode.getComponent('OnClickObject');
                        ClickObject.HandleClickObjectOfTut();
                        Tutorial.instance.destroyCloneByIndex(index);
                        Tutorial.instance.SetActiveNode(index);
                        if(number == 0 ){
                            Tutorial.instance.SequenHandClick(index+1);
                        }
                        else {
                            Tutorial.instance.SequenHandClickName1(index+1);
                        }
                    }, this);
                })
                .start();
        } else {
            cc.error("Không tìm thấy Animation trên node:", this.node.name);
        }
    },
    HandClickObjectFake(targetNode){
        cc.Tween.stopAllByTarget(this.node);
        if (!targetNode) {
            cc.error("Target node is null!");
            return;
        }
        if (this.anim) {
            let worldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
            let localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
            cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .delay(0.5)
                    .to(0.5, { position: cc.v2(localPos.x + 30, localPos.y - 10) }, { easing: "sineInOut" }) 
                    .call(() => {
                        this.anim.play();
                    })
            )
            .start();
        } else {
            cc.error("Không tìm thấy Animation trên node:", this.node.name);
        }
    }
});
module.exports=HandClick;
