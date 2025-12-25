<template>
  <div class="text-center">
    <q-btn @click="field = field === 0 ? 1 : 0">Dalej</q-btn>
  </div>
  <q-list bordered separator>
    <div v-if="field == 0">
      <q-item v-for="item in avbItems" :key="item.id">
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption>{{ item.price }} Kreditov</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-input
            v-model.number="item.choosenAmount"
            type="number"
            label="Koľko chceš kúpiť"
            outlined
            dense
            min="1"
            max="100"
            style="width: 100px;"
          />
        </q-item-section>
        <q-item-section class="q-pa-md">
          <q-btn @click="buyItem(item)" class="bg-primary text-white">Kúpiť</q-btn>
        </q-item-section>
      </q-item>
    </div>

    <div v-if="field == 1" class="q-pa-md">
      <b>Pozadia si tu mozes kupit</b>
      <q-item v-for="item in avbBackgrounds" :key="item.id">
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption>{{ item.price }} Kreditov</q-item-label>
        </q-item-section>

        <q-item-section class="q-pa-md">
          <q-btn @click="buyItem(item)" class="bg-primary text-white">Kúpiť</q-btn>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { ShopItem } from './models';
  const avbItems: ShopItem[] = [
    { id: 'home', title: 'Cesta domov - odratanie z ceny', price: 1, choosenAmount: 0 },
    { id: 'beer', title: 'Pivo', price: 5, choosenAmount: 0 },
    { id: 'eat', title: 'Eat', price: 8, choosenAmount: 0 },
    { id: 'ride_ba', title: 'Odvoz po BA - 1KM - 1 kredit', price: 1, choosenAmount: 0 },
  ];
  const avbBackgrounds: ShopItem[] = [
    { id: 'bg1', title: 'Danik na stvorkolke', price: 0.1, choosenAmount: 1 },
    { id: 'bg2', title: 'China', price: 1.2, choosenAmount: 1 },
    { id: 'bg3', title: 'Stranger things', price: 5.0, choosenAmount: 1 },
  ];
export default defineComponent({
  name: 'IndexPage',
  emits: ['refreshCredits'],
  components: {
  },

  data() {
    return {
      avbItems,
      quantity: 0,
      field: 0,
      avbBackgrounds
    };
  },
  methods: {
    async buyItem(item: ShopItem) {
      console.log(avbBackgrounds)
      if (item.choosenAmount > 0 && item.choosenAmount <= 100) {
        const totalPrice = item.price * item.choosenAmount;
         const resp = await fetch('https://timer-backend-24n3.vercel.app/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId: item.id, quantity: item.choosenAmount })
        });
        if (resp.ok) {
          alert(`Kúpené ${item.choosenAmount} x ${item.title} za ${totalPrice} kreditov.`);
          this.$emit('refreshCredits')

        } else {
          alert('Isto mas dost kreditov? (Len tipujem error lebo som to nekontroloval uz)');
        }
        if (item.id.startsWith('bg')) {
          //sada
        }
        else{
          item.choosenAmount = 0;
        }
      } else {
        alert('Kolko chces kupit wtf?');
      }
    }
    },
   mounted() {
   
  },
 
});
</script>
