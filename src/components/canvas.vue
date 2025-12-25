<template>
    <q-dialog   :model-value="modelValue"
                persistent      
                 @update:model-value="$emit('update:modelValue', $event)"
     >
        <q-card>
            <q-card-section class="toolbar">
                <div class="toolbar-controls">
                    <q-btn 
                        flat 
                        round 
                        dense 
                        icon="close" 
                        @click="$emit('update:modelValue', false)"
                        class="close-btn"
                    />
                    
                    <div class="color-picker">
                        <label>Color:</label>
                        <input 
                            type="color" 
                            v-model="currentColor" 
                            class="color-input"
                        />
                    </div>
                    
                    <div class="brush-size">
                        <label>Brush Size:</label>
                        <q-slider 
                            v-model="currentBrushSize" 
                            :min="1" 
                            :max="20" 
                            :step="1"
                            class="brush-slider"
                        />
                        <span>{{ currentBrushSize }}px</span>
                    </div>
                    
                    <q-btn 
                        flat 
                        label="Clear" 
                        icon="delete" 
                        @click="clear"
                        color="negative"
                    />
                </div>
            </q-card-section>
            
            <q-card-section class="canvas-container">
                <canvas
                    ref="canvasRef"
                    :width="width"
                    :height="height"
                    class="canvas"
                    @mousedown="startDrawing"
                    @mousemove="draw"
                    @mouseup="stopDrawing"
                    @mouseleave="stopDrawing"
                />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CanvasComponent',
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        width: {
            type: Number,
            default: 800
        },
        height: {
            type: Number,
            default: 600
        },
        brushColor: {
            type: String,
            default: '#000000'
        },
        brushSize: {
            type: Number,
            default: 2
        }
    },
    data() {
        return {
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            currentColor: '#000000',
            currentBrushSize: 2
        };
    },
    mounted() {
        const canvas = this.$refs.canvasRef as HTMLCanvasElement;
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Configure drawing settings
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
            }
        }
    },
    methods: {
        getCanvasCoords(event: MouseEvent) {
            const canvas = this.$refs.canvasRef as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (event.clientX - rect.left) * scaleX,
                y: (event.clientY - rect.top) * scaleY
            };
        },
        startDrawing(event: MouseEvent) {
            this.isDrawing = true;
            const { x, y } = this.getCanvasCoords(event);
            this.lastX = x;
            this.lastY = y;
        },
        draw(event: MouseEvent) {
            if (!this.isDrawing) return;
            
            const canvas = this.$refs.canvasRef as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                const { x, y } = this.getCanvasCoords(event);
                
                ctx.strokeStyle = this.currentColor;
                ctx.lineWidth = this.currentBrushSize;
                
                ctx.beginPath();
                ctx.moveTo(this.lastX, this.lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                
                this.lastX = x;
                this.lastY = y;
            }
        },
        stopDrawing() {
            this.isDrawing = false;
        },
        getContext(type: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' = '2d') {
            const canvas = this.$refs.canvasRef as HTMLCanvasElement;
            return canvas?.getContext(type);
        },
        clear() {
            const canvas = this.$refs.canvasRef as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }
});
</script>

<style scoped>
.toolbar {
    background-color: #f5f5f5;
    padding: 10px;
}

.toolbar-controls {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.close-btn {
    margin-right: auto;
}

.color-picker {
    display: flex;
    align-items: center;
    gap: 10px;
}

.color-input {
    width: 50px;
    height: 35px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}

.brush-size {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
}

.brush-slider {
    flex: 1;
}

.canvas-container {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e0e0e0;
}

.canvas {
    display: block;
    background-color: white;
    cursor: crosshair;
    max-width: 100%;
}
</style>