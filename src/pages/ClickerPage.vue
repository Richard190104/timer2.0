<template>
  <q-page class="flex flex-center bg-black text-white">
    <div class="column items-center q-pa-lg q-gutter-md text-center max-w-md">
      <div class="text-h3 text-bold">Clicker</div>

      <div class="text-subtitle1">
        Klikaj čo najrýchlejšie počas 5 sekúnd!<br>
        Ak prekonáš svoje skóre {{ minimumScore }}, získaš free spin 
      </div>

      <!-- Hlavný obsah -->
      <div class="q-mt-md">
        <div v-if="state === 'idle'">
          <q-btn color="primary" label="Štart" @click="startGame" />
        </div>

        <div v-else-if="state === 'playing'">
          <div class="text-h5 q-mb-sm">Skóre: {{ score }}</div>
          <q-btn color="secondary" label="Klikni!" @click="click" />
          <div class="q-mt-sm text-accent">Čas: {{ (timeLeft / 1000).toFixed(1) }} s</div>
        </div>

        <div v-else-if="state === 'submitting'">
          <q-spinner color="white" size="2em" />
          <div class="q-mt-sm">Spracúvam výsledok...</div>
        </div>

        <div v-else-if="state === 'done'">
          <div class="text-h5">Tvoje skóre: {{ score }}</div>
          <div v-if="isNewBest" class="text-green text-h6">🔥 Nový rekord!</div>
          <div v-else class="text-grey text-h6">Skús to znova!</div>
          <q-btn color="primary" label="Hrať znova" @click="resetGame" class="q-mt-md" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, onMounted } from 'vue'
import type { click } from 'components/models'

export default defineComponent({
  name: 'ClickerPage',
  setup() {
    const minimumScore = ref(0)
    const score = ref(0)
    const timeLeft = ref(0)
    const token = ref('')
    const isNewBest = ref(false)
    const state = ref<'idle' | 'playing' | 'submitting' | 'done'>('idle')
    const clickData = ref<click[]>([])
    let timer: number | null = null

    const click = () => {
      if (state.value !== 'playing') return
      score.value++
      clickData.value.push({ score: score.value, timeLeft: timeLeft.value })
    }

    const startGame = async () => {
      if (state.value !== 'idle') return
      state.value = 'submitting' 
      score.value = 0
      clickData.value = []
      isNewBest.value = false

      try {
        const res = await fetch('https://timer-backend-24n3.vercel.app/api/getToken', {
          method: 'POST'
        })
        const data = await res.json()
        if (!data.token) throw new Error('Token missing')
        token.value = data.token
      } catch (err) {
        console.error('Nepodarilo sa načítať token:', err)
        state.value = 'idle'
        return
      }

      state.value = 'playing'
      timeLeft.value = 5000

      timer = window.setInterval(() => {
        timeLeft.value -= 100
        if (timeLeft.value <= 0) {
          clearInterval(timer!)
          void endGame()
        }
      }, 100)
    }

    const endGame = async () => {
      state.value = 'submitting'
      if (timer) clearInterval(timer)
      try {
        const res = await fetch('https://timer-backend-24n3.vercel.app/api/clickerSubmit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: score.value, token: token.value, clicks: clickData.value })
        })

        const data = await res.json()
        if (!res.ok) {
          console.error('Chyba:', data.error)
          isNewBest.value = false
        } else {
          isNewBest.value = !!data.isNewBest
          minimumScore.value = data.previousBest ?? minimumScore.value
        }
      } catch (err) {
        console.error('Chyba pri odosielaní:', err)
        isNewBest.value = false
      }

      state.value = 'done'
      token.value = ''
    }

    const resetGame = () => {
      state.value = 'idle'
      score.value = 0
      clickData.value = []
      isNewBest.value = false
    }

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    onMounted(() => {
        fetch('https://timer-backend-24n3.vercel.app/api/getClickerScore')
        .then(res => res.json())
        .then(data => data.score || 0)
        .then(bestScore => {
          minimumScore.value = bestScore
        })
        .catch(() => 0)
    })

    return {
      minimumScore,
      score,
      timeLeft,
      state,
      click,
      startGame,
      endGame,
      resetGame,
      isNewBest
    }
  }
})
</script>

<style scoped>
.q-page {
  text-align: center;
}
</style>
