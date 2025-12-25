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
             
              <div class="q-gutter-sm">
                <q-btn v-for="game in gamesList" :key="game.id" :label="game.title" @click="openGame(game)" color="secondary" class="full-width"/>
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

      <spinWheel v-model="displayWheel" />

    <div class="q-pa-md q-gutter-sm">
      <q-btn @click="displayCanvas = true" label="Nakresli si obrazok" color="primary" />
    </div>
      <canvasComponent v-model="displayCanvas" />
    <div class="q-pa-md q-gutter-sm">
       <q-btn
        @click="displaybgChange = true; getAvailableBackgrounds()" label="Zmena pozadia" color="primary"
       
      />
      <q-dialog v-model="displaybgChange" >
         <q-card>
            <q-card-section class="column items-center q-pb-none text-h6">
            Tu si zmenis pozadie ktore si kupujes v shope

            <div v-if="ownedBG.length === 0">
              Nemáš žiadne pozadia :(
            </div>
            <div v-else class="row wrap gap q-mt-md">
              <q-btn 
              v-for="bg in ownedBG" 
              :key="bg.link" 
              class="bg-item" 
              style="width: 150px; height: 150px; min-width: 150px; min-height: 150px; background-color: black;"
              :style="{ backgroundImage: `url('${bg.link}')`, backgroundSize: 'cover', backgroundPosition: 'center' }"
              @click="changebg(bg); displaybgChange = false;"
              />
            </div>
            </q-card-section>
          
        </q-card>
      </q-dialog>
    </div>
    </q-drawer>

  <q-page-container ref="pageContainer">
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
import canvasComponent from 'src/components/canvas.vue';

const gamesList: Game[] = [
    { id: 1, title: 'Clicker', script: 'clicker' },
  ];

  const infoText = "O nvmkolkocasu tam pise sa ti zobrazi co znamena KJNTSSNP. Zahraj si daco kym cakas (dole slider) sak doraz to bude. Raz za cas pridam daco. Tieto co tam su teraz su fixne, tie dohravat nemusis to len kym cakas nech sa nenudis. Also raz za cas (ked budem stihat) budem pridavat dajaky fun text alebo info alebo ulohy takze dojdi sa pozriet. Za ulohy mozes dostat kredity, tie potom mozes minat. Tie su v side bare. ENJOY :D"
export default defineComponent({
  name: 'MainLayout',

  
  components: {
  shopIOverlay,
  taskComponent,
  playMusic,
  spinWheel,
  canvasComponent,
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
      displayCanvas: false,
      displaybgChange: false,
      ownedBG: [] as {link: string, color: string}[],
    };
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async fetchCredits() {
      try {
        console.log(this.ownedBG)
        const response = await fetch('https://timer-backend-24n3.vercel.app/api/getCredits');
        const data = await response.json();
        this.credits = data.message || 0;
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    async openGame(game: Game) {
      await this.$router.push(`/${game.script}`)
      this.displayInfo = false 
      this.leftDrawerOpen = false 
    },
    getAvailableBackgrounds() {
      const storedBG = localStorage.getItem('backgrounds');
      if (storedBG) {
        this.ownedBG = JSON.parse(storedBG);
      }
    },
changebg(bg: {link: string, color: string}) {
  const page = document.querySelector('.q-page') as HTMLElement
  const wholePage = document.querySelector('#q-app') as HTMLElement
  if (bg.link === 'black') {
    if (!page) return

    page.classList.add('bg-black')
    page.style.removeProperty('background')
    wholePage.style.setProperty('--q-primary', "gray", 'important')

    localStorage.setItem('selectedBackground', 'black')
    return
  }

  if (!page) return
  page.style.imageRendering = 'crisp-edges'
  page.classList.remove('bg-black')
  page.style.setProperty('background-color', 'black', 'important')
  page.style.setProperty('background', `black url('${bg.link}') center/cover no-repeat`, 'important')
  wholePage.style.setProperty('--q-primary', bg.color, 'important')


  localStorage.setItem('selectedBackground', JSON.stringify(bg))
}
  },
  mounted() {
      void this.getAvailableBackgrounds()
      void this.fetchCredits()

      const savedBg = localStorage.getItem('selectedBackground')
      if (savedBg) {
        try {
          const bgObj = JSON.parse(savedBg)
          this.changebg(bgObj)
        } catch {
          if (savedBg === 'black') {
            this.changebg({ link: 'black', color: 'black' })
          }
        }
      
      }
  },
  
});
</script>
