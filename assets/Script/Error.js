// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        endGameNode:cc.Node,
    },
    onLoad(){
        this.endGame=this.endGameNode.getComponent('EndGameUI');
    },
    showErrorEffect() {
        if (!this.node.active) {
            this.node.active = true; // Bật node lên
            this.node.opacity = 0;   // Set opacity về 0 để chuẩn bị fade in
        }
    
        const originalScaleX = this.node.scaleX;
        const originalScaleY = this.node.scaleY;
    
        cc.tween(this.node)
            .to(0.3, { opacity: 255, scale: originalScaleX * 1.2 }, { easing: 'sineOut' }) // Hiện dần + scale to nhẹ
            .to(0.2, { scaleX: originalScaleX, scaleY: originalScaleY }) // Thu về lại kích thước ban đầu
    
            .by(0.1, { position: cc.v2(-10, 0) }) // Rung trái
            .by(0.1, { position: cc.v2(20, 0) })  // Rung phải
            .by(0.1, { position: cc.v2(-10, 0) }) // Rung về lại giữa
            .call(()=>{
                this.node.active=false;
                this.endGameNode.active=true;
                this.endGame.BoradCastAnimation();
            })
            .start();
    }
    
    
});
