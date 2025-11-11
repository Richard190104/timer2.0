<template>
  <q-page class="row items-center justify-evenly bg-black">
    <div class="column items-center q-pa-lg q-gutter-md text-center">
  <div class="row justify-center q-gutter-md text-h1 text-weight-bold text-primary">
    <div>{{ timeLeft.days }}<span class="text-subtitle1 text-white"> days</span></div>
    <div>{{ timeLeft.hours }}<span class="text-subtitle1 text-white"> hours</span></div>
    <div>{{ timeLeft.minutes }}<span class="text-subtitle1 text-white"> minutes</span></div>
    <div>{{ timeLeft.seconds }}<span class="text-subtitle1 text-white"> seconds</span></div>
  </div>
</div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const timeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};
export default defineComponent({
  name: 'IndexPage',

  components: {
  },

  data() {
    return {
      timeLeft,
      intervalId: null as unknown as number,
    };
  },
  methods: {
    async getTime() {
      try {
      const response = await fetch('https://timer-backend-24n3.vercel.app/api/hello')
      const data = await response.json()

      if (data.access === 'denied') {
        this.timeLeft = {
          days: data.days,
          hours: data.hours,
          minutes: data.minutes,
          seconds: data.seconds,
        }
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
    },
  },
   mounted() {
    void this.getTime() 

    setInterval(() => {
      void this.getTime() 
    }, 1000)
  },
 
});
</script>
