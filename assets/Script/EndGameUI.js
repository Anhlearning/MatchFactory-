// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
const Config = require('./Config');
const AudioEngine = require('./AudioEngine');
cc.Class({
    extends: cc.Component,

    properties: {
        downloadBtn:cc.Node,
        picture:cc.Node,
        endcard:cc.Node,
        goodIcon:cc.Node,
    },

    showUIWithEffect(node) {
        AudioEngine.instance.playWinLevel();
        Config.onEndGame();
        node.scale = 0;  // Bắt đầu từ nhỏ
        node.angle = 0;  // Góc xoay ban đầu
    
        node.active = true;  // Đảm bảo UI hiện ra
        
        cc.tween(node)
            .parallel(
                cc.tween().to(2, { scale: 1.1 }, { easing: 'backOut' }),  // Scale lớn dần với hiệu ứng nảy nhẹ
                cc.tween().by(2, { angle: 720 }, { easing: 'cubicOut' })  // Xoay 360 độ
            )
            .to(0.5, { scale: 1 }, { easing: 'sineOut' })  // Thu nhẹ về scale 1 cho tự nhiên
            .start();
    },
    playScaleStrongEffect(button) {
        let originScaleX = button.scaleX;
        let originScaleY = button.scaleY;
    
        cc.tween(button)
            .repeatForever(
                cc.tween()
                    .to(0.2, { scaleX: originScaleX * 1.2, scaleY: originScaleY * 1.2 }, { easing: 'quadOut' })
                    .to(0.15, { scaleX: originScaleX * 0.9, scaleY: originScaleY * 0.9 }, { easing: 'quadIn' })
                    .to(0.15, { scaleX: originScaleX * 1.05, scaleY: originScaleY * 1.05 }, { easing: 'backOut' })
                    .to(0.15, { scaleX: originScaleX, scaleY: originScaleY }, { easing: 'sineOut' })
                    .by(0.05, { position: cc.v2(-3, 0) })
                    .by(0.05, { position: cc.v2(6, 0) })
                    .by(0.05, { position: cc.v2(-3, 0) })
                    .delay(1.5)
            )
            .start();
    },    
    playSoftScaleEffect(button) {
        let originScaleX = button.scaleX;
        let originScaleY = button.scaleY;
    
        cc.tween(button)
            .repeatForever(
                cc.tween()
                    .to(1.2, { scaleX: originScaleX * 1.2, scaleY: originScaleY * 1.2 }, { easing: 'sineInOut' })
                    .to(1, { scaleX: originScaleX, scaleY: originScaleY }, { easing: 'sineInOut' })
            )
            .start();
    },
    BoradCastAnimation () {
        this.showUIWithEffect(this.node);
        this.playScaleStrongEffect(this.goodIcon);
        this.playSoftScaleEffect(this.downloadBtn);
    },
    ClickButtonEndGame(){
        Config.openLinkApp();
    }
});
