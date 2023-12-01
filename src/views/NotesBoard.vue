<template>
  <div class="board" @mouseup="mouseup()" @mousemove="mouseMove($event)">

     <div class="categories">
      <div class="category" v-for="category, index in getCategories" :key="index">
        <button @click="chooseCategory(category.id, $event)">
          {{ category.name }}
        </button>
      </div>
    </div>

    <div class="notes-board">
      <NoteComponent @mousedown.native="mousedown($event, note, index)" v-for="note, index in getNotes" :key="index" :noteInfo="JSON.stringify(note)" :id="note.id" :style='"left:" + note.coords.x  + "px;top: " + note.coords.y + "px;"'/>
    </div>

    <button class="add-note-btn" @click="addNote()"><img src="../assets/icons/add.png"></button>
    <button class="sign-out-btn" @click="signOut()"><img src="../assets/icons/log-out.png"></button>
  </div>
</template>

<script>
import NoteComponent from '../components/NoteComponent.vue'

const headerHeight = 50
const noteHeight = 250
const noteWidth = 200

export default {
  components: {
    NoteComponent
  },
  data(){
    return{
      currentCategories:[],
      startPoint:{},
      currentCoords:{},
      moved:{
        isMove: false
      },
      zIndex:0
    }
  },
  computed:{
    getCategories(){
      return this.$store.getters['getCategories']
    },
    getNotes(){
      if(this.currentCategories.length) return this.$store.getters['getNotes'].filter(note => this.currentCategories.includes(note.categoryId))
      return this.$store.getters['getNotes']
    },
  },
  methods:{
    chooseCategory(id, event){
      event.target.classList = this.currentCategories.indexOf(id) >=0 ? '': 'active'
      return this.currentCategories.includes(id) 
        ? this.currentCategories.splice(this.currentCategories.indexOf(id),1) 
        : this.currentCategories.push(id)
    },
    addNote(){
      this.currentCategories.length 
      ? this.$store.dispatch('addNote', Math.min.apply(null, (this.currentCategories))) 
      : this.$store.dispatch('addNote', 0)
    },
    mousedown(event, note, index){
      this.zIndexPlus(note.id)
      this.startPoint = {
        x:event.x,
        y:event.y
      }
      this.currentCoords = {
        x:document.getElementById(note.id).getBoundingClientRect().x,
        y:document.getElementById(note.id).getBoundingClientRect().y
      }
      this.moved={
        isMove:true,
        id: note.id,
        categoryId: note.categoryId,
        index
      }
    },
    mouseup(){
      if(this.moved.isMove){
        this.moved.isMove = false
        let updateNote={
          coords:{
            x:document.getElementById(this.moved.id).getBoundingClientRect().x,
            y:document.getElementById(this.moved.id).getBoundingClientRect().y
          }, 
          text:this.getNotes[this.moved.index].text,
          id:this.moved.id,
          categoryId: this.moved.categoryId
        }
        this.$store.dispatch('updateNote', updateNote)
      }
      
    },
    mouseMove(event){
      if(this.moved.isMove){
        let note = document.getElementById(this.moved.id)
        note.style.left =  this.currentCoords.x+event.x-this.startPoint.x < 0 
          ? 0 
          : this.currentCoords.x+event.x-this.startPoint.x + noteWidth > window.innerWidth 
            ? window.innerWidth-noteWidth + 'px' 
            : (this.currentCoords.x+ event.x-this.startPoint.x) + 'px'
        note.style.top =  this.currentCoords.y+ event.y-this.startPoint.y< headerHeight 
          ? headerHeight + 'px' 
          : this.currentCoords.y+event.y-this.startPoint.y + noteHeight > window.innerHeight 
            ? window.innerHeight-noteHeight + 'px' 
            : (this.currentCoords.y+ event.y-this.startPoint.y) + 'px'
      }
    },
    signOut(){
      this.$store.dispatch('signOut')
    },
    zIndexPlus(id){
      document.getElementById(id).style.zIndex = ++this.zIndex
    }, 
  },
}
</script>

<style>
  @import '../assets/less/index.less';
</style>
