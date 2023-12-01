<template>
  <div class="sign-in">
    <div class="sign-in-window">
      <div class="title">
        <h1>Sign In</h1>
      </div>
      <form>
        <div class="provider active" id="email-sign-in">
          <label >Email</label>
          <input type="email" id="email" v-model="email" :readonly=!getDisable>
          <label >Password</label>
          <input type="password" id="password" v-model="password" :readonly=!getDisable>
        </div>
      </form>
      <div class="save-auth">
        <input type="checkbox" id="save-auth" v-model="isSaveAuth">
        <label for="save-auth">Remember me</label>
      </div>
      <button @click="signIn()">
        Sign in 
      </button>
    </div>
    <VerificationWindowVue v-if="getIsVerificationWindow"/>
    <div id="reCAPTCHA"></div>
  </div>
</template>

<script>
import VerificationWindowVue from '@/components/VerificationWindow.vue'

export default {
  components:{
    VerificationWindowVue
  },
  data(){
    return{
      email: null,
      phone: null,
      password: null,
      repeatPassword: null,
      isSaveAuth: false,
      isEmail: true
    }
  },
  computed:{
    getUID(){
      return this.$store.getters['getUID']
    },
    getDisable(){
      return this.isEmail
    },
    getIsVerificationWindow(){
      return this.$store.getters['getIsVerificationWindow']
    }
  },
  methods:{
    signIn(){
      this.$store.dispatch('signIn', {
        email: this.email,
        phone: this.phone,
        password: this.password,
        isSaveAuth: this.isSaveAuth,
        isEmail: this.isEmail
      })
    },
  },
}
</script>