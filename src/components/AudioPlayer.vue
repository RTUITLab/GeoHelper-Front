<template lang="html">
  <div class="c-audio-player not-selectable">
    <play v-if="!isPlaying" @click="changePlaying"></play>
    <pause v-else @click="changePlaying"></pause>
    <div class="c-player-time">{{ currentTime() }}</div>

    <div class="timeline" :style="lineWidth()" @click="changeCurrentTime"></div>

    <div class="c-player-time">{{ duration() }}</div>
    <audio ref="audio" :src="src"></audio>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Play from '@/assets/svg/Play.vue';
import Pause from '@/assets/svg/Pause.vue';

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);

  return `${minutes}:${seconds > 9 ? seconds : `0${seconds.toString()}`}`;
};

@Options({
  components: {
    Pause,
    Play,
  },
  props: {
    src: String,
  },
})
export default class AudioPlayer extends Vue {
  public isPlaying = false;

  private interval = 0;

  private audio!: HTMLAudioElement;

  public changePlaying(): void {
    this.audio = (this.$refs.audio as HTMLAudioElement);
    if (this.isPlaying) {
      this.audio.pause();
      clearInterval(this.interval);
    } else {
      this.audio.play();
      this.$forceUpdate();
      this.interval = setInterval(this.$forceUpdate, 500);
    }
    this.isPlaying = !this.isPlaying;
  }

  public currentTime(): string {
    if (this.audio && this.audio.currentTime) {
      console.log(this.audio.currentTime);
      const time = this.audio.currentTime;
      return formatTime(time);
    }

    return '0:00';
  }

  public duration(): string {
    if (this.audio && this.audio.duration) {
      console.log(this.audio.duration);
      const time = this.audio.duration;
      return formatTime(time);
    }

    return '0:00';
  }

  public lineWidth() {
    if (this.audio && this.audio.duration && this.audio.currentTime) {
      return { '--line-width': `${(this.audio.currentTime / this.audio.duration) * 100}%` };
    }

    return { '--line-width': '0%' };
  }

  mounted(): void {
    // @ts-ignore
    this.$watch(() => this.src, (val) => {
      this.audio = this.$refs.audio as HTMLAudioElement;
      this.$forceUpdate();
      this.audio.oncanplay = () => this.$forceUpdate();
    }, { immediate: true });
  }

  public changeCurrentTime(e: MouseEvent) {
    if (this.audio && this.audio.duration) {
      const elem = e.target as HTMLElement;

      this.audio.currentTime = this.audio.duration * ((e.clientX - elem.offsetLeft) / elem.clientWidth);
    }
  }
}
</script>

<style lang="scss" scoped>
.c-audio-player {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  color: var(--black);
  outline: none;

  .c-player-time {
    margin: 0 8px;
    width: 40px;
    font-size: 14px;
    color: var(--grafit);
  }

  .timeline {
    position: relative;
    height: 4px;
    width: 100%;
    background-color: var(--grafit);
    cursor: pointer;

    &::before {
      content: ' ';
      position: absolute;
      height: 4px;
      width: var(--line-width);
      background-color: var(--deep-blue);
    }
  }
}
</style>
