<template>
  <div class="sign-up">
    <div class="sign-up-window">
      <div class="title">
        <h1>Sign Up</h1>
      </div>
      <form>
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email">
        <label for="phone-number">Phone number</label>
        <input type="tel" id="phone-number" v-model="phone">
        <label for="password">Password (min. 6 chars)</label>
        <input type="password" id="password" v-model="password">
        <label for="repeat-password">Repeat password</label>
        <input type="password" id="repeat-password" v-model="repeatPassword">
      </form>
      <button @click="signUp()">Sign Up</button>
    </div>
    <VerificationWindowVue :name=name />
    <div id="reCAPTCHA"></div>
  </div>
</template>

<script>
import VerificationWindowVue from '@/components/VerificationWindow.vue'

export default {
  components:{
    VerificationWindowVue
  },
  data() {
    return{
      name: null,
      email: null,
      phone: null,
      password: null,
      repeatPassword: null
    }
  },
  methods:{
    signUp(){
      if(this.password === this.repeatPassword ){
        let user = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          password: this.password,
        }
        this.$store.dispatch('signUp',user )
      } else {
        alert("password and password do not match")
      }
      
    }
  }
}
</script>