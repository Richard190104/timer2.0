<template>
    <div class="q-pa-md q-gutter-sm">
     <q-btn label="Task" :color="task.completed ? 'green' : 'red'" @click="displayed = true"  />
     <q-dialog v-model="displayed" :backdrop-filter="backdropFilter">
        <q-card>
          <q-card-section class="row items-center q-pb-none text-h6">
            Task
          </q-card-section>

          <q-card-section class="text-center q-pa-md">
            {{ task.message }}
          </q-card-section>
            <q-card-section class="text-center q-pa-md">
                {{ task.CommentedText }}
            </q-card-section>
            <q-card-section>
                Kredity za spravnu odpoved: {{ task.testCredits }}
                <p v-if="task.completed">Uloha je done</p>
                <p v-if="!task.completed">Uloha nie je hotova</p>
            </q-card-section>
             <q-item-section center class="q-pa-md flex flex-center">  
                <q-input
                v-model.number="response"
                type="number"
                label="Tvoja odpoved"
                outlined
                dense
                style="width: 100px;"
                />
            </q-item-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
            <q-btn flat label="Submit" color="primary" @click="submitResponse" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      </div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Task } from './models';
const task: Task = {
    message: '1',
    CommentedText: 'Sample Task',
    completed: false,
    testCredits: 0,
};
const response = 0;
export default defineComponent({
  name: 'IndexPage',
  components: {
  },

  data() {
    return {
     task,
     displayed: false,
     backdropFilter: 'blur(4px)',
     response,
    };
  }, 
  methods: {
    async getTask(){
        try {
        const response = await fetch('https://timer-backend-24n3.vercel.app/api/getTask')
        const data = await response.json()
    
        this.task.message = data.message
        this.task.CommentedText = data.CommentedText
        this.task.completed = data.completed
        this.task.testCredits = data.testCredits
        } catch (error) {
        console.error('Fetch error:', error)
        }
    },
    async submitResponse(){
        try {
            const resp = await fetch('https://timer-backend-24n3.vercel.app/api/checkAnswerw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: this.response }),
            });

            if (!resp.ok) {
                console.error('Server responded with status:', resp.status);
                return;
            }

            const data = await resp.json();
            console.log('Response data:', data);
            if (data && data.correct) {
                alert('Dobre tyyyyyyyyyyy');
                this.displayed = false;
                this.response = 0;
                await this.getTask();
            } else {
                alert('Asi nedobre mas cujes');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    },
  },
   mounted() { 
    void this.getTask();
  },
 
});
</script>
