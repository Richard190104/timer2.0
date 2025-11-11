<template>
  <q-dialog>
    <div class="q-pa-md flex flex-center column bg-blue-grey-10">
      <q-card class="q-pa-lg flex flex-center column bg-black text-white">
        <div class="text-h5 text-center q-mb-md">Točka</div>

        <!-- Wheel -->
        <div class="wheel-wrapper">
          <div class="wheel" :style="{ transform: `rotate(${rotation}deg)` }">
            <svg viewBox="0 0 200 200" class="wheel-svg">
              <g
                v-for="(segment, i) in segments"
                :key="i"
                :transform="`rotate(${i * (360 / segments.length)} 100 100)`"
              >
                <path
                  :d="segmentPath"
                  :fill="segment.color"
                  stroke="black"
                  stroke-width="0.8"
                />
              </g>
            </svg>
          </div>
          <div class="pointer"></div>
        </div>

        <!-- Free spins -->
        <div class="text-subtitle1 q-mt-md">
          Free Spins: {{ freeSpins }}
        </div>

        <!-- User chooses spin price -->
        <q-input
        v-model.number="price"
        type="number"
        label="Cena točky (1 - 10)"
        outlined
        dense
        dark
        color="primary"
        text-color="primary"
        input-style="color: white;" 
        class="q-mt-sm"
        min="1"
        max="10"
        style="width: 150px; text-align: center;"
        />

        <q-btn
          color="primary"
          class="q-mt-lg text-white"
          :disable="spinning"
          label="SPIN"
          @click="spinWheel"
        />

        <transition name="fade">
          <div
            v-if="showResult"
            class="q-mt-lg text-h6 text-center result"
            :class="{ 'text-positive': isWin, 'text-negative': !isWin }"
          >
            {{ resultMessage }}
          </div>
        </transition>
      </q-card>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'SpinWheel',

  setup() {
    // 🧩 Data
    const segments = [
      { color: '#e53935', value: 0 }, // red
      { color: '#43a047', value: 1 }, // green
      { color: '#e53935', value: 0 },
      { color: '#43a047', value: 1 },
      { color: '#e53935', value: 0 },
      { color: '#43a047', value: 1 },
      { color: '#e53935', value: 0 },
      { color: '#43a047', value: 1 },
    ]

    const segmentPath = describeArc(100, 100, 95, 0, 360 / segments.length)
    const rotation = ref(0)
    const spinning = ref(false)
    const showResult = ref(false)
    const resultMessage = ref('')
    const isWin = ref(false)
    const currentRotation = ref(0)
    const freeSpins = ref(0)
    const price = ref(1)

    // 🧭 Helper functions
    function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
      const start = polarToCartesian(x, y, radius, endAngle)
      const end = polarToCartesian(x, y, radius, startAngle)
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
      return [
        'M', x, y,
        'L', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        'Z'
      ].join(' ')
    }

    function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
      const rad = (angle - 90) * Math.PI / 180.0
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      }
    }

    // 🌀 Fetch free spins
    async function getFreeSpins() {
      try {
        const response = await fetch('https://timer-backend-24n3.vercel.app/api/getFreeSpins')
        const data = await response.json()
        freeSpins.value = data.freeSpins ?? data.message?.freeSpins ?? 0
      } catch (error) {
        console.error('Fetch error:', error)
        freeSpins.value = 0
      }
    }

    // 🎯 Spin logic
    async function spinWheel() {
      if (spinning.value) return
      if (price.value < 1 || price.value > 10) {
        alert('Cena musí byť medzi 1 a 10!')
        return
      }

      spinning.value = true
      showResult.value = false
      resultMessage.value = ''

      try {
        const resp = await fetch('https://timer-backend-24n3.vercel.app/api/spin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: price.value }), // 💰 User-chosen price
        })
        const data = await resp.json()

        // Aktualizuj freeSpins z backendu
        freeSpins.value = data.freeSpins ?? freeSpins.value
        isWin.value = data.win

        const degPerSegment = 360 / segments.length
        currentRotation.value = rotation.value % 360

        // nájdi správny cieľový segment podľa výsledku
        const validSegments = segments
          .map((s, i) => (s.value === (isWin.value ? 1 : 0) ? i : -1))
          .filter((i) => i !== -1)
        const targetIndex = validSegments[Math.floor(Math.random() * validSegments.length)]
        const targetAngle = targetIndex ? targetIndex * degPerSegment + degPerSegment / 2 : 0

        let diff = 360 - currentRotation.value - targetAngle
        if (diff < 0) diff += 360

        const extraSpins = 360 * 5
        const finalRotation = rotation.value + extraSpins + diff
        const duration = 6000
        const startRotation = rotation.value
        const start = performance.now()

        const animate = (time: number) => {
          const progress = Math.min((time - start) / duration, 1)
          const easeOut = 1 - Math.pow(1 - progress, 3)
          rotation.value = startRotation + (finalRotation - startRotation) * easeOut

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            rotation.value = finalRotation
            spinning.value = false
            setTimeout(() => {
              if (isWin.value) {
                resultMessage.value = `Sak skrachujem dpc. Vyhral si ${data.message.toFixed(2)} kreditov`
              } else {
                resultMessage.value = 'Haha kokotko'
              }
              showResult.value = true
            }, 400)
          }
        }

        requestAnimationFrame(animate)
      } catch (err) {
        console.error(err)
        spinning.value = false
        resultMessage.value = '⚠️ Chyba pri komunikácii so serverom.'
        showResult.value = true
      }
    }

    // 🔄 Load free spins on mount
    onMounted(() => {
      void getFreeSpins()
    })

    return {
      segments,
      rotation,
      spinning,
      showResult,
      resultMessage,
      isWin,
      spinWheel,
      segmentPath,
      freeSpins,
      getFreeSpins,
      price,
    }
  },
})
</script>

<style scoped>
.wheel-wrapper {
  position: relative;
  width: 260px;
  height: 260px;
  margin: auto;
  overflow: hidden;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid #333;
  transition: transform 6s cubic-bezier(0.1, 0.8, 0.3, 1);
}

.wheel-svg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 20px solid red;
  z-index: 2;
}

.result {
  font-weight: 600;
  transition: all 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.q-dialog__inner {
  overflow: hidden !important; /* odstráni scrollbar počas spinovania */
}
</style>
