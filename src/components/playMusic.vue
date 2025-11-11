<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Pusti si pesničku" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog" position="top">
      <q-card style="width: 350px">
        <q-linear-progress
          :value="progress"
          color="pink"
          track-color="grey-3"
          style="transition: width 0.1s;"
        />

        <q-card-section class="row items-center">
          <div>
            <div class="text-weight-bold">Fakt dobra pesnicka</div>
            <div class="text-grey">Ti co spravili revilko lebo potom by sa seci posrali</div>
          </div>

          <q-space />

          <q-btn flat round icon="fast_rewind" @click="rewind" />
          <q-btn
            flat
            round
            :icon="isPlaying ? 'pause' : 'play_arrow'"
            @click="togglePlay"
          />
          <q-btn flat round icon="fast_forward" @click="forward" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import songFile from 'src/assets/music/Las Ketchup - Asereje.mp3'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const dialog = ref(false)
    const audio = new Audio(songFile)
    const isPlaying = ref(false)
    const progress = ref(0)

    const updateProgress = () => {
      if (audio.duration > 0) {
        progress.value = audio.currentTime / audio.duration
      }
    }

    const togglePlay = () => {
    if (isPlaying.value) {
        audio.pause()
    } else {
        void audio.play() 
    }
    isPlaying.value = !isPlaying.value
    }

    const rewind = () => {
      audio.currentTime = Math.max(audio.currentTime - 5, 0)
    }

    const forward = () => {
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration)
    }

    onMounted(() => {
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('ended', () => (isPlaying.value = false))
    })

    onBeforeUnmount(() => {
      audio.pause()
      audio.removeEventListener('timeupdate', updateProgress)
    })

    return { dialog, isPlaying, progress, togglePlay, rewind, forward }
  },
})
</script>
