import CONFIG from "Config";
const AudioEngine = cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: [],
            type: [cc.AudioClip]
        }
    },

    statics: {
        instance: null,
    },

    onLoad: function () {
        AudioEngine.instance = this;
        if (this.currentAudio == null) {
            this.currentAudio = new Array(this.audio.length);
        }
        this.canPlayPunch = true;
    },

    playBackground() {
        this.volumeBG = 1;
        if (this.currentAudio == null) {
            this.currentAudio = new Array(this.audio.length);
        }
        if (CONFIG.PlayableAdsType == CONFIG.IronSource) {
            this.isStarted = true;
            if (typeof (window.playAudioThepn) !== 'undefined') {
                if (window.playAudioThepn) {
                    this.currentAudio[0] = cc.audioEngine.play(this.audio[0], true, this.volumeBG);
                    CONFIG.isPlaySound = true;
                } else {
                    this.currentAudio[0] = cc.audioEngine.play(this.audio[0], true, 0);
                }
                this.playAudioThepn = window.playAudioThepn;
            }
        } else {
            if (CONFIG.isPlaySound) {
                this.currentAudio[0] = cc.audioEngine.play(this.audio[0], true, this.volumeBG);
            }
        }
    },

    playBirdTweet() {
        if (CONFIG.isPlaySound) {
            let randomIndex = Math.floor(Math.random() * 9) + 1;
            this.currentAudio[1] = cc.audioEngine.play(this.audio[randomIndex], false, 0.8);
        }
    },
    playBirdFly(){
        if (CONFIG.isPlaySound) {
            let randomIndex = Math.floor(Math.random() * 2) + 10;
            this.currentAudio[2] = cc.audioEngine.play(this.audio[randomIndex], false, 0.8);
        }
    },
    playNotifyEndGame(){
        if (CONFIG.isPlaySound) {
            this.currentAudio[3] = cc.audioEngine.play(this.audio[12], false, 0.8);
        }
    },
    playLeaveBusStop() {
        var ran = cc.randomBetween(1, 3);
        if (ran == 1) {
            this.playLeaveBusStop1();
        } else if (ran == 2) {
            this.playLeaveBusStop2();
        } else {
            this.playLeaveBusStop3();
        }
    },
    playMoveBusStop() {
        var ran = cc.randomBetween(1, 3);
        if (ran == 1) {
            this.playMoveBusStop1();
        } else if (ran == 2) {
            this.playMoveBusStop2();
        } else {
            this.playMoveBusStop3();
        }
    },
    playMoveBusStop1() {
        if (CONFIG.isPlaySound) {
            this.currentAudio[6] = cc.audioEngine.play(this.audio[6], false, 1);
        }
    },
    playMoveBusStop2() {
        if (CONFIG.isPlaySound) {
            this.currentAudio[10] = cc.audioEngine.play(this.audio[10], false, 1);
        }
    },
    playMoveBusStop3() {
        if (CONFIG.isPlaySound) {
            this.currentAudio[11] = cc.audioEngine.play(this.audio[11], false, 1);
        }
    },
    playGameOver() {
        if (CONFIG.isPlaySound) {
            this.currentAudio[7] = cc.audioEngine.play(this.audio[7], false, 1);
        }
    },
    playWin() {
        if (CONFIG.isPlaySound) {
            this.currentAudio[9] = cc.audioEngine.play(this.audio[9], false, 1);
        }
    },
    playTictac() {
        if (CONFIG.isPlaySound) {
            this.currentAudio[12] = cc.audioEngine.play(this.audio[12], false, 1);
        }
    },
    muteIS() {
        console.log("mute");
        CONFIG.isPlaySound = false;
        cc.audioEngine.stop(this.currentAudio[0]);
    },
    unMuteIS() {
        console.log("unmute");
        CONFIG.isPlaySound = true;
        try {
            cc.audioEngine.stop(this.currentAudio[0]);
        } catch (error) {
        }
        this.currentAudio[0] = cc.audioEngine.play(this.audio[0], true, this.volumeBG);
    },
    muteAudio() {
        if (CONFIG.PlayableAdsType === CONFIG.Adcolony) {
            cc.audioEngine.stop(this.currentAudio[0]);
        } else {
            cc.audioEngine.setVolume(this.currentAudio[0], 0);
        }
    },

    unmuteAudio() {
        if (CONFIG.isPlaySound)
            if (CONFIG.PlayableAdsType === CONFIG.Adcolony) {
                cc.audioEngine.stop(this.currentAudio[0]);
                this.currentAudio[0] = cc.audioEngine.play(this.audio[0], true, this.volumeBG);
            } else {
                cc.audioEngine.setVolume(this.currentAudio[0], this.volumeBG);
            }
    },

    onDestroy: function () {
        for (var i = 0; i < this.currentAudio.length; i++) {
            cc.audioEngine.stop(this.currentAudio[i]);
        }
    }
});

module.exports = AudioEngine;