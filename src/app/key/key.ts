import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { AudioPlayer } from '../audio/audioPlayer';

@Component({
    selector: 'key',
    templateUrl: './key.html',
    styleUrls: ['./key.scss'],
    host: {
        '(document:keydown)': 'keypress($event)',
        '(document:keyup)': 'release($event)',
        '(click)': 'click()'
    }
})
export class KeyComponent implements OnInit {
    @Input() tone: string;
    @Input() key: string;
    @Input() name: string;
    @HostBinding('class.black') @Input() black: boolean = false; 
    @HostBinding('class.pressed') pressed: boolean = false;
    private context: AudioContext;
    private toneAudio: AudioBuffer;
    private loaded: boolean = false;
    
    constructor(private audioService: AudioPlayer) {}

    ngOnInit() {
        this.loadTone()
        if (!this.name) {
            this.name = this.key;
        }
    }

    loadTone() {
        this.audioService.loadSound('/assets/audio/piano/'+this.tone+'.ogg')
            .then((buffer) => {
                this.toneAudio = buffer;
                this.loaded = true;
            });
    }

    getKeyName(event: KeyboardEvent) {
        var key = event.key;
        if (key.toLowerCase() === 'dead') {
            key = event.code;
        }
        return key.toLowerCase();
    }

    keypress(event: KeyboardEvent) {
        if (this.getKeyName(event) === this.key.toLowerCase() &&
            event.repeat !== true) {
            this.playTone();
        }
    }

    click() {
        this.playTone();
        setTimeout(() => this.setPressed(false), 200);
    }

    playTone() {
        if (!this.loaded) return;

        this.setPressed(true);
        this.audioService.playSound(this.toneAudio);
    }

    release(event: KeyboardEvent) {
        if (this.getKeyName(event) === this.key.toLowerCase()) {
            this.setPressed(false);
        }
    }

    setPressed(what: boolean) {
        this.pressed = what;
    }
}
