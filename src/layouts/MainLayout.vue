<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated class="bg-peimary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Timer </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="column bg-black text-white items-center q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-btn label="Co mam robit" color="primary" @click="displayInfo = true" />


      <q-dialog v-model="displayInfo">
        <q-carousel
            v-model="slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="primary"
            navigation-icon="radio_button_unchecked"
            navigation
            padding
            class="bg-white shadow-1 rounded-borders"
          >
          <q-carousel-slide :name="1" class="q-pa-md flex flex-column items-center justify-center">
            <q-icon name="info" color="primary" size="56px" class="q-mb-md" />
            <div class="text-center q-pa-sm">
              {{ infoText }}
            </div>
          </q-carousel-slide>

          <q-carousel-slide :name="2" class="q-pa-md flex flex-column items-center justify-center">
            <div class="text-center">
              <div class="text-h6 q-mb-md">Gamesy</div>
            <q-icon name="games" color="primary" size="56px" class="q-mb-md" />
              <div class="text-center">
                <div class="text-h6 q-mb-md">HRY ESTE NEFUNGUJU</div>
              </div>
              <div class="q-gutter-sm">
                <q-btn v-for="game in gamesList" :key="game.id" :label="game.title" color="secondary" class="full-width"/>
              </div>
            </div>
          </q-carousel-slide>
        
        </q-carousel>
      </q-dialog>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-btn
        @click="showShop = true; fetchCredits()" label="Shop" color="primary"
       
      />

      <q-dialog v-model="showShop" :backdrop-filter="backdropFilter">
        <q-card>
          <q-card-section class="row items-center q-pb-none text-h6">
            Šop
          </q-card-section>

          <q-card-section class="text-center q-pa-md">
            Tu si mozes kupit veci za kredity <br>
            Pocet kreditov: {{ credits }}
          </q-card-section>
          <shopIOverlay @refreshCredits="fetchCredits"/>
          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <taskComponent />

    <playMusic />
    <div class="q-pa-md q-gutter-sm">
    <q-btn @click="displayWheel = true" label="Spin the Wheel" color="primary" />
    </div>

    <spinWheel v-model="displayWheel"/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Game } from 'components/models';
import shopIOverlay from 'src/components/shopIOverlay.vue';
import taskComponent from 'src/components/taskComponent.vue';
import playMusic from 'src/components/playMusic.vue';
import spinWheel from 'src/components/wheel.vue';
const gamesList: Game[] = [
    { id: 1, title: 'Dino Runner', script: 'dinoRunner' },
    { id: 2, title: 'Clicker', script: 'clicker' },
    { id: 3, title: 'Cannon Shooter', script: 'cannonShooter' },
    { id: 4, title: 'Quiz', script: 'quiz' },
  ];

  const infoText = "O nvmkolkocasu tam pise sa ti zobrazi co znamena KJNTSSNP. Zahraj si daco kym cakas (dole slider) sak doraz to bude. Raz za cas pridam daco. Tieto co tam su teraz su fixne, tie dohravat nemusis to len kym cakas nech sa nenudis. Also raz za cas (ked budem stihat) budem pridavat dajaky fun text alebo info alebo ulohy takze dojdi sa pozriet. Za ulohy mozes dostat kredity, tie potom mozes minat. Tie su v side bare. ENJOY :D"
export default defineComponent({
  name: 'MainLayout',

  
  components: {
  shopIOverlay,
  taskComponent,
  playMusic,
  spinWheel,
  },

  data() {
    return {
      leftDrawerOpen: false,
      gamesList,
      displayInfo: false,
      slide: 1,
      infoText,
      showShop: false,
      backdropFilter: 'blur(4px)',
      credits: 0,
      displayWheel: false,
    };
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async fetchCredits() {
      try {
        const response = await fetch('https://timer-backend-24n3.vercel.app/api/getCredits');
        const data = await response.json();
        this.credits = data.message || 0;
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
  },
  mounted() {
    void this.fetchCredits();
  },
  
});
</script>
