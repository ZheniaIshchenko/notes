<template>
  <div class="note" >
    <div class="dragbar">
      <div class="dropdown" @click="dropdown(getNote.id)">

        <img src="../assets/icons/dropdown.svg">
        <button class="dropdown-button" >
          {{getCategories[getNote.categoryId].name}}

          <div class="dropdown-content" :id="'dropdown-'+getNote.id">
            <div class="category" @click="changeCategory(index)" v-for="category, index in getCategories" :key="index">
              {{ category.name}}
            </div>
          </div>

        </button>

      </div>

      <button class="close-button" @click="deleteNote(getNote.id)">
        <img src="../assets/icons/close.svg">
      </button>

    </div>

    <div class="text-field">
      <textarea cols="30" :value="getNote.text" @input="textareaInput(getNote.id, getNote.categoryId, $event.target.value)" rows="10"></textarea>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NoteComponent',
  props: {
    noteInfo: String,
  },
  computed:{
    getCategories(){
      return this.$store.getters['getCategories']
    },
    getNote(){
      return JSON.parse(this.noteInfo)
    }
  },
  methods:{
    mousedown(event){
      this.$emit('mousedown', event)
    },
    deleteNote(id){
      this.$store.dispatch('deleteNote', id)
    },
    textareaInput(id, categoryId, value){
      let updateNote={
        coords:{
          x:this.getNote.coords.x,
          y:this.getNote.coords.y,
        }, 
        text:value,
        id,
        categoryId
      }
      this.$store.dispatch('updateNote', updateNote)
    },
    changeCategory(newCategoryIndex){
      let updateNote={
        coords:{
          x:this.getNote.coords.x,
          y:this.getNote.coords.y,
        }, 
        text:this.getNote.text,
        id:this.getNote.id,
        categoryId:newCategoryIndex
      }
      
      this.$store.dispatch('updateNote', updateNote)
    },
    dropdown(id){
      document.getElementById('dropdown-'+id).classList = document.getElementById('dropdown-'+id).classList.length-1 
        ? 'dropdown-content' 
        : 'dropdown-content active'
    },
  },
}
</script>