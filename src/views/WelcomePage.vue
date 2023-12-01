<template>
    <div class="welcome">
        <div class="welcome-window">
            <div class="welcome-text">
                <h1>Welcome to your notes!</h1>
            </div>
            <div class="description">
                <p>Here you can write down all your thoughts and desires. All entries are saved automatically.</p>
                <div class="warning">
                    <p>!    WARNING    !</p>
                    <p>This application does not guarantee the safety and security of your data. Please do not store here your passwords, bank card details, or any other information that in the hands of intruders can harm you.</p> 
                </div>
                
            </div>
            <div class="sign-window">
            <div class="sign-in">
                <router-link to="/sign-in">
                    <button id="signInButton">
                        Sign In
                    </button>
                </router-link>
            </div>
            <div class="sign-up">
                <router-link to="/sign-up">
                    <button id="signUpButton">
                        Sign Up
                    </button>
                </router-link>
            </div>
            </div>
        </div>
    </div>
</template>