const CanvasSize=cc.Class({
    extends: cc.Component,
    statics: {
        instance: null,
    },  
    onLoad() {
        this.adjustCanvasSize();
        CanvasSize.instance = this; 
        this.canvas = this.getComponent(cc.Canvas);
    },

    adjustCanvasSize() {
        if (!this.canvas) {
            cc.warn('Canvas component not found!');
            return;
        }

        const designResolution = cc.view.getDesignResolutionSize();
        const frameSize = cc.view.getFrameSize();

        const designAspectRatio = designResolution.width / designResolution.height;
        const frameAspectRatio = frameSize.width / frameSize.height;

        if (frameAspectRatio > designAspectRatio) {
            this.canvas.fitHeight = true;
            this.canvas.fitWidth = false;
        } else {
            this.canvas.fitWidth = true;
            this.canvas.fitHeight = false;
        }
    },
});
module.exports=CanvasSize;  
