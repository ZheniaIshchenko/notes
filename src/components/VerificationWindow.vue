<template>
  <div class="verification-modal-window" v-if="getIsVerificationWindow">
      <div class="area" @click="turnOffWindow($event)">
        <div class="verification-window">
          <h2>Enter confirmation code</h2>
          <input type="number" v-model="verificationCode">
          <button @click="SMSConfirm()">Verify</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'VerificationWindow',
  props:{
    name: String
  },
  data(){
    return{
        verificationCode: null
    }
  },
  computed:{
    getIsVerificationWindow(){
      return this.$store.getters['getIsVerificationWindow']
    }
  },
  methods:{
    turnOffWindow(event){
      if(event.target.className.includes('area')){
        this.$store.dispatch('verificationWindowTurnOff')
      }
    },
    SMSConfirm(){
      this.$store.dispatch('SMSConfirm', {
        verificationCode:this.verificationCode,
        name: this.name,
      })
    },
  },
}
</script>