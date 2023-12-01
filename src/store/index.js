import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'

Vue.use(Vuex)

import { initializeApp } from 'firebase/app';
import { 
    getDoc, 
    getDocs, 
    collection,
    doc, 
    getFirestore, 
    setDoc,
    updateDoc,
    deleteField
} from 'firebase/firestore'
import { 
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut
 } from "firebase/auth";

const APP = initializeApp({
  apiKey: "AIzaSyBCU69p5FuwKBWgSen223bBto7SEVDv-fk",
  authDomain: "notes-6c6e9.firebaseapp.com",
  projectId: "notes-6c6e9",
  storageBucket: "notes-6c6e9.appspot.com",
  messagingSenderId: "162086957816",
  appId: "1:162086957816:web:b5a4b5ac301cead32c010d",
  measurementId: "G-RM011Z8JF0"
});

const DB = getFirestore(APP);
const AUTH = getAuth(APP);
const CATEGORIES = collection(DB, 'Categories')

function getCollectionFromDB(c) {
  return getDocs(c)
}

const HEADER_HEIGHT = 50

export default new Vuex.Store({
  state: {
    user: null,
    uid: null,
    notes:[],
    categories: [],
    isVerificationWindow: false,
    confirmationResult: {},
    credential:null
  },
  getters: {
    getNotes(state){
      return state.notes
    },
    getCategories(state){
      return state.categories
    },
    getIndexById: (state) => (id) =>{
      let indexNote
      state.notes.filter((notes,index) => {
        notes.id.includes(id) ? indexNote = index : -1
      })
      return indexNote
    },
    getUID(state){
      return state.uid
    },
    getIsVerificationWindow(state){
      return state.isVerificationWindow
    },
    getUser(state){
      return state.user
    },
  },
  actions: {
    getNotesFromDB(context){
      onAuthStateChanged(AUTH, (user) => {
        if(user){
          context.state.user = user
          context.state.uid = user.uid
          
          getDoc(doc(DB,'Notes', context.state.uid))
            .then((notes) => {
              if(notes.data()){
                context.state.notes = Object.values(notes.data())
              } else{
                context.state.notes = []
              }
            })
          if (!router.currentRoute.path.includes('/notes-board/' + context.state.user.displayName)) {
            router.push('/notes-board/' + context.state.user.displayName);
          }
        }
      })
    },
    getCategoriesFromDB(context){
      getCollectionFromDB(CATEGORIES)
        .then(responce => {
          context.state.categories = []
          responce.forEach(document => {
            context.state.categories.push(document.data())
          });
        });
    },
    addNote(context, categoryId){
      let id = Date.now().toString()
      let newNote =  {
          categoryId,
          id,
          coords:{
            x: 0,
            y:HEADER_HEIGHT},
          text: ''
      }
      context.state.notes.push(newNote)
      let notesObj = Object.assign({}, context.state.notes)
      updateDoc(doc(DB,'Notes', context.state.uid), notesObj)
    },
    updateNote(context, note){
      let index = context.getters['getIndexById'](note.id)
      context.state.notes.splice(index, 1, note)
      let notesObj = Object.assign({}, context.state.notes[index])
      updateDoc(doc(DB, "Notes", context.state.uid), {[index]:notesObj})
    },
    deleteNote(context, id){
      let index = context.getters.getIndexById(id.toString())
      context.state.notes.splice(index, 1)
      updateDoc(doc(DB, "Notes", context.state.uid), {
        [index]: deleteField()
      });
    },
    signUp(context, setUser){
      if(!window.recaptchaVerifier){
        window.recaptchaVerifier = new RecaptchaVerifier('reCAPTCHA', {'size':'invisible'}, AUTH);
      }
      context.state.credential = EmailAuthProvider.credential(setUser.email, setUser.password)
      try{
        console.log(APP.getUserByPhoneNumber(setUser.phone))
        signInWithPhoneNumber(AUTH, setUser.phone, window.recaptchaVerifier)
          .then((confirmationResult ) =>{
            context.state.confirmationResult = confirmationResult 
            context.state.isVerificationWindow = true
          }).catch((error) => {
            alert(error)
          })
      } catch{

        alert("Phone is alredy use")
      }
      
    },
    signOut(context){
      signOut(AUTH).then(() => {
        context.state.user = null
        context.state.uid = null
        context.state.notes = null
        router.push('/')
      })
    },
    SMSConfirm(context, verify){
      context.state.confirmationResult.confirm(verify.verificationCode)
        .then(() => {
          if(verify.name){
            linkWithCredential(AUTH.currentUser, context.state.credential)
              .then((result)=>{
                updateProfile(AUTH.currentUser, {
                  displayName: verify.name
                })
                router.push('/')
                context.state.isVerificationWindow = false
                setDoc(doc(DB, 'Notes', result.user.uid),{})
            })
          } 
            context.state.isVerificationWindow = false
        })
        .catch((error) => {
          alert(error)
        });
    },
    verificationWindowTurnOff(context){
      context.state.isVerificationWindow = false
    },
    signIn(context, user){
      context.state.notes = null
      if (user.isSaveAuth){
        setPersistence(AUTH, browserLocalPersistence)
          .then(() => {
            if(user.isEmail){
              return signInWithEmailAndPassword(AUTH, user.email, user.password)
            } else{
              window.recaptchaVerifier = new RecaptchaVerifier('reCAPTCHA', {'size':'invisible'}, AUTH);
              return signInWithPhoneNumber(AUTH, user.phone, window.recaptchaVerifier)
                      .then((confirmationResult ) =>{
                        context.state.confirmationResult = confirmationResult 
                        context.state.isVerificationWindow = true
                      })
            }
          }).catch((error) => {
            alert(error)
          })
      } else {
        setPersistence(AUTH,browserSessionPersistence)
        .then(() => {
          if(user.isEmail){
            return signInWithEmailAndPassword(AUTH, user.email, user.password)
          } else{
            if(!window.recaptchaVerifier){
              window.recaptchaVerifier = new RecaptchaVerifier('reCAPTCHA', {'size':'invisible'}, AUTH);
            }
            return signInWithPhoneNumber(AUTH, user.phone, window.recaptchaVerifier)
                    .then((confirmationResult ) =>{
                      context.state.confirmationResult = confirmationResult 
                      context.state.isVerificationWindow = true
                    })
          }
        }).catch((error) => {
          alert(error)
        })
      }
      
    }
  },
})
